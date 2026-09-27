/* 核心逻辑单元验证:healTranscript / compactMessages / deleteGuard 规则 */
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const tmp = path.resolve('tests')

// 把 compact.ts 编译成可运行的 ESM(它只依赖 shared/types 的类型,无运行时依赖)
await build({
  entryPoints: ['src/main/agent/compact.ts'],
  bundle: true,
  format: 'esm',
  outfile: path.join(tmp, 'compact.test-out.mjs')
})
const { healTranscript, compactMessages } = await import(pathToFileURL(path.join(tmp, 'compact.test-out.mjs')).href)

let failed = 0
const assert = (cond, name) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) failed++
}

// ---- healTranscript ----
// 1. 孤儿 tool_calls(取消后的典型损坏)→ 补合成 tool 消息
{
  const msgs = [
    { role: 'user', content: 'hi' },
    { role: 'assistant', content: '', tool_calls: [{ id: 'c1', type: 'function', function: { name: 'a', arguments: '{}' } }] }
  ]
  const r = healTranscript(msgs)
  assert(r.changed === true, 'heal: 检测到损坏')
  assert(r.messages.length === 3 && r.messages[2].role === 'tool' && r.messages[2].tool_call_id === 'c1', 'heal: 补齐缺失 tool 消息')
}
// 2. 多个 tool_call 只回应了一半 → 只补缺失的
{
  const msgs = [
    { role: 'user', content: 'hi' },
    {
      role: 'assistant',
      content: '',
      tool_calls: [
        { id: 'c1', type: 'function', function: { name: 'a', arguments: '{}' } },
        { id: 'c2', type: 'function', function: { name: 'b', arguments: '{}' } }
      ]
    },
    { role: 'tool', tool_call_id: 'c1', content: 'ok' }
  ]
  const r = healTranscript(msgs)
  assert(r.messages.length === 4 && r.messages[3].tool_call_id === 'c2', 'heal: 只补缺失的 c2')
}
// 3. 完好记录不动
{
  const msgs = [
    { role: 'user', content: 'hi' },
    { role: 'assistant', content: '', tool_calls: [{ id: 'c1', type: 'function', function: { name: 'a', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 'c1', content: 'ok' },
    { role: 'assistant', content: 'done' }
  ]
  const r = healTranscript(msgs)
  assert(r.changed === false && r.messages.length === 4, 'heal: 完好记录不改动')
}
// 4. user 消息插在未回应完的 tool_calls 后 → 合成消息插在 user 之前
{
  const msgs = [
    { role: 'assistant', content: '', tool_calls: [{ id: 'c1', type: 'function', function: { name: 'a', arguments: '{}' } }] },
    { role: 'user', content: '接着来' }
  ]
  const r = healTranscript(msgs)
  assert(r.messages[1].role === 'tool' && r.messages[2].role === 'user', 'heal: 合成消息插在 user 前')
}

// ---- compactMessages ----
const bigText = 'x'.repeat(3000)
// 1. 超预算:从旧块丢弃,且绝不拆开 tool_call 配对
{
  const msgs = []
  for (let i = 0; i < 20; i++) {
    msgs.push({ role: 'user', content: `task ${i} ${bigText}` })
    msgs.push({
      role: 'assistant',
      content: '',
      tool_calls: [{ id: `c${i}`, type: 'function', function: { name: 'a', arguments: '{}' } }]
    })
    msgs.push({ role: 'tool', tool_call_id: `c${i}`, content: bigText })
  }
  const out = compactMessages(msgs, 30000)
  const size = JSON.stringify(out).length
  assert(size < 60000, `compact: 体积被压到预算量级(${size})`)
  // 每条 tool_call 都有配对的 tool 消息
  const ok = out.every((m, idx) => {
    if (m.role !== 'assistant' || !m.tool_calls) return true
    const ids = new Set(m.tool_calls.map((c) => c.id))
    const next = out[idx + 1]
    return next && next.role === 'tool' && ids.has(next.tool_call_id)
  })
  assert(ok, 'compact: 不拆开 tool_call 配对')
  assert(out[0].role !== 'tool', 'compact: 不以孤儿 tool 消息开头')
}
// 2. 老截图替换为占位文本
{
  const img = { type: 'image_url', image_url: { url: 'data:image/png;base64,AAAA' } }
  const msgs = []
  for (let i = 0; i < 10; i++) msgs.push({ role: 'user', content: [{ type: 'text', text: `msg ${i}` }, img] })
  const out = compactMessages(msgs, 400000)
  const early = out.slice(0, 4).flatMap((m) => m.content)
  const late = out.slice(6).flatMap((m) => m.content)
  assert(early.every((p) => p.type === 'text') && early.some((p) => p.text.includes('已省略')), 'compact: 老截图被替换')
  assert(late.some((p) => p.type === 'image_url'), 'compact: 最近截图保留')
}

console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
