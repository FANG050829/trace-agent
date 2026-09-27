import type { ChatMessage, ContentPart } from '@shared/types'

function msgSize(m: ChatMessage): number {
  if (typeof m.content === 'string') return m.content.length
  return m.content.reduce((n, p) => n + (p.type === 'text' ? p.text.length : 2000), 0) + (m.tool_calls?.length ? 200 : 0)
}

/**
 * 修复损坏的对话记录:OpenAI 协议要求 assistant 的每个 tool_call 都必须紧跟对应的 tool 消息。
 * 任务被取消/中断时会留下"孤儿 tool_calls",不修复的话下次请求会 400。
 * 返回修复后的消息与是否发生改动。
 */
export function healTranscript(messages: ChatMessage[]): { messages: ChatMessage[]; changed: boolean } {
  const out: ChatMessage[] = []
  let changed = false
  // 当前 assistant 轮次里等待 tool 结果回应的调用:callId -> 工具名
  let pending = new Map<string, string>()

  const flushPending = (): void => {
    if (!pending.size) return
    for (const [id] of pending) {
      out.push({ role: 'tool', tool_call_id: id, content: '(该工具调用因任务中断而未执行。)' })
      changed = true
    }
    pending.clear()
  }

  for (const m of messages) {
    if (m.role === 'tool') {
      if (m.tool_call_id && pending.has(m.tool_call_id)) {
        pending.delete(m.tool_call_id)
        out.push(m)
      } else {
        changed = true // 找不到归属的孤儿 tool 消息,丢弃
      }
      continue
    }
    flushPending()
    out.push(m)
    if (m.role === 'assistant' && m.tool_calls?.length) {
      pending = new Map(m.tool_calls.map((c) => [c.id, c.function.name]))
    }
  }
  flushPending()
  return { messages: out, changed }
}

/**
 * 上下文压缩:
 * 1) 较早消息里的截图替换成占位文本,只给视觉模型保留最近几张;
 * 2) 超出字符预算时,从最旧的完整块(用户消息或 assistant 消息开头)开始丢弃,
 *    绝不会把 assistant 的 tool_call 和它的 tool 结果拆开。
 */
export function compactMessages(messages: ChatMessage[], maxChars: number): ChatMessage[] {
  const KEEP_IMAGES_RECENT = 6 // 最近 6 条消息里的截图保留

  // 1) 老截图瘦身
  let msgs = messages.map((m, i) => {
    if (typeof m.content === 'string' || i >= messages.length - KEEP_IMAGES_RECENT) return m
    if (!m.content.some((p) => p.type === 'image_url')) return m
    const parts: ContentPart[] = m.content.map((p) =>
      p.type === 'image_url' ? { type: 'text', text: '[早前截图已省略]' } : p
    )
    return { ...m, content: parts }
  })

  // 2) 字符预算裁剪
  const budget = Math.max(maxChars, 12000)
  const sizes = msgs.map(msgSize)
  const suffix: number[] = new Array(msgs.length + 1).fill(0)
  for (let i = msgs.length - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + sizes[i]

  if (suffix[0] > budget) {
    // 安切割点:user 消息开头,或 assistant 消息开头(tool_call 永远与其 tool 结果同进退)
    let cut = 0
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i]
      const safe = m.role === 'user' || m.role === 'assistant'
      if (safe && suffix[i] <= budget) {
        cut = i
        break
      }
    }
    if (cut > 0) msgs = msgs.slice(cut)
  }
  return msgs
}
