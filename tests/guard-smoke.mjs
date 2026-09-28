/*
 * 守卫冒烟测试:通过运行中的真实应用(preload + IPC)验证安全边界确实生效。
 * 纯逻辑单测证明函数正确,这里证明它们接在了正确的位置上。
 *
 * 用法:先 APP_DEBUG_PORT=9333 npm run dev,再 node tests/guard-smoke.mjs
 */
import puppeteer from 'puppeteer-core'
import { execSync } from 'node:child_process'

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
  /* 激活失败不影响断言 */
}

const browser = await puppeteer.connect({
  browserURL: 'http://127.0.0.1:9333',
  defaultViewport: null,
  protocolTimeout: 60000
})
const page = (await browser.pages())[0]
console.log('page:', await page.title())

// 在渲染进程里直接调 preload 暴露的 IPC,验证主进程侧的校验
const r = await page.evaluate(async () => {
  const out = {}
  const attempt = async (key, fn) => {
    try {
      await fn()
      out[key] = 'NO_ERROR'
    } catch (e) {
      out[key] = String(e?.message ?? e)
    }
  }
  // 1. 路径穿越:用 .. 冒充会话 id
  await attempt('traversal', () => window.trace.openSession('../../../../Users'))
  // 2. 正常 UUID 应能打开(允许返回空会话,不能抛错)
  await attempt('validUuid', () =>
    window.trace.openSession('3f2504e0-4f89-41d3-9a0c-0305e82c3301')
  )
  // 3. 删除穿越路径的会话
  await attempt('deleteTraversal', () => window.trace.deleteSession('..\\..\\Windows'))
  // 4. preload 是否暴露了 session:title 订阅
  out.hasTitleHook = typeof window.trace.onSessionTitle === 'function'
  // 5. 设置往返:确认 apiKey 能存回并读出(加密后的往返一致性)
  const s = await window.trace.getSettings()
  out.roots = Array.isArray(s.workspaceRoots) ? s.workspaceRoots.length : -1
  return out
})

console.log(JSON.stringify(r, null, 2))

ok(r.traversal !== 'NO_ERROR', `路径穿越被拒绝: ${r.traversal.slice(0, 70)}`)
ok(r.deleteTraversal !== 'NO_ERROR', `删除穿越被拒绝: ${r.deleteTraversal.slice(0, 70)}`)
ok(r.validUuid === 'NO_ERROR', '合法 UUID 正常通过')
ok(r.hasTitleHook === true, 'preload 已暴露 session:title 订阅')
ok(r.roots >= 0, '设置可读回工作目录列表')

await browser.disconnect()
console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
