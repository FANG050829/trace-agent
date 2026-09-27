import { powerSaveBlocker } from 'electron'
import type {
  AppSettings,
  ApprovalRequest,
  AuditEvent,
  ChatMessage,
  SessionMeta,
  ToolSchema
} from '@shared/types'
import { SessionAudit } from '../audit'
import { listSessions, loadSettings, loadTranscript, saveTranscript, upsertSession } from '../store'
import { isRetryableLLMError, streamChat, type LLMConfig } from './llm'
import { compactMessages, healTranscript } from './compact'
import { systemPrompt } from './prompt'
import { TOOL_MAP, toolSchemas } from '../tools/registry'
import { assessRisk, type ToolCall, type ToolResult } from '../tools'

export interface RunnerHooks {
  emitEvent(sessionId: string, event: AuditEvent): void
  emitDelta(sessionId: string, kind: 'text' | 'tool' | 'reasoning', text: string): void
  emitState(sessionId: string, running: boolean, pendingApproval: ApprovalRequest | null): void
  emitTitle(sessionId: string, title: string): void
}

export function resolveLLM(settings: AppSettings): LLMConfig {
  if (settings.activeProviderId === 'ollama') {
    return {
      baseUrl: settings.ollama.baseUrl,
      apiKey: 'ollama',
      model: settings.ollama.model,
      temperature: settings.temperature
    }
  }
  const p = settings.providers.find((x) => x.id === settings.activeProviderId)
  if (!p) throw new Error('尚未选择模型服务:请到「设置」页配置并选择一个服务商(或本地 Ollama)。')
  if (!p.apiKey) throw new Error(`服务商「${p.name}」还没有填写 API Key,请到「设置」页补全。`)
  if (!p.model) throw new Error(`服务商「${p.name}」还没有填写模型名,请到「设置」页补全。`)
  return { baseUrl: p.baseUrl, apiKey: p.apiKey, model: p.model, temperature: settings.temperature }
}

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true }
    )
  })

export class AgentRunner {
  static hooks: RunnerHooks
  private static runners = new Map<string, AgentRunner>()

  static get(sessionId: string): AgentRunner {
    let r = AgentRunner.runners.get(sessionId)
    if (!r) {
      r = new AgentRunner(sessionId)
      AgentRunner.runners.set(sessionId, r)
    }
    return r
  }

  static cancelAll(): void {
    for (const r of AgentRunner.runners.values()) r.cancel()
  }

  running = false
  private audit: SessionAudit
  private messages: ChatMessage[]
  private meta: SessionMeta
  private abort: AbortController | null = null
  private pending: { req: ApprovalRequest; resolve: (ok: boolean) => void } | null = null
  private queue: string[] = [] // 任务执行期间用户追加的消息,任务结束后自动依次发送
  private powerSaveId: number | null = null

  constructor(public sessionId: string) {
    this.audit = new SessionAudit(sessionId)
    const loaded = healTranscript(loadTranscript(sessionId) as ChatMessage[])
    this.messages = loaded.messages
    if (loaded.changed) saveTranscript(sessionId, this.messages) // 修复历史遗留的损坏记录
    const found = listSessions().find((m) => m.id === sessionId)
    this.meta = found ?? { id: sessionId, title: '新会话', createdAt: Date.now(), updatedAt: Date.now() }
  }

  cancel(): void {
    this.queue = []
    this.abort?.abort()
    this.pending?.resolve(false)
  }

  respond(approvalId: string, approved: boolean): void {
    if (this.pending?.req.approvalId === approvalId) this.pending.resolve(approved)
  }

  private emitEvent(e: AuditEvent): void {
    AgentRunner.hooks?.emitEvent(this.sessionId, e)
  }
  private emitState(): void {
    AgentRunner.hooks?.emitState(this.sessionId, this.running, this.pending?.req ?? null)
  }

  private touch(title?: string): void {
    if (title && this.messages.filter((m) => m.role === 'user').length <= 1) this.meta.title = title.split('\n')[0].slice(0, 24) || this.meta.title
    this.meta.updatedAt = Date.now()
    upsertSession(this.meta)
    if (title) AgentRunner.hooks?.emitTitle(this.sessionId, this.meta.title)
  }

