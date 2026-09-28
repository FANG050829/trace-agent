/*
 * 文件工具守卫的端到端验证:用真实的 fs 工具实现(而非纯逻辑函数)确认
 * Agent 无法改写自己的审计记录、读不走加密后的密钥、越不出工作目录。
 *
 * 把 tools/fs.ts 连同其 config 依赖一起编译;config 依赖 electron,
 * 这里用一个只提供 dataDir 的最小替身。
 *
 * 用法:node tests/fs-tool-smoke.mjs(不需要应用在运行)
 */
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

const tmp = path.resolve('tests')
const SANDBOX = path.resolve(tmp, 'fs-guard-sandbox')
const DATA = path.join(SANDBOX, '.data')
const WORK = path.join(SANDBOX, 'work')

// 干净起跑
fs.rmSync(SANDBOX, { recursive: true, force: true })
fs.mkdirSync(path.join(DATA, 'sessions', 'x'), { recursive: true })
fs.mkdirSync(WORK, { recursive: true })
fs.writeFileSync(path.join(DATA, 'settings.json'), '{"secret":1}')
fs.writeFileSync(path.join(DATA, 'providers.secrets.json'), '{"p-1":"ENC"}')
fs.writeFileSync(path.join(DATA, 'sessions', 'x', 'audit.jsonl'), '{"id":"e1","h":"aa"}\n')
fs.writeFileSync(path.join(WORK, 'note.txt'), 'hello')

// 用 stub 顶掉 electron(config.ts 只需要它)
fs.writeFileSync(
  path.join(tmp, 'electron-stub.mjs'),
  `export const app = { isPackaged: false, getAppPath: () => ${JSON.stringify(SANDBOX)}, getPath: () => ${JSON.stringify(SANDBOX)} }\n`
)

await build({
  entryPoints: ['src/main/tools/fs.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  // config.ts 从 electron 取 app;把 electron 换成 stub,其余走真实代码
  alias: { electron: path.join(tmp, 'electron-stub.mjs') },
  outfile: path.join(tmp, 'fs-tools.smoke-out.mjs')
})
const mod = await import(pathToFileURL(path.join(tmp, 'fs-tools.smoke-out.mjs')).href)

const ctx = {
  sessionId: 'x',
  audit: { append: () => {}, saveShot: () => '' },
  settings: { workspaceRoots: [WORK] },
  signal: undefined
}

let failed = 0
const ok = (cond, name) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) failed++
}
const refused = async (tool, args, name) => {
  try {
    const r = await tool.run(args, ctx)
    ok(false, `${name}(竟然成功了:${String(r.textForModel).slice(0, 60)})`)
  } catch (e) {
    ok(true, `${name} → ${String(e.message).split('\n')[0].slice(0, 64)}`)
  }
}
const { fsReadFile, fsWriteFile, fsListDir, fsDelete, fsMkdir, fsMove, fsSearch } = mod

// ---- 应用数据目录:Agent 不得读写 ----
await refused(fsReadFile, { path: path.join(DATA, 'settings.json') }, '拒绝读取 settings.json')
await refused(fsReadFile, { path: path.join(DATA, 'providers.secrets.json') }, '拒绝读取密钥文件')
await refused(fsReadFile, { path: path.join(DATA, 'sessions', 'x', 'audit.jsonl') }, '拒绝读取审计日志')
await refused(fsWriteFile, { path: path.join(DATA, 'sessions', 'x', 'audit.jsonl'), content: 'x' }, '拒绝覆写审计日志')
await refused(fsListDir, { path: DATA }, '拒绝列出数据目录')
await refused(fsSearch, { dir: DATA, keyword: 'key' }, '拒绝在数据目录内搜索')
await refused(fsDelete, { path: DATA }, '拒绝删除数据目录')

// ---- 工作目录边界 ----
await refused(fsReadFile, { path: path.join(SANDBOX, 'outside.txt') }, '拒绝读取白名单外的文件')
await refused(fsWriteFile, { path: path.join(os.homedir(), 'evil.txt'), content: 'x' }, '拒绝写白名单外的路径')
await refused(
  fsWriteFile,
  { path: path.join(WORK, '..', '..', 'escaped.txt'), content: 'x' },
  '拒绝 .. 逃逸出白名单'
)
// 数据目录即使被加进白名单也仍然拒绝
{
  const ctx2 = { ...ctx, settings: { workspaceRoots: [WORK, DATA] } }
  try {
    await fsReadFile.run({ path: path.join(DATA, 'settings.json') }, ctx2)
    ok(false, '白名单含数据目录时仍拒绝(竟然成功了)')
  } catch {
    ok(true, '白名单含数据目录时仍拒绝')
  }
}

// ---- 白名单内的正常操作不受影响 ----
{
  const r = await fsListDir.run({ path: WORK }, ctx)
  ok(r.textForModel.includes('note.txt'), '白名单内列目录正常')
  await fsWriteFile.run({ path: path.join(WORK, 'new.txt'), content: 'hi' }, ctx)
  ok(fs.readFileSync(path.join(WORK, 'new.txt'), 'utf-8') === 'hi', '白名单内写文件正常')
  const back = await fsReadFile.run({ path: path.join(WORK, 'new.txt') }, ctx)
  ok(back.textForModel.includes('hi'), '白名单内读文件正常')
  await fsMkdir.run({ path: path.join(WORK, 'sub') }, ctx)
  ok(fs.existsSync(path.join(WORK, 'sub')), '白名单内建目录正常')
  await fsMove.run({ src: path.join(WORK, 'new.txt'), dst: path.join(WORK, 'moved.txt') }, ctx)
  ok(fs.existsSync(path.join(WORK, 'moved.txt')), '白名单内移动正常')
  await fsDelete.run({ path: path.join(WORK, 'moved.txt') }, ctx)
  ok(!fs.existsSync(path.join(WORK, 'moved.txt')), '白名单内删除正常')
}

// ---- 审计日志内容没被动过 ----
{
  const auditRaw = fs.readFileSync(path.join(DATA, 'sessions', 'x', 'audit.jsonl'), 'utf-8')
  ok(auditRaw === '{"id":"e1","h":"aa"}\n', '审计日志内容保持原样')
}

fs.rmSync(SANDBOX, { recursive: true, force: true })
console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
