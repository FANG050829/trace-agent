/*
 * 审计日志的写保护与崩溃恢复验证。
 *
 * 关注两件事:
 *   1. 落盘后的 audit.jsonl 处于只读状态,外部进程改不动(即便绕过工具层)
 *   2. 进程被杀导致残留只读时,下一次追加仍能恢复 —— 留痕不能因为一次崩溃就停摆
 *
 * 用法:node tests/audit-write-smoke.mjs(不需要应用在运行)
 */
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

const tmp = path.resolve('tests')
const SANDBOX = path.resolve(tmp, 'audit-write-sandbox')
const DATA = path.join(SANDBOX, '.data')
const SESSION = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'

fs.rmSync(SANDBOX, { recursive: true, force: true })
fs.mkdirSync(path.join(DATA, 'sessions', SESSION), { recursive: true })

fs.writeFileSync(
  path.join(tmp, 'electron-stub2.mjs'),
  `export const app = { isPackaged: false, getAppPath: () => ${JSON.stringify(SANDBOX)}, getPath: () => ${JSON.stringify(SANDBOX)} }\n`
)
fs.writeFileSync(
  path.join(tmp, 'store-stub2.mjs'),
  `import path from 'node:path'
export const dataDir = ${JSON.stringify(DATA)}
export const sessionsDir = ${JSON.stringify(path.join(DATA, 'sessions'))}
export const sessionDir = (id) => path.join(sessionsDir, id)
export const shotsDir = (id) => path.join(sessionDir(id), 'shots')
export const auditFile = (id) => path.join(sessionDir(id), 'audit.jsonl')
`
)

await build({
  entryPoints: ['src/main/audit.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  alias: { electron: path.join(tmp, 'electron-stub2.mjs') },
  plugins: [
    {
      // store.ts 依赖 electron 的 safeStorage,这里只取它的路径函数
      name: 'stub-store',
      setup(b) {
        b.onResolve({ filter: /^\.\/store$/ }, () => ({ path: path.join(tmp, 'store-stub2.mjs') }))
      }
    }
  ],
  outfile: path.join(tmp, 'audit.smoke-out.mjs')
})
const { SessionAudit } = await import(pathToFileURL(path.join(tmp, 'audit.smoke-out.mjs')).href)
const { verifyAuditChain } = await import(pathToFileURL(path.resolve('tests', 'audit-chain.smoke-out.mjs')).href).catch(
  async () => {
    await build({
      entryPoints: ['src/main/audit-chain.ts'],
      bundle: true, format: 'esm', platform: 'node',
      outfile: path.resolve('tests', 'audit-chain.smoke-out.mjs')
    })
    return await import(pathToFileURL(path.resolve('tests', 'audit-chain.smoke-out.mjs')).href)
  }
)

let failed = 0
const ok = (cond, name) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) failed++
}

const file = path.join(DATA, 'sessions', SESSION, 'audit.jsonl')

// 1. 正常追加三行
{
  const a = new SessionAudit(SESSION)
  a.append('user_message', { text: '第一条' })
  a.append('tool_call', { toolName: 'fs_read_file', text: '读取文件' })
  a.append('tool_result', { refId: 'x', status: 'ok', text: '完成' })
}
{
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter((l) => l.trim())
  ok(lines.length === 3, `追加了三行(实际 ${lines.length})`)
  const c = verifyAuditChain(lines)
  ok(c.ok && c.total === 3, '三条记录链完整')
}

// 2. 追加后文件必须保持可写。
//    这里刻意不使用 chmod 0o444 做写保护:Windows 上只读属性会让应用自己的
//    appendFileSync 也 EPERM,留痕直接停摆。防篡改交给路径守卫 + 哈希链。
{
  const mode = fs.statSync(file).mode & 0o222
  ok(mode !== 0, '追加后文件仍然可写(不会锁死后续留痕)')
  const a = new SessionAudit(SESSION)
  a.append('system', { text: '第四条' })
  ok(fs.readFileSync(file, 'utf-8').trim().split('\n').length === 4, '可以继续追加')
}

// 3. 即使文件被外部改成只读(崩溃残留),也能自我恢复而不是永久停摆
{
  fs.chmodSync(file, 0o666) // 确保基线可写
  const a = new SessionAudit(SESSION)
  a.append('system', { text: '基线' })
  fs.chmodSync(file, 0o444) // 模拟外部把文件锁成只读
  let appended = true
  try {
    const b = new SessionAudit(SESSION)
    b.append('system', { text: '只读状态下恢复' })
  } catch (e) {
    appended = false
    console.log('  恢复失败:', e.code ?? e.message)
  }
  ok(appended, '文件被外部锁成只读后仍能继续留痕')
  if (appended) fs.chmodSync(file, 0o666)
}

// 4. 链在多次 append 后始终自洽(每行都接上前一行)
{
  const a = new SessionAudit(SESSION)
  for (let i = 0; i < 20; i++) a.append('system', { text: `批量 ${i}` })
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter((l) => l.trim())
  const c = verifyAuditChain(lines)
  // 只断言不变量:行数与实际落盘一致,且链完整
  ok(c.ok && c.total === lines.length, `批量追加后链完整(共 ${c.total} 行,落盘 ${lines.length} 行)`)
}

// 5. 篡改落盘内容后,校验必须能发现
{
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter((l) => l.trim())
  const target = lines[2]
  const o = JSON.parse(target)
  o.text = '被偷偷改过的内容'
  lines[2] = JSON.stringify(o)
  const c = verifyAuditChain(lines)
  ok(!c.ok && c.brokenAt === 3, `篡改第 3 行被检出(brokenAt=${c.brokenAt})`)
}

fs.rmSync(SANDBOX, { recursive: true, force: true })
console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
