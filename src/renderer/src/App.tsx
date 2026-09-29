import React, { useEffect, useRef, useState } from 'react'
import type { ApprovalRequest, AuditEvent, AppSettings, SessionMeta, Skill } from '@shared/types'
import { api } from './api'
import { normalizeAudit } from '@shared/audit'
import { Sidebar } from './components/Sidebar'
import { ChatView, type RenderItem } from './components/ChatView'
import { AuditPanel } from './components/AuditPanel'
import { TemplatesView } from './components/TemplatesView'
import { SkillsView } from './components/SkillsView'
import { SettingsView } from './components/SettingsView'
import { Icon } from './components/Icon'

type View = 'chat' | 'templates' | 'skills' | 'settings'

function clearStreaming(prev: RenderItem[]): RenderItem[] {
  return prev.map((p) => (p.kind === 'assistant' && p.streaming ? { ...p, streaming: false } : p))
}

/**
 * 流式增量的纯 updater:不修改任何外部引用(React StrictMode 会双重调用 updater,
 * 带 liveRef 副作用会让指针与真实列表失配,最终把回复渲染成两份)。
 * live 项的身份由 streaming 标记判定;liveId 只是复用当前项的优化。
 */
function appendDelta(prev: RenderItem[], kind: 'text' | 'reasoning', delta: string, liveId: string | null, ts: number): RenderItem[] {
  if (liveId && prev.some((p) => p.id === liveId && p.kind === 'assistant')) {
    return prev.map((p) =>
      p.id === liveId && p.kind === 'assistant'
        ? kind === 'text'
          ? { ...p, text: p.text + delta }
          : { ...p, reasoning: (p.reasoning ?? '') + delta }
        : p
    )
  }
  const item: RenderItem = { kind: 'assistant', id: liveId ?? `live-${ts.toString(36)}`, ts, text: '', streaming: true }
  if (kind === 'reasoning') item.reasoning = delta
  else item.text = delta
  return [...prev, item]
}

function applyEvent(prev: RenderItem[], event: AuditEvent): RenderItem[] {
  switch (event.type) {
    case 'user_message':
      return [...prev, { kind: 'user', id: event.id, ts: event.ts, text: event.text ?? '' }]
    case 'assistant_message': {
      // 优先把流式 live 项转正,避免同一句话出现两个气泡
      const liveIdx = prev.findIndex((p) => p.kind === 'assistant' && p.streaming)
      if (liveIdx >= 0) {
        return prev.map((p, i) => (i === liveIdx && p.kind === 'assistant' ? { ...p, text: event.text || p.text, streaming: false } : p))
      }
      return [...prev, { kind: 'assistant', id: event.id, ts: event.ts, text: event.text ?? '' }]
    }
    case 'tool_call': {
      const cleared = clearStreaming(prev)
      return [...cleared, { kind: 'tool', id: event.id, ts: event.ts, call: event }]
    }
    case 'tool_result':
      return prev.map((p) => (p.id === event.refId && p.kind === 'tool' ? { ...p, result: event } : p))
    case 'approval_request':
      return [...clearStreaming(prev), { kind: 'notice', id: event.id, ts: event.ts, text: `等待确认 — ${event.text ?? ''}`, status: 'pending' }]
    case 'approval_decision':
      return [
        ...prev,
        {
          kind: 'notice',
          id: event.id,
          ts: event.ts,
          text: `${event.status === 'approved' ? '已批准' : '已拒绝'} — ${event.text ?? ''}`,
          status: event.status
        }
      ]
    case 'error':
      return [...clearStreaming(prev), { kind: 'notice', id: event.id, ts: event.ts, text: event.text ?? '发生错误', status: 'error' }]
    case 'system':
      return [...clearStreaming(prev), { kind: 'notice', id: event.id, ts: event.ts, text: event.text ?? '', status: 'system' }]
    default:
      return [...clearStreaming(prev), { kind: 'notice', id: event.id, ts: event.ts, text: event.text ?? '', status: 'system' }]
  }
}

function itemsFromAudit(events: AuditEvent[]): RenderItem[] {
  let items: RenderItem[] = []
  for (const e of events) items = applyEvent(items, e)
  return items
}

