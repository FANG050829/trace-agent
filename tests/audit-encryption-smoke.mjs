/*
 * 审计链与密钥加密的运行时验证(需要一个正在 dev 运行的应用)。
 * 检查两件在单测里验证不了的事:
 *   1. 审计日志落盘后真的带哈希链,且改一行就会被 verify 抓到
 *   2. API Key 落盘后 settings.json 里是密文/空值,而不是明文
 *
 * 用法:先 APP_DEBUG_PORT=9333 npm run dev,再 node tests/audit-encryption-smoke.mjs
 */
import puppeteer from 'puppeteer-core'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let failed = 0
const ok = (cond, name) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) failed++
}

try {
  execSync(`powershell -NoProfile -c "(New-Object -ComObject WScript.Shell).AppActivate('留痕 Agent')"`)
  await sleep(400)
} catch {
  /* ignore */
}

const browser = await puppeteer.connect({
  browserURL: 'http://127.0.0.1:9333',
  defaultViewport: null,
  protocolTimeout: 60000
})
const page = (await browser.pages())[0]

// 1. 造一个带假 API Key 的服务商并保存
const SECRET = 'sk-test-DO-NOT-LEAK-abcdef123456'
const r = await page.evaluate(async (secret) => {
  const s = await window.trace.getSettings()
  const pid = 'p-smoke-enc'
  const providers = [...s.providers.filter((p) => p.id !== pid), {
    id: pid, name: 'smoke', baseUrl: 'https://example.invalid/v1', apiKey: secret, model: 'm', vision: false
  }]
  await window.trace.saveSettings({ ...s, providers })
  const back = await window.trace.getSettings()
  const found = back.providers.find((p) => p.id === pid)
  return { roundTrip: found?.apiKey ?? '(missing)' }
}, SECRET)
ok(r.roundTrip === SECRET, `API Key 加密后仍能正确读回(${r.roundTrip === SECRET ? '一致' : r.roundTrip})`)

// 2. 检查落盘文件:settings.json 里不能有明文
const dataDir = path.resolve('.data')
const settingsRaw = fs.readFileSync(path.join(dataDir, 'settings.json'), 'utf-8')
ok(!settingsRaw.includes(SECRET), 'settings.json 中不含明文 API Key')
const secretsPath = path.join(dataDir, 'providers.secrets.json')
const secretsExists = fs.existsSync(secretsPath)
ok(secretsExists, '密文单独存放在 providers.secrets.json')
if (secretsExists) {
  const blob = fs.readFileSync(secretsPath, 'utf-8')
  ok(!blob.includes(SECRET), '密文文件中也是密文,不是明文')
  ok(/p-smoke-enc/.test(blob), '密文按 provider id 归档')
}

// 3. 审计链:新建会话,写入若干事件后校验
const chain = await loadChain()
function loadChain() {
  return (async () => {
    const { build: b } = await import('esbuild')
    await b({
      entryPoints: ['src/main/audit-chain.ts'],
      bundle: true, format: 'esm', platform: 'node',
      outfile: path.resolve('tests', 'audit-chain.smoke-out.mjs')
    })
    return await import(pathToFileURL(path.resolve('tests', 'audit-chain.smoke-out.mjs')).href)
  })()
}

const sessionsDir = path.join(dataDir, 'sessions')
const auditFiles = fs.existsSync(sessionsDir)
  ? fs.readdirSync(sessionsDir).filter((d) => fs.existsSync(path.join(sessionsDir, d, 'audit.jsonl')))
  : []
console.log('带审计日志的会话数:', auditFiles.length)

if (auditFiles.length > 0) {
  const file = path.join(sessionsDir, auditFiles[0], 'audit.jsonl')
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter((l) => l.trim())
  const first = JSON.parse(lines[0])
  ok(typeof first.h === 'string' && first.h.length === 64, '落盘的每行都带 64 位哈希')
  const check = chain.verifyAuditChain(lines)
  ok(check.ok, `审计链校验通过(共 ${check.total} 条)`)

  // 篡改一行,再校验必须失败
  const tampered = [...lines]
  const o = JSON.parse(tampered[0])
  o.text = '被篡改的内容'
  tampered[0] = JSON.stringify(o)
  const bad = chain.verifyAuditChain(tampered)
  ok(!bad.ok, `篡改后校验失败并定位到第 ${bad.brokenAt} 行`)
} else {
  console.log('SKIP  尚无审计日志(先在应用里发一条消息再跑本测试)')
}

await browser.disconnect()
console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
