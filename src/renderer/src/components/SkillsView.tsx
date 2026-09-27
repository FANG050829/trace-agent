import React, { useEffect, useState } from 'react'
import type { Skill } from '@shared/types'
import { api } from '../api'

/** 技能库:从完成任务里沉淀下来的可复用提示词,可编辑、可一键重跑 */
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

  return (
    <div className="skills-view">
      <div className="skills-head">
        <div>
          <h2>技能库</h2>
          <p className="dim">把常用的任务提示词沉淀成技能,一键重跑。在聊天页点「✦ 沉淀为技能」即可添加。</p>
        </div>
        <button className="primary" onClick={() => setEditing({ name: '', prompt: '' })}>
          ＋ 新建技能
        </button>
      </div>
      {err && <div className="notice st-error">{err}</div>}
      {!loaded && <div className="dim">加载中…</div>}
      {loaded && skills.length === 0 && (
        <div className="skills-empty">
          还没有技能。下次 agent 帮你完成一个任务后,点聊天页顶部的「✦ 沉淀为技能」把它保存下来。
        </div>
      )}
      <div className="tpl-grid">
        {skills.map((s) => (
          <div key={s.id} className="tpl-card">
            <div className="tpl-head">
              <div className="tpl-name">{s.name}</div>
              <div className="skill-prompt">{s.prompt}</div>
              <div className="skill-meta">更新于 {new Date(s.updatedAt).toLocaleDateString('zh-CN')}</div>
            </div>
            <div className="skill-actions">
              <button className="primary small" onClick={() => onRun(s.prompt)}>
                ▶ 重跑
              </button>
              <button className="ghost small" onClick={() => setEditing({ id: s.id, name: s.name, prompt: s.prompt })}>
                编辑
              </button>
              <button
                className="ghost small danger-text"
                onClick={() => {
                  if (confirm(`删除技能「${s.name}」?`)) {
                    api.deleteSkill(s.id).then(refresh)
                  }
                }}
              >
                删除
              </button>
            </div>
          </div>
        ))}
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
