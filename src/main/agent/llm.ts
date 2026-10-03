import type { ChatMessage, ToolSchema } from '@shared/types'

export interface LLMConfig {
  baseUrl: string
  apiKey: string
  model: string
  temperature?: number
}

export type StreamChunk =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }
  | { type: 'tool_delta'; index: number; id?: string; name?: string; argsDelta?: string }
  | { type: 'finish'; reason: string }

/** 若 baseUrl 未以 /v1 /v2 /v4 等结尾,自动补 /v1(OpenAI 兼容端点约定) */
export function completionsUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '')
  return /\/v\d+$/.test(base) ? `${base}/chat/completions` : `${base}/v1/chat/completions`
}

/**
 * 调用 OpenAI 兼容接口,流式返回文本增量、思考增量与工具调用增量。
 * 云端(OpenAI/GLM/DeepSeek/Kimi/通义…)与本地 Ollama(/v1)同构。
 */
export async function* streamChat(
  cfg: LLMConfig,
  messages: ChatMessage[],
  tools: ToolSchema[] | undefined,
  signal: AbortSignal
): AsyncGenerator<StreamChunk> {
  const body: Record<string, unknown> = { model: cfg.model, messages, stream: true }
  if (tools && tools.length) body.tools = tools
  if (typeof cfg.temperature === 'number' && cfg.temperature >= 0) body.temperature = cfg.temperature

  const res = await fetch(completionsUrl(cfg.baseUrl), {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      ...(cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {})
    },
    body: JSON.stringify(body)
  })

  if (!res.ok || !res.body) {
    let text = ''
    try {
      text = (await res.text()).slice(0, 400)
    } catch {
      /* ignore */
    }
    throw new Error(`模型请求失败（HTTP ${res.status}）${text ? ':' + text : ''}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      let idx: number
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim()
        buf = buf.slice(idx + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return
        let parsed: any
        try {
          parsed = JSON.parse(data)
        } catch {
          continue
        }
        const choice = parsed?.choices?.[0]
        const delta = choice?.delta ?? {}
        // 思考模型(DeepSeek-R1 / GLM 系列)的推理内容单独流出,给用户"正在思考"的反馈
        if (typeof delta.reasoning_content === 'string' && delta.reasoning_content) {
          yield { type: 'reasoning', text: delta.reasoning_content }
        }
        if (typeof delta.content === 'string' && delta.content) yield { type: 'text', text: delta.content }
        if (Array.isArray(delta.tool_calls)) {
          for (const tc of delta.tool_calls) {
            yield {
              type: 'tool_delta',
              index: tc.index ?? 0,
              id: tc.id,
              name: tc.function?.name,
              argsDelta: tc.function?.arguments
            }
          }
        }
        if (choice?.finish_reason) yield { type: 'finish', reason: choice.finish_reason }
      }
    }
  } finally {
    reader.releaseLock?.()
  }
}

/** 判断一次模型调用错误是否值得自动重试(限流/服务端故障/网络抖动) */
export function isRetryableLLMError(e: unknown): boolean {
  const msg = String((e as Error)?.message ?? e)
  return /HTTP (429|5\d\d)|fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|socket hang up|network|timeout|terminated/i.test(
    msg
  )
}
