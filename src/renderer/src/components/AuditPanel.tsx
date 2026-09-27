import React, { useState } from 'react'
import type { AuditEvent } from '@shared/types'
import { api } from '../api'
import { Icon, toolIconName } from './Icon'

const TYPE_META: Record<string, { label: string; dot: string }> = {
  user_message: { label: '用户', dot: 'dot-user' },
  assistant_message: { label: '回复', dot: 'dot-assistant' },
  tool_call: { label: '工具调用', dot: 'dot-tool' },
  tool_result: { label: '工具结果', dot: 'dot-tool' },
  approval_request: { label: '请求确认', dot: 'dot-approval' },
  approval_decision: { label: '审批决定', dot: 'dot-approval' },
  error: { label: '错误', dot: 'dot-error' },
  system: { label: '系统', dot: 'dot-system' }
}

type Filter = 'all' | 'tool' | 'msg' | 'approval'

export function AuditPanel(props: { events: AuditEvent[]; sessionId: string | null }): React.ReactNode {
  const [filter, setFilter] = useState<Filter>('all')
  const [keyword, setKeyword] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [exportMsg, setExportMsg] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const stickRef = React.useRef(true)
  // 留痕脉冲:只对挂载之后新落位的事件生效,打开历史会话时不高亮一整屏
  const knownIds = React.useRef<Set<string> | null>(null)

  const kw = keyword.trim().toLowerCase()
  const shown = props.events.filter((e) => {
    if (filter === 'tool' && e.type !== 'tool_call' && e.type !== 'tool_result') return false
    if (filter === 'msg' && e.type !== 'user_message' && e.type !== 'assistant_message' && e.type !== 'system' && e.type !== 'error')
      return false
    if (filter === 'approval' && e.type !== 'approval_request' && e.type !== 'approval_decision') return false
    if (kw && !(`${e.text ?? ''}`.toLowerCase().includes(kw) || `${e.toolName ?? ''}`.toLowerCase().includes(kw))) return false
    return true
  })

  // 会话切换后重置已知事件集合
  if (knownIds.current === null) {
    knownIds.current = new Set(props.events.map((e) => e.id))
  }
  const freshIds = new Set<string>()
  for (const e of props.events) {
    if (!knownIds.current.has(e.id)) {
      freshIds.add(e.id)
      knownIds.current.add(e.id)
    }
  }

  const onScroll = (): void => {
    const el = listRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }
  const count = props.events.length
  React.useEffect(() => {
    if (stickRef.current) bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
  }, [count, shown.length])

  const doExport = async (): Promise<void> => {
    if (!props.sessionId || exporting) return
    setExporting(true)
    setExportMsg(null)
    try {
      const r = await api.exportSession(props.sessionId)
      setExportMsg(`${r.ok ? '已导出' : '导出失败'} — ${r.message}`)
      setTimeout(() => setExportMsg(null), 5000)
    } finally {
      setExporting(false)
    }
  }

  if (!props.sessionId) {
    return (
      <aside className="audit-panel">
        <div className="audit-head">审计时间线</div>
        <div className="audit-empty">打开或创建一个会话后,这里会实时记录每一步操作。</div>
      </aside>
    )
  }

  return (
    <aside className="audit-panel">
      <div className="audit-head">
        审计时间线
        <span className="audit-count">{props.events.length}</span>
        <span className="audit-head-spacer" />
        <button className="ghost small" onClick={() => void doExport()} disabled={exporting} title="导出为自包含的 HTML 审计报告(含截图)">
          <Icon name="download" size={12} />
          {exporting ? '导出中' : '导出报告'}
        </button>
      </div>
      <div className="audit-filters">
        {(
          [
            ['all', '全部'],
            ['tool', '操作'],
            ['msg', '消息'],
            ['approval', '审批']
          ] as [Filter, string][]
        ).map(([k, label]) => (
          <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
        <input className="audit-search" placeholder="搜索" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <div className="audit-list" ref={listRef} onScroll={onScroll}>
        {shown.map((e) => {
          const meta = TYPE_META[e.type] ?? TYPE_META.system
          const shot = e.shot ?? (e.type === 'tool_result' ? (e.detail as { shot?: string } | undefined)?.shot : undefined)
          const text = e.text || meta.label
          return (
            <div
              key={e.id}
              className={`audit-item ${freshIds.has(e.id) ? 'is-new' : ''}`}
              onClick={() => setExpanded(expanded === e.id ? null : e.id)}
            >
              <div className="audit-row">
                <span className="audit-time">{new Date(e.ts).toLocaleTimeString('zh-CN', { hour12: false })}</span>
                <span className={`audit-dot ${meta.dot}`} title={meta.label} />
                <span className="audit-text" title={text}>
                  {e.type === 'tool_call' || e.type === 'tool_result' ? (
                    <>
                      <Icon name={toolIconName(e.toolName ?? '')} size={11} style={{ verticalAlign: '-1.5px' }} />{' '}
                    </>
                  ) : null}
                  {text}
                </span>
              </div>
              {shot && (
                <img className="audit-shot" src={`trace://shots/${props.sessionId}/${shot}`} alt="截图" loading="lazy" />
              )}
              {expanded === e.id && e.detail !== undefined && (
                <pre className="audit-detail">{JSON.stringify(e.detail, null, 2).slice(0, 3000)}</pre>
              )}
            </div>
          )
        })}
        {props.events.length === 0 && (
          <div className="audit-empty">开始对话后,每一步操作都会实时记录在这里。</div>
        )}
        {props.events.length > 0 && shown.length === 0 && <div className="audit-empty">没有匹配的事件。</div>}
        <div ref={bottomRef} />
      </div>
      {exportMsg && <div className="audit-export-msg">{exportMsg}</div>}
      <div className="audit-foot">追加写入 .data/sessions/{props.sessionId.slice(0, 8)}…/audit.jsonl</div>
    </aside>
  )
}