  async send(text: string, settings: AppSettings): Promise<void> {
    if (this.running) {
      // 不丢消息:排队等待当前任务结束后自动发送
      this.queue.push(text)
      this.emitEvent(this.audit.append('system', { text: 'Agent 正在执行任务,这条消息已排队,当前任务结束后自动发送。' }))
      return
    }
    this.running = true
    this.abort = new AbortController()
    this.emitState()
    if (this.powerSaveId === null) this.powerSaveId = powerSaveBlocker.start('prevent-app-suspension')

    this.messages.push({ role: 'user', content: text })
    this.emitEvent(this.audit.append('user_message', { text }))
    this.touch(this.messages.filter((m) => m.role === 'user').length === 1 ? text : undefined)

    const startedAt = Date.now()
    let steps = 0
    try {
      const cfg = resolveLLM(settings)
      const maxSteps = settings.maxSteps || 40
      while (steps < maxSteps) {
        steps++
        const { content, toolCalls } = await this.callModelWithRetry(cfg, settings)

        if (content.trim()) {
          this.emitEvent(this.audit.append('assistant_message', { text: content.trim() }))
        } else if (toolCalls.length === 0) {
          this.emitEvent(this.audit.append('system', { text: '模型这次没有返回内容。' }))
        }
        if (toolCalls.length === 0) {
          // 最终回复必须写入对话记录,否则模型下一轮会丢失自己上一次的回答
          if (content.trim()) {
            this.messages.push({ role: 'assistant', content: content.trim() })
            saveTranscript(this.sessionId, this.messages)
          }
          break
        }

        this.messages.push({
          role: 'assistant',
          content: content || '',
          tool_calls: toolCalls.map((tc) => ({
            id: tc.id,
            type: 'function' as const,
            function: { name: tc.name, arguments: tc.args }
          }))
        })

        for (const tc of toolCalls) {
          await this.runToolCall(tc, settings)
        }
        saveTranscript(this.sessionId, this.messages)
      }
      if (steps >= maxSteps) {
        this.emitEvent(this.audit.append('system', { text: `已达到单次任务步数上限(${maxSteps}),自动停止。你可以说"继续"让它接着做。` }))
      } else {
        const dur = Math.round((Date.now() - startedAt) / 1000)
        this.emitEvent(
          this.audit.append('system', {
            text: `任务结束:共 ${steps} 步,用时 ${dur >= 60 ? `${Math.floor(dur / 60)} 分 ${dur % 60} 秒` : `${dur} 秒`}。`,
            detail: { steps, durationSec: dur }
          })
        )
      }
    } catch (e) {
      const err = e as Error
      if (err.name === 'AbortError') {
        this.emitEvent(this.audit.append('system', { text: '任务已取消。' }))
      } else {
        this.emitEvent(this.audit.append('error', { text: err.message || String(err) }))
      }
    } finally {
      // 取消/出错可能留下没回应完的 tool_call,先修复再落盘,保证记录永远可用
      const healed = healTranscript(this.messages)
      if (healed.changed) this.messages = healed.messages
      this.running = false
      this.pending = null
      this.emitState()
      saveTranscript(this.sessionId, this.messages)
      if (this.powerSaveId !== null) {
        powerSaveBlocker.stop(this.powerSaveId)
        this.powerSaveId = null
      }
      // 依次发送排队中的消息
      const next = this.queue.shift()
      if (next) void this.send(next, loadSettings())
    }
  }

