/*
 * 安全边界测试:会话 id 穿越、工作目录白名单、数据目录保护、审计链完整性、风险评估。
 *
 * 这些是"全程留痕、可审计"这句话能否成立的底线,改 guards.ts / shared/audit.ts /
 * tools/index.ts 时必须跑一遍。沿用 logic-test.mjs 的做法:用 esbuild 把纯逻辑
 * 编译成 ESM 后直接引入(这些模块不依赖 electron 运行时)。
 */
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import os from 'node:os'

const tmp = path.resolve('tests')

async function load(entry, out) {
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node', // guards / shared-audit / tools-index 都 import node: 内置模块
    outfile: path.join(tmp, out)
  })
  return await import(pathToFileURL(path.join(tmp, out)).href)
}

const guards = await load('src/main/guards.ts', 'guards.test-out.mjs')
const audit = await load('src/main/audit-chain.ts', 'audit-chain.test-out.mjs')
const sharedAudit = await load('src/shared/audit.ts', 'shared-audit.test-out.mjs')
const tools = await load('src/main/tools/index.ts', 'tools-index.test-out.mjs')

let failed = 0
const assert = (cond, name) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) failed++
}
const throws = (fn, name) => {
  try {
    fn()
    console.log(`FAIL  ${name}(没有抛错)`)
    failed++
  } catch {
    console.log(`PASS  ${name}`)
  }
}

const UUID = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'
const DATA = path.resolve(os.homedir(), 'AppData-test', '.data')
const ROOTS = [path.resolve(os.homedir(), 'Desktop'), path.resolve(os.homedir(), 'Documents')]

// ---- 会话 id:路径穿越的第一道门 ----
assert(guards.isValidSessionId(UUID), 'guards: 接受合法 UUID')
assert(!guards.isValidSessionId('../../../../Users/you/Documents'), 'guards: 拒绝 .. 穿越')
assert(!guards.isValidSessionId('..'), 'guards: 拒绝 ..')
assert(!guards.isValidSessionId('a/b'), 'guards: 拒绝路径分隔符')
assert(!guards.isValidSessionId(''), 'guards: 拒绝空串')
assert(!guards.isValidSessionId(null), 'guards: 拒绝 null')
assert(!guards.isValidSessionId(UUID + '/../evil'), 'guards: 拒绝 UUID 后缀拼接的穿越')
assert(!guards.isValidSessionId('3f2504e04f8941d39a0c0305e82c3301'), 'guards: 拒绝无连字符的 32 位串')

// ---- 工作目录白名单 ----
{
  const inRoot = path.join(ROOTS[0], 'a.txt')
  assert(guards.resolveInWorkspace(inRoot, ROOTS) === path.resolve(inRoot), 'guards: 白名单内路径放行')
  assert(guards.resolveInWorkspace(ROOTS[0], ROOTS) === path.resolve(ROOTS[0]), 'guards: 白名单根目录本身放行')
  throws(() => guards.resolveInWorkspace(path.join(os.homedir(), 'Windows'), ROOTS), 'guards: 白名单外拒绝')
  // 经典穿越:看起来在根目录下,实则逃逸
  throws(
    () => guards.resolveInWorkspace(path.join(ROOTS[0], '..', '..', 'Windows'), ROOTS),
    'guards: .. 逃逸出白名单被拒绝'
  )
  // 前缀相似但不同目录:Desktop2 不该被 Desktop 覆盖
  throws(
    () => guards.resolveInWorkspace(ROOTS[0] + '2\\secret.txt', ROOTS),
    'guards: 前缀相似目录不被误放行'
  )
  // 白名单为空 = 不限制
  assert(guards.resolveInWorkspace('C:\\anything', []).startsWith('C:'), 'guards: 白名单为空时不限制')
}

// ---- 数据目录保护:Agent 不得改写自己的留痕 / 读走密钥 ----
throws(() => guards.assertNotProtected(DATA, DATA), 'guards: 数据目录本身被拒')
throws(() => guards.assertNotProtected(path.join(DATA, 'settings.json'), DATA), 'guards: settings.json 被拒')
throws(() => guards.assertNotProtected(path.join(DATA, 'sessions', UUID, 'audit.jsonl'), DATA), 'guards: 审计日志被拒')
throws(() => guards.assertNotProtected(path.join(DATA, 'providers.secrets.json'), DATA), 'guards: 密钥文件被拒')
assert(guards.assertNotProtected(ROOTS[0], DATA) === path.resolve(ROOTS[0]), 'guards: 数据目录外放行')
// 组合守卫:白名单覆盖了数据目录时也必须拒绝
assert(
  (() => {
    try {
      guards.guardUserPath(path.join(DATA, 'settings.json'), [DATA], DATA)
      return false
    } catch {
      return true
    }
  })(),
  'guards: 白名单含数据目录时仍拒绝'
)

