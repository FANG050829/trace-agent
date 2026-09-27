import React from 'react'
import type { AuditEvent, ApprovalRequest } from '@shared/types'
import { Markdown } from '../md'
import { Icon, toolIconName } from './Icon'

export type RenderItem =
  | { kind: 'user'; id: string; ts: number; text: string }
  | { kind: 'assistant'; id: string; ts: number; text: string; streaming?: boolean; reasoning?: string }
  | { kind: 'tool'; id: string; ts: number; call: AuditEvent; result?: AuditEvent }
  | { kind: 'notice'; id: string; ts: number; text: string; status?: string }

function statusChip(status?: string): { cls: string; text: string } | null {
  switch (status) {
    case 'ok':
      return { cls: 'ok', text: '完成' }
    case 'error':
      return { cls: 'err', text: '出错' }
    case 'denied':
      return { cls: 'deny', text: '已拒绝' }
    case 'pending':
      return { cls: 'wait', text: '等待确认' }
    default:
      return null
  }
}

const RISK_BADGE: Record<string, { cls: string; text: string }> = {
  confirm: { cls: 'risk-confirm', text: '敏感操作' },
  dangerous: { cls: 'risk-danger', text: '不可逆操作' }
}

function CopyBtn({ getText, label = '复制' }: { getText: () => string; label?: string }): React.ReactNode {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      className={`copy-btn ${copied ? 'done' : ''}`}
      title="复制"
      onClick={() => {
        navigator.clipboard.writeText(getText()).then(
          () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          },
          () => undefined
        )
      }}
    >
      <Icon name={copied ? 'check' : 'copy'} size={11} /> {copied ? '已复制' : label}
    </button>
  )
}

function ToolCard({ item, sessionId }: { item: Extract<RenderItem, { kind: 'tool' }>; sessionId: string }): React.ReactNode {
  const [open, setOpen] = React.useState(false)
  const { call, result } = item
  const chip = statusChip(result?.status ?? call.status)
  const args = (call.detail as { args?: unknown } | undefined)?.args
  const shot = result?.shot
  return (
    <div className={`tool-card st-${result?.status ?? 'pending'}`}>
      <button className="tool-head" onClick={() => setOpen(!open)}>
        <span className="tool-icon">
          <Icon name={toolIconName(call.toolName ?? '')} size={14} />
        </span>
        <span className="tool-name">{String(call.text ?? call.toolName)}</span>
        {chip && <span className={`chip ${chip.cls}`}>{chip.text}</span>}
        <span className={`tool-caret ${open ? 'open' : ''}`}>
          <Icon name="chevron" size={12} />
        </span>
      </button>
      {open && (
        <div className="tool-body">
          {args !== undefined && (
            <>
              <div className="tool-label">调用参数</div>
              <pre className="tool-pre">{JSON.stringify(args, null, 2)}</pre>
            </>
          )}
          {result && (
            <>
              <div className="tool-label">执行结果</div>
              <pre className="tool-pre">{JSON.stringify(result.detail ?? result.text, null, 2).slice(0, 4000)}</pre>
            </>
          )}
          {!result && <div className="tool-label">尚未返回结果…</div>}
        </div>
      )}
      {shot && (
        <a href={`trace://shots/${sessionId}/${shot}`} target="_blank" rel="noreferrer">
          <img className="shot-img" src={`trace://shots/${sessionId}/${shot}`} alt="截图" />
        </a>
      )}
    </div>
  )
}

const WELCOME_EXAMPLES = [
  { icon: 'folder', text: '整理我的下载文件夹,先给方案' },
  { icon: 'globe', text: '打开 baidu.com 截个图' },
  { icon: 'terminal', text: '看看 C 盘还剩多少空间' }
]