  /** 调一次模型;限流/服务端故障/网络抖动自动重试(指数退避,最多 3 次) */
  private async callModelWithRetry(cfg: LLMConfig, settings: AppSettings): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const MAX_ATTEMPTS = 3
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.callModel(cfg, settings)
      } catch (e) {
        const err = e as Error
        if (err.name === 'AbortError' || attempt >= MAX_ATTEMPTS || !isRetryableLLMError(e)) throw e
        const delayMs = 1500 * attempt
        this.emitEvent(
          this.audit.append('system', {
            text: `模型请求失败(${err.message.slice(0, 120)}),${Math.round(delayMs / 1000)} 秒后自动重试(第 ${attempt}/${MAX_ATTEMPTS - 1} 次)…`
          })
        )
        await sleep(delayMs, this.abort!.signal)
      }
    }
  }

  /** 调一次模型:流式收集文本、思考内容与工具调用 */
  private async callModel(cfg: LLMConfig, settings: AppSettings): Promise<{ content: string; toolCalls: ToolCall[] }> {
    let content = ''
    const calls = new Map<number, { id?: string; name?: string; args: string }>()
    const history = compactMessages(this.messages, settings.maxContextChars || 60000)
    const msgs: ChatMessage[] = [{ role: 'system', content: systemPrompt(settings) }, ...history]

    for await (const chunk of streamChat(cfg, msgs, toolSchemas, this.abort!.signal)) {
      if (chunk.type === 'text') {
        content += chunk.text
        AgentRunner.hooks?.emitDelta(this.sessionId, 'text', chunk.text)
      } else if (chunk.type === 'reasoning') {
        AgentRunner.hooks?.emitDelta(this.sessionId, 'reasoning', chunk.text)
      } else if (chunk.type === 'tool_delta') {
        const c = calls.get(chunk.index) ?? { args: '' }
        if (chunk.id) c.id = chunk.id
        if (chunk.name) {
          c.name = chunk.name
          AgentRunner.hooks?.emitDelta(this.sessionId, 'tool', chunk.name)
        }
        if (chunk.argsDelta) c.args += chunk.argsDelta
        calls.set(chunk.index, c)
      }
    }
    const toolCalls: ToolCall[] = [...calls.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([i, c], idx) => ({ id: c.id ?? `call_${Date.now().toString(36)}_${idx}`, name: c.name ?? `unknown_${i}`, args: c.args || '{}' }))
    return { content, toolCalls }
  }

  /** 执行单个工具调用:审计 → 风险评估 → 审批 → 执行 → 审计 */
  private async runToolCall(tc: ToolCall, settings: AppSettings): Promise<void> {
    const tool = TOOL_MAP.get(tc.name)
    let args: any = {}
    let argsBroken = false
    try {
      args = JSON.parse(tc.args || '{}')
    } catch {
      argsBroken = true
    }

    const callEvent = this.audit.append('tool_call', {
      toolName: tc.name,
      text: tool?.label ?? tc.name,
      detail: { args },
      status: 'pending'
    })
    this.emitEvent(callEvent)

    const fail = (msg: string): ToolResult => ({ textForModel: msg, detail: { error: msg } })
    if (!tool) {
      this.finishTool(callEvent.id, tc, fail(`未知工具 ${tc.name}。请从可用工具列表中选择。`), 'error', settings)
      return
    }
    if (argsBroken) {
      // 参数不是合法 JSON:把错误回喂给模型,而不是拿着空参数瞎跑
      this.finishTool(callEvent.id, tc, fail(`工具 ${tc.name} 的调用参数不是合法 JSON,已放弃执行。请重新调用并确保参数是完整的 JSON。`), 'error', settings)
      return
    }

    // 风险评估与审批
    const risk = assessRisk(tool, args, settings.riskPolicy)
    if (risk !== 'safe') {
      const req: ApprovalRequest = {
        sessionId: this.sessionId,
        approvalId: `${callEvent.id}-ap`,
        toolName: tool.name,
        toolLabel: tool.label,
        summary: tool.approvalSummary(args),
        argsText: JSON.stringify(args, null, 2).slice(0, 2000),
        risk
      }
      this.emitEvent(
        this.audit.append('approval_request', { text: req.summary, detail: { args }, refId: callEvent.id, status: 'pending' })
      )
      let resolveApproval!: (ok: boolean) => void
      const approvedPromise = new Promise<boolean>((resolve) => {
        resolveApproval = resolve
      })
      this.pending = { req, resolve: resolveApproval }
      this.emitState()
      const approved = await approvedPromise
      this.pending = null
      this.emitEvent(
        this.audit.append('approval_decision', {
          text: approved ? '用户批准了该操作' : '用户拒绝了该操作',
          refId: callEvent.id,
          status: approved ? 'approved' : 'denied'
        })
      )
      this.emitState()
      if (!approved) {
        this.finishTool(callEvent.id, tc, {
          textForModel: '用户拒绝了该操作。请停下询问用户希望如何继续,不要原样重试。',
          detail: { denied: true }
        }, 'denied', settings)
        return
      }
    }

    // 执行
    let result: ToolResult
    try {
      result = await tool.run(args, { sessionId: this.sessionId, audit: this.audit, settings, signal: this.abort!.signal })
    } catch (e) {
      const err = e as Error
      if (err.name === 'AbortError') throw err // 用户取消:让外层统一收尾
      result = fail(`工具执行出错:${err.message}`)
      this.finishTool(callEvent.id, tc, result, 'error', settings)
      return
    }
    this.finishTool(callEvent.id, tc, result, 'ok', settings)
  }

  private finishTool(
    callEventId: string,
    tc: ToolCall,
    result: ToolResult,
    status: 'ok' | 'error' | 'denied',
    settings: AppSettings
  ): void {
    this.audit.patch(callEventId, { status })
    const headline = result.textForModel.split('\n')[0].slice(0, 160)
    const event = this.audit.append('tool_result', {
      refId: callEventId,
      toolName: tc.name,
      text: headline,
      detail: result.detail ?? { output: result.textForModel.slice(0, 2000) },
      shot: result.shotFile,
      status
    })
    this.emitEvent(event)

    this.messages.push({
      role: 'tool',
      tool_call_id: tc.id,
      content: result.textForModel.slice(0, 12000)
    })
    if (result.imageDataUrl && settings.screenshotToVision) {
      this.messages.push({
        role: 'user',
        content: [
          { type: 'text', text: '(系统附加)这是上一步操作后保存的截图,请结合画面继续判断下一步。' },
          { type: 'image_url', image_url: { url: result.imageDataUrl } }
        ]
      })
    }
    saveTranscript(this.sessionId, this.messages)
  }
}
