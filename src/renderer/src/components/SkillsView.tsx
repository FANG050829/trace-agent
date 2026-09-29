import React, { useEffect, useState } from 'react'
import type { Skill, SkillSchedule } from '@shared/types'
import { api } from '../api'
import { Icon } from './Icon'

/** 技能库:从完成任务里沉淀下来的可复用提示词,可编辑、可一键重跑、可定时执行 */
export function SkillsView({ onRun }: { onRun: (prompt: string) => void }): React.ReactNode {
  const [skills, setSkills] = useState<Skill[]>([])
  const [editing, setEditing] = useState<{ id?: string; name: string; prompt: string } | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const refresh = (): void => {
    api.listSkills().then((s) => {
      setSkills(s)
      setLoaded(true)
    })
  }
  useEffect(refresh, [])

  const save = async (): Promise<void> => {
    if (!editing) return
    setErr(null)
    try {
      await api.saveSkill(editing)
      setEditing(null)
      refresh()
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  const saveSchedule = async (sk: Skill, schedule: SkillSchedule | undefined): Promise<void> => {
    try {
      await api.saveSkill({ id: sk.id, name: sk.name, prompt: sk.prompt, schedule })
      refresh()
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  const patchLocal = (id: string, schedule: SkillSchedule | undefined): void =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, schedule } : s)))

  return (
    <div className="skills-view">
      <div className="page-inner">
      <div className="skills-head">
        <div>
          <h2>技能库</h2>
          <p className="dim" style={{ marginTop: 4 }}>
            把常用的任务提示词沉淀成技能,一键重跑;也可设定时执行(应用常驻或最小化到托盘时生效)。
          </p>
        </div>
        <button className="primary" onClick={() => setEditing({ name: '', prompt: '' })}>
          <Icon name="plus" size={13} /> 新建技能
        </button>
      </div>
      {err && <div className="notice st-error">{err}</div>}
      {!loaded && <div className="dim">加载中…</div>}
      {loaded && skills.length === 0 && (
        <div className="skills-empty">
          还没有技能。下次 agent 帮你完成一个任务后,点聊天页顶部的「沉淀为技能」把它保存下来。
        </div>
      )}
      <div className="tpl-grid">
        {skills.map((s) => (
          <SkillCard
            key={s.id}
            sk={s}
            onRun={onRun}
            onEdit={() => setEditing({ id: s.id, name: s.name, prompt: s.prompt })}
            onDelete={() => {
              if (confirm(`删除技能「${s.name}」?`)) {
                api.deleteSkill(s.id).then(refresh)
              }
            }}
            onSaveSchedule={saveSchedule}
            patchLocal={patchLocal}
          />
        ))}
      </div>
      </div>

      {editing && (
        <div className="modal-mask" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? '编辑技能' : '新建技能'}</h3>
            <label className="modal-field">
              技能名称
              <input
                value={editing.name}
                placeholder="如:整理下载文件夹"
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </label>
            <label className="modal-field">
              提示词
              <textarea value={editing.prompt} rows={8} onChange={(e) => setEditing({ ...editing, prompt: e.target.value })} />
            </label>
            {err && <div className="notice st-error">{err}</div>}
            <div className="modal-actions">
              <button className="ghost" onClick={() => setEditing(null)}>
                取消
              </button>
              <button className="primary" disabled={!editing.name.trim() || !editing.prompt.trim()} onClick={() => void save()}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SkillCard(props: {
  sk: Skill
  onRun: (prompt: string) => void
  onEdit: () => void
  onDelete: () => void
  onSaveSchedule: (sk: Skill, schedule: SkillSchedule | undefined) => Promise<void>
  patchLocal: (id: string, schedule: SkillSchedule | undefined) => void
}): React.ReactNode {
  const { sk } = props
  const s = sk.schedule
  const [open, setOpen] = useState(false)

  const patch = (p: Partial<SkillSchedule>): void => {
    const base: SkillSchedule = s ?? { kind: 'daily', time: '09:00', enabled: false }
    props.patchLocal(sk.id, { ...base, ...p })
  }

  const nextText = (): string => {
    if (!s?.enabled) return ''
    if (s.kind === 'daily') return `每天 ${s.time ?? '09:00'}`
    if (s.kind === 'interval') return `每 ${s.intervalMin ?? 30} 分钟`
    return '下次保存后立即执行一次'
  }

  return (
    <div className="tpl-card">
      <div className="tpl-head">
        <div className="tpl-name">
          {s?.enabled && <span className="chip ok">定时中</span>}
          {sk.name}
        </div>
        <div className="skill-prompt">{sk.prompt}</div>
        <div className="skill-meta">
          {nextText()}
          {nextText() && ' · '}
          更新于 {new Date(sk.updatedAt).toLocaleDateString('zh-CN')}
        </div>
      </div>
      {open && (
        <div className="schedule-body">
          <label className="check-row">
            <input type="checkbox" checked={!!s?.enabled} onChange={(e) => patch({ enabled: e.target.checked })} />
            启用定时执行
          </label>
          <div className="schedule-row">
            <select value={s?.kind ?? 'daily'} onChange={(e) => patch({ kind: e.target.value as SkillSchedule['kind'] })}>
              <option value="daily">每天定时</option>
              <option value="interval">按间隔重复</option>
              <option value="once">只跑一次</option>
            </select>
            {s?.kind === 'interval' ? (
              <input
                type="number"
                min={5}
                max={1440}
                value={s.intervalMin ?? 30}
                onChange={(e) => patch({ intervalMin: Number(e.target.value) || 30 })}
                style={{ width: 110 }}
                title="分钟"
              />
            ) : (
              <input type="time" value={s?.time ?? '09:00'} onChange={(e) => patch({ time: e.target.value })} style={{ width: 130 }} />
            )}
            <button className="primary small" onClick={() => void props.onSaveSchedule(sk, s)}>
              保存定时
            </button>
          </div>
          <p className="dim" style={{ fontSize: 11.5 }}>
            定时运行会在全新会话中执行;应用最小化到托盘时也会生效(设置里开启「关闭到托盘」)。
          </p>
        </div>
      )}
      <div className="skill-actions">
        <button className="primary small" onClick={() => props.onRun(sk.prompt)}>
          <Icon name="play" size={11} /> 重跑
        </button>
        <button className="ghost small" onClick={() => setOpen(!open)}>
          <Icon name="clock" size={12} /> 定时
        </button>
        <button className="ghost small" onClick={props.onEdit}>
          编辑
        </button>
        <button className="ghost small danger-text" onClick={props.onDelete}>
          删除
        </button>
      </div>
    </div>
  )
}