// ---- 审计链:改一个字就要被发现 ----
const ev1 = { id: 'a1', ts: 1, type: 'tool_call', text: '删除文件' }
const ev2 = { id: 'a2', ts: 2, type: 'tool_result', refId: 'a1', status: 'ok' }
const ev3 = { id: 'a3', ts: 3, type: 'assistant_message', text: 'done' }
{
  let prev = audit.AUDIT_GENESIS
  const lines = []
  for (const e of [ev1, ev2, ev3]) {
    const line = audit.serializeAuditLine(e, prev)
    lines.push(line)
    prev = JSON.parse(line).h
  }
  const okCheck = audit.verifyAuditChain(lines)
  assert(okCheck.ok && okCheck.total === 3, 'audit: 完整链校验通过')

  // 篡改中间一行的内容
  const tampered = [...lines]
  const o2 = JSON.parse(tampered[1])
  o2.text = '已删除全部文件'
  tampered[1] = JSON.stringify(o2)
  const badCheck = audit.verifyAuditChain(tampered)
  assert(!badCheck.ok && badCheck.brokenAt === 2, 'audit: 篡改内容被发现且定位到第 2 行')

  // 删掉中间一行
  const removed = [lines[0], lines[2]]
  assert(!audit.verifyAuditChain(removed).ok, 'audit: 删除中间行被发现')

  // 乱序
  const reordered = [lines[0], lines[2], lines[1]]
  assert(!audit.verifyAuditChain(reordered).ok, 'audit: 乱序被发现')

  // 旧版无哈希日志:不应误报
  assert(audit.verifyAuditChain([JSON.stringify(ev1), JSON.stringify(ev2)]).ok, 'audit: 兼容无哈希的旧日志')
}

// ---- normalizeAudit:tool_call 状态由 tool_result 归一 ----
{
  const pending = { id: 'c1', ts: 1, type: 'tool_call', status: 'pending' }
  const result = { id: 'r1', ts: 2, type: 'tool_result', refId: 'c1', status: 'ok' }
  const out = sharedAudit.normalizeAudit([pending, result])
  assert(out[0].status === 'ok', 'audit: tool_call 归一为最终状态')
  assert(out[0].id === 'c1' && out[0].type === 'tool_call', 'audit: 归一不改动其他字段')
  // 没有对应结果时保持 pending
  const alone = sharedAudit.normalizeAudit([pending])
  assert(alone[0].status === 'pending', 'audit: 无结果时保持 pending')
}

// ---- 风险评估 ----
{
  const mkTool = (name, risk) => ({ name, label: name, risk, parameters: {} })
  const del = mkTool('fs_delete', () => 'dangerous')
  const cmd = mkTool('run_command', () => 'confirm')
  const read = mkTool('fs_read_file', () => 'safe')
  const write = mkTool('fs_write_file', () => 'confirm')

  // dangerous 必须原样返回,否则 UI 标签失效
  assert(tools.assessRisk(del, {}, 'relaxed') === 'dangerous', 'risk: 删除在宽松策略下仍是 dangerous')
  assert(tools.assessRisk(del, {}, 'strict') === 'dangerous', 'risk: 删除在严格策略下是 dangerous')
  // 命令执行永不被策略自动放行
  for (const p of ['relaxed', 'standard', 'strict']) {
    assert(tools.assessRisk(cmd, {}, p) === 'confirm', `risk: 命令执行在 ${p} 下仍需确认`)
  }
  // 宽松策略只对只读工具免确认
  assert(tools.assessRisk(read, {}, 'relaxed') === 'safe', 'risk: 宽松下只读工具免确认')
  assert(tools.assessRisk(write, {}, 'relaxed') === 'confirm', 'risk: 宽松下写文件仍需确认')
  // 严格策略下 confirm 也不放行
  assert(tools.assessRisk(write, {}, 'strict') === 'confirm', 'risk: 严格下写文件需确认')
  assert(tools.assessRisk(read, {}, 'strict') === 'safe', 'risk: 严格下只读工具仍免确认')
}

console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