export default function App(): React.ReactNode {
  const [sessions, setSessions] = useState<SessionMeta[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [items, setItems] = useState<RenderItem[]>([])
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [running, setRunning] = useState(false)
  const [pending, setPending] = useState<ApprovalRequest | null>(null)
  const [view, setView] = useState<View>('chat')
  const [auditOpen, setAuditOpen] = useState(true)
  const [streamingTool, setStreamingTool] = useState<string | null>(null)
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [skillDraft, setSkillDraft] = useState<{ name: string; prompt: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const activeRef = useRef<string | null>(null)
  const liveRef = useRef<string | null>(null)
  const liveSeq = useRef(0)
  const stateBySession = useRef(new Map<string, { running: boolean; pending: ApprovalRequest | null }>())

  const refreshSessions = (): void => {
    api.listSessions().then(setSessions)
  }

  const showToast = (msg: string): void => {
    setToast(msg)
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600)
  }

  const openSessionInternal = async (id: string): Promise<void> => {
    activeRef.current = id
    setActiveId(id)
    setView('chat')
    const r = await api.openSession(id)
    setItems(itemsFromAudit(r.audit))
    setAuditEvents(r.audit)
    const st = stateBySession.current.get(id)
    setRunning(st?.running ?? false)
    setPending(st?.pending ?? null)
  }

  useEffect(() => {
    api.getSettings().then(setSettings)
    // 启动时自动恢复最近一次会话
    api.listSessions().then((ss) => {
      setSessions(ss)
      if (ss[0]) void openSessionInternal(ss[0].id)
    })

    const offEvent = api.onAgentEvent(({ sessionId, event }) => {
      if (sessionId !== activeRef.current) return
      // liveRef 只能在 updater 之外修改(纯 updater 约束)
      if (event.type === 'user_message' || event.type === 'assistant_message' || event.type === 'tool_call') {
        liveRef.current = null
      }
      // 与读取历史会话走同一套归一化:tool_call 的最终状态由 tool_result 推导,
      // 否则实时时间线里的工具会一直停在 pending
      setAuditEvents((prev) => normalizeAudit([...prev, event]))
      setItems((prev) => applyEvent(prev, event))
    })
    const offDelta = api.onAgentDelta(({ sessionId, kind, text }) => {
      if (sessionId !== activeRef.current) return
      if (kind === 'text' || kind === 'reasoning') {
        // live 项不存在时在这里建号,updater 内保持纯净
        if (!liveRef.current) liveRef.current = `live-${Date.now().toString(36)}-${++liveSeq.current}`
        const liveId = liveRef.current
        const ts = Date.now()
        setItems((prev) => appendDelta(prev, kind, text, liveId, ts))
      } else {
        setStreamingTool(text || null)
      }
    })
    const offState = api.onAgentState(({ sessionId, running, pendingApproval }) => {
      stateBySession.current.set(sessionId, { running, pending: pendingApproval })
      // 后台会话(如定时技能)任务结束时也要刷新会话列表,否则侧栏看不到新会话
      if (!running) refreshSessions()
      if (sessionId !== activeRef.current) return
      setRunning(running)
      setPending(pendingApproval)
      if (!running) {
        setStreamingTool(null)
        liveRef.current = null
        setItems((prev) => prev.filter((p) => !(p.kind === 'assistant' && !p.text.trim() && !p.reasoning)))
        setItems((prev) => prev.map((p) => (p.kind === 'assistant' ? { ...p, streaming: false } : p)))
      }
    })
    const offTitle = api.onSessionTitle(({ sessionId, title }) => {
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)))
    })
    return () => {
      offEvent()
      offDelta()
      offState()
      offTitle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openSession = async (id: string): Promise<void> => {
    await openSessionInternal(id)
  }

  const newSession = async (): Promise<void> => {
    const meta = await api.createSession()
    setSessions((s) => [meta, ...s])
    await openSessionInternal(meta.id)
  }

  /** 在全新会话里运行一段提示词(模板/技能) */
  const runInNewSession = async (prompt: string): Promise<void> => {
    const meta = await api.createSession()
    setSessions((s) => [meta, ...s])
    await openSessionInternal(meta.id)
    await api.send(meta.id, prompt)
  }

  const deleteSession = async (id: string): Promise<void> => {
    await api.deleteSession(id)
    setSessions((s) => s.filter((x) => x.id !== id))
    if (activeRef.current === id) {
      activeRef.current = null
      setActiveId(null)
      setItems([])
      setAuditEvents([])
      setRunning(false)
      setPending(null)
    }
  }

  const renameSession = async (id: string, title: string): Promise<void> => {
    await api.renameSession(id, title)
    setSessions((s) => s.map((x) => (x.id === id ? { ...x, title: title.slice(0, 60) || x.title } : x)))
  }

  const send = async (text: string): Promise<void> => {
    let sid = activeRef.current
    if (!sid) {
      const meta = await api.createSession()
      sid = meta.id
      activeRef.current = sid
      setActiveId(sid)
      setSessions((s) => [meta, ...s])
    }
    setItems([])
    setAuditEvents([])
    await api.send(sid, text)
  }

  const saveSkill = async (name: string, prompt: string): Promise<void> => {
    try {
      await api.saveSkill({ name, prompt })
      setSkillDraft(null)
      showToast(`技能「${name}」已保存,可在技能库中重跑`)
    } catch (e) {
      showToast(`保存失败:${(e as Error).message}`)
    }
  }

  // 全局快捷键:Ctrl+N 新会话 / Ctrl+B 审计面板 / Ctrl+, 设置
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (!e.ctrlKey || e.altKey || e.shiftKey) return
      const k = e.key.toLowerCase()
      if (k === 'n') {
        e.preventDefault()
        void newSession()
      } else if (k === 'b') {
        e.preventDefault()
        setAuditOpen((v) => !v)
      } else if (k === ',') {
        e.preventDefault()
        setView('settings')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeMeta = sessions.find((s) => s.id === activeId) ?? null
  const llmReady =
    !!settings &&
    (settings.activeProviderId === 'ollama'
      ? !!settings.ollama.model
      : settings.providers.some((p) => p.id === settings.activeProviderId && p.apiKey && p.model))
  const activeModel = (() => {
    if (!settings) return ''
    if (settings.activeProviderId === 'ollama') return settings.ollama.model ? `Ollama · ${settings.ollama.model}` : ''
    const p = settings.providers.find((x) => x.id === settings.activeProviderId)
    return p ? `${p.name} · ${p.model || '未设置模型'}` : ''
  })()

  const statusText = pending ? '等待确认' : running ? '执行中' : '空闲'
  const hasConversation = items.some((p) => p.kind === 'user')

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        view={view}
        onNew={newSession}
        onOpen={openSession}
        onDelete={deleteSession}
        onRename={renameSession}
        onTemplates={() => setView('templates')}
        onSkills={() => setView('skills')}
        onSettings={() => setView('settings')}
      />
      <main className="main">
        <header className="topbar">
          <div className="crumb">
            {view === 'chat'
              ? (activeMeta?.title ?? '欢迎')
              : view === 'templates'
                ? '资源'
                : view === 'skills'
                  ? '资源'
                  : '配置'}
          </div>
          <div className="topbar-right">
            {view === 'chat' && activeModel && <span className="model-badge" title="当前使用的模型">{activeModel}</span>}
            {!llmReady && view === 'chat' && (
              <button className="ghost small warn" onClick={() => setView('settings')}>
                未配置模型,点击设置
              </button>
            )}
            {view === 'chat' && activeId && hasConversation && !running && (
              <button className="ghost small" onClick={() => setSkillDraft({ name: activeMeta?.title ?? '', prompt: lastUserText(items) })} title="把这次任务的提示词保存为技能">
                <Icon name="bookmark" size={13} /> 沉淀为技能
              </button>
            )}
            <span className={`status-dot ${pending ? 'wait' : running ? 'run' : ''}`} />
            <span className="status-text">{statusText}</span>
            {view === 'chat' && activeId && (
              <button className="ghost small" onClick={() => setAuditOpen(!auditOpen)} title="显示/隐藏审计面板(Ctrl+B)">
                <Icon name="panelRight" size={13} />
                {auditOpen ? '隐藏审计面板' : '显示审计面板'}
              </button>
            )}
          </div>
        </header>
        <div className="content">
          {view === 'chat' && (
            <ChatView
              items={items}
              running={running}
              pending={pending}
              streamingTool={streamingTool}
              sessionId={activeId}
              llmReady={llmReady}
              onSend={send}
              onCancel={() => activeId && api.cancel(activeId)}
              onRespond={(ok) => {
                if (activeId && pending) {
                  setPending(null)
                  api.respondApproval(activeId, pending.approvalId, ok)
                }
              }}
              onOpenTemplates={() => setView('templates')}
              onOpenSettings={() => setView('settings')}
            />
          )}
          {view === 'templates' && (
            <TemplatesView
              onUse={(prompt) => {
                setView('chat')
                void runInNewSession(prompt)
              }}
            />
          )}
          {view === 'skills' && (
            <SkillsView
              onRun={(prompt) => {
                setView('chat')
                void runInNewSession(prompt)
              }}
            />
          )}
          {view === 'settings' && <SettingsView settings={settings} onSaved={setSettings} />}
        </div>
      </main>
      {view === 'chat' && auditOpen && <AuditPanel events={auditEvents} sessionId={activeId} />}

      {skillDraft && (
        <div className="modal-mask" onClick={() => setSkillDraft(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>沉淀为技能</h3>
            <p>把这次任务的提示词保存下来,以后在技能库里一键重跑。保存前可以修改措辞。</p>
            <label className="modal-field">
              技能名称
              <input value={skillDraft.name} onChange={(e) => setSkillDraft({ ...skillDraft, name: e.target.value })} placeholder="如:整理下载文件夹" />
            </label>
            <label className="modal-field">
              提示词
              <textarea
                value={skillDraft.prompt}
                onChange={(e) => setSkillDraft({ ...skillDraft, prompt: e.target.value })}
                rows={6}
              />
            </label>
            <div className="modal-actions">
              <button className="ghost" onClick={() => setSkillDraft(null)}>
                取消
              </button>
              <button className="primary" disabled={!skillDraft.name.trim() || !skillDraft.prompt.trim()} onClick={() => void saveSkill(skillDraft.name, skillDraft.prompt)}>
                保存技能
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function lastUserText(items: RenderItem[]): string {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]
    if (it.kind === 'user') return it.text
  }
  return ''
}