export function ChatView(props: {
  items: RenderItem[]
  running: boolean
  pending: ApprovalRequest | null
  streamingTool: string | null
  sessionId: string | null
  llmReady: boolean
  onSend: (text: string) => void
  onCancel: () => void
  onRespond: (approved: boolean) => void
  onOpenTemplates: () => void
  onOpenSettings: () => void
}): React.ReactNode {
  const { items, running, pending, streamingTool, sessionId, llmReady } = props
  const [input, setInput] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const taRef = React.useRef<HTMLTextAreaElement>(null)
  const stickRef = React.useRef(true)
  const [showJump, setShowJump] = React.useState(false)

  // 智能吸底:用户往上翻阅时暂停自动滚动,回到底部附近恢复
  const onScroll = (): void => {
    const el = scrollRef.current
    if (!el) return
    const stick = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    stickRef.current = stick
    setShowJump(!stick)
  }
  const scrollToBottom = (): void => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    stickRef.current = true
    setShowJump(false)
  }

  const itemsSig = items.map((p) => (p.kind === 'assistant' ? p.text.length + (p.reasoning?.length ?? 0) : 0)).join(',')
  React.useEffect(() => {
    if (stickRef.current) scrollToBottom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsSig, pending, streamingTool, running])

  // 输入框高度自适应
  React.useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const doSend = (): void => {
    const text = input.trim()
    if (!text || running) return
    setInput('')
    props.onSend(text)
  }

  const insertText = (t: string): void => {
    setInput((prev) => (prev ? `${prev}\n${t}` : t))
    taRef.current?.focus()
  }

  return (
    <div
      className="chat-view"
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const paths = [...e.dataTransfer.files].map((f) => (f as File & { path?: string }).path).filter(Boolean) as string[]
        if (paths.length) insertText(paths.join('\n'))
      }}
    >
      <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
        {items.length === 0 && (
          <div className="welcome">
            <div className="welcome-head">
              <span className="welcome-mark">
                <Icon name="mark" size={22} />
              </span>
              <h2>留痕 Agent</h2>
            </div>
            <p className="welcome-desc">
              交代一件事,它替你操作文件、运行命令、截屏、控制浏览器。每一步都写入审计时间线,执行前会先征求你的确认。
            </p>
            <div className="welcome-label">试一试</div>
            <div className="welcome-examples">
              {WELCOME_EXAMPLES.map((ex) => (
                <button key={ex.text} onClick={() => insertText(ex.text)}>
                  <span className="ex-ico">
                    <Icon name={ex.icon} size={14} />
                  </span>
                  {ex.text}
                </button>
              ))}
            </div>
            <div className="welcome-links">
              <button onClick={props.onOpenTemplates}>
                <Icon name="layout" size={13} /> 模板库
              </button>
              <span className="link-sep">/</span>
              {!llmReady && (
                <>
                  <button onClick={props.onOpenSettings}>
                    <Icon name="sliders" size={13} /> 先配置模型服务
                  </button>
                  <span className="link-sep">/</span>
                </>
              )}
              <span className="dim" style={{ fontSize: 11.5, alignSelf: 'center' }}>
                支持拖入文件 · Enter 发送 · Shift+Enter 换行
              </span>
            </div>
          </div>
        )}
        {items.map((it) => {
          if (it.kind === 'user') {
            return (
              <div className="msg user" key={it.id}>
                <div className="bubble">{it.text}</div>
              </div>
            )
          }
          if (it.kind === 'assistant') {
            const hasBody = !!it.text.trim()
            return (
              <div className="msg assistant" key={it.id}>
                <div className="bubble">
                  {it.reasoning && (it.streaming || !hasBody) && <div className="reasoning live">{it.reasoning}</div>}
                  {it.reasoning && hasBody && !it.streaming && (
                    <details className="reasoning-fold">
                      <summary>思考过程</summary>
                      <div className="reasoning">{it.reasoning}</div>
                    </details>
                  )}
                  {hasBody ? <Markdown text={it.text} /> : !it.reasoning && <span className="dim">正在准备…</span>}
                  {it.streaming && hasBody && <span className="stream-hint" />}
                </div>
                {hasBody && !it.streaming && (
                  <div className="msg-actions">
                    <CopyBtn getText={() => it.text} />
                  </div>
                )}
              </div>
            )
          }
          if (it.kind === 'tool') {
            return sessionId ? <ToolCard item={it} sessionId={sessionId} key={it.id} /> : null
          }
          return (
            <div className={`notice st-${it.status ?? 'system'}`} key={it.id}>
              {it.text}
            </div>
          )
        })}

        {streamingTool && running && !pending && (
          <div className="tool-streaming">
            <span className="spin">
              <Icon name="clock" size={13} />
            </span>
            正在调用 {streamingTool}
          </div>
        )}

        {pending && (
          <div className="approval-card">
            <div className="approval-head">
              <Icon name="alert" size={14} />
              需要你的确认
            </div>
            <div className="approval-meta">
              <span className="approval-tool">{pending.toolLabel}</span>
              {RISK_BADGE[pending.risk] && <span className={`chip ${RISK_BADGE[pending.risk].cls}`}>{RISK_BADGE[pending.risk].text}</span>}
            </div>
            <div className="approval-summary">{pending.summary}</div>
            <pre className="approval-args">{pending.argsText}</pre>
            <div className="approval-actions">
              <button className="primary" onClick={() => props.onRespond(true)}>
                批准执行
              </button>
              <button className="danger-outline" onClick={() => props.onRespond(false)}>
                拒绝
              </button>
            </div>
          </div>
        )}
        <div style={{ height: 4 }} />
      </div>

      {showJump && (
        <button className="jump-bottom" onClick={scrollToBottom}>
          <Icon name="arrow-down" size={12} /> 回到底部
        </button>
      )}

      <div className="input-bar">
        <textarea
          ref={taRef}
          value={input}
          placeholder={running ? '正在执行任务…此时发送的消息会排队,任务结束后自动处理' : '描述要做的事,可拖入文件'}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // 中文输入法组词中的回车不发送
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              doSend()
            }
          }}
          rows={2}
        />
        {running ? (
          <button className="stop-btn" onClick={props.onCancel} title="中止当前任务">
            <Icon name="stop" size={11} /> 停止
          </button>
        ) : (
          <button className="primary send" onClick={doSend} disabled={!input.trim()}>
            发送
            <Icon name="send" size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
