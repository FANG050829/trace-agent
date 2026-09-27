import React, { useState } from 'react'
import type { SessionMeta } from '@shared/types'
import { Icon } from './Icon'

export function Sidebar(props: {
  sessions: SessionMeta[]
  activeId: string | null
  view: 'chat' | 'templates' | 'skills' | 'settings'
  onNew: () => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onTemplates: () => void
  onSkills: () => void
  onSettings: () => void
}): React.ReactNode {
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const kw = search.trim().toLowerCase()
  const shown = kw ? props.sessions.filter((s) => s.title.toLowerCase().includes(kw)) : props.sessions

  const commitRename = (): void => {
    if (editingId && editingText.trim()) props.onRename(editingId, editingText.trim())
    setEditingId(null)
  }

  return (
    <aside className="sidebar">
      <div className="logo-row">
        <span className="logo-mark">
          <Icon name="mark" size={20} />
        </span>
        <div>
          <div className="app-name">留痕 Agent</div>
          <div className="app-sub">桌面自动化 · 全程可审计</div>
        </div>
      </div>
      <button className="new-session" onClick={props.onNew} title="新建会话(Ctrl+N)">
        <Icon name="plus" size={14} /> 新建会话
      </button>
      <div className="session-search">
        <span className="search-ico">
          <Icon name="search" size={13} />
        </span>
        <input placeholder="搜索会话" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="session-list">
        {shown.map((s) => (
          <div
            key={s.id}
            className={`session-item ${s.id === props.activeId && props.view === 'chat' ? 'active' : ''}`}
            onClick={() => props.onOpen(s.id)}
            onDoubleClick={() => {
              setEditingId(s.id)
              setEditingText(s.title)
            }}
          >
            {editingId === s.id ? (
              <input
                className="session-rename"
                autoFocus
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename()
                  if (e.key === 'Escape') setEditingId(null)
                }}
              />
            ) : (
              <>
                <div className="session-title" title={s.title + '(双击重命名)'}>
                  {s.title}
                </div>
                <div className="session-time">{fmtTime(s.updatedAt)}</div>
                <button
                  className="session-del"
                  title="删除会话"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`删除会话「${s.title}」?其审计记录将一并删除。`)) props.onDelete(s.id)
                  }}
                >
                  <Icon name="x" size={12} />
                </button>
              </>
            )}
          </div>
        ))}
        {shown.length === 0 && <div className="session-empty">{search ? '没有匹配的会话' : '还没有会话'}</div>}
      </div>
      <div className="side-nav">
        <div className="nav-label">资源</div>
        <button className={props.view === 'templates' ? 'active' : ''} onClick={props.onTemplates}>
          <Icon name="layout" size={14} /> 模板库
        </button>
        <button className={props.view === 'skills' ? 'active' : ''} onClick={props.onSkills}>
          <Icon name="repeat" size={14} /> 技能库
        </button>
        <button className={props.view === 'settings' ? 'active' : ''} onClick={props.onSettings}>
          <Icon name="sliders" size={14} /> 设置
        </button>
      </div>
    </aside>
  )
}

function fmtTime(ts: number): string {
  if (!ts) return ''
  const d = new Date(ts)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? `今天 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    : `${d.getMonth() + 1}/${d.getDate()}`
}
