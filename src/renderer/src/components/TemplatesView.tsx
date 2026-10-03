import React, { useEffect, useState } from 'react'
import type { TemplateInfo } from '@shared/types'
import { api } from '../api'
import { Icon } from './Icon'

const CATS = ['浏览器', '文件整理', '国产办公', '国产应用', '系统', '屏幕']

export function TemplatesView({ onUse }: { onUse: (prompt: string) => void }): React.ReactNode {
  const [templates, setTemplates] = useState<TemplateInfo[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, Record<string, string>>>({})
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    api.listTemplates().then(setTemplates)
  }, [])

  const setValue = (tid: string, key: string, v: string): void =>
    setValues((prev) => ({ ...prev, [tid]: { ...(prev[tid] ?? {}), [key]: v } }))

  const run = async (t: TemplateInfo): Promise<void> => {
    setErr(null)
    try {
      const { prompt } = await api.instantiateTemplate(t.id, values[t.id] ?? {})
      onUse(prompt)
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <div className="templates-view">
      <div className="page-inner">
      <h2>模板库</h2>
      <p className="dim">挑一个场景，填几个参数，agent 会带着完整的审计记录去执行。</p>
      {err && <div className="notice st-error">{err}</div>}
      {CATS.map((cat) => {
        const list = templates.filter((t) => t.category === cat)
        if (!list.length) return null
        return (
          <section key={cat}>
            <h3>{cat}</h3>
            <div className="tpl-grid">
              {list.map((t) => (
                <div key={t.id} className={`tpl-card ${openId === t.id ? 'open' : ''}`}>
                  <div
                    className="tpl-head"
                    onClick={() => {
                      setOpenId(openId === t.id ? null : t.id)
                      setErr(null)
                    }}
                  >
                    <div className="tpl-name">
                      {t.name}
                      {t.badge && <span className="badge">{t.badge}</span>}
                    </div>
                    <div className="tpl-desc">{t.desc}</div>
                    <span className="tpl-chev">
                      <Icon name="chevron" size={14} />
                    </span>
                  </div>
                  {openId === t.id && (
                    <div className="tpl-form">
                      {t.params.map((p) => (
                        <label key={p.key}>
                          <span>
                            {p.label}
                            {p.required && <em>（必填）</em>}
                          </span>
                          <span className="input-row">
                            <input
                              type="text"
                              value={values[t.id]?.[p.key] ?? ''}
                              placeholder={p.placeholder ?? ''}
                              onChange={(e) => setValue(t.id, p.key, e.target.value)}
                            />
                            {p.type === 'dir' && (
                              <button
                                className="ghost small"
                                onClick={async () => {
                                  const d = await api.pickDirectory()
                                  if (d) setValue(t.id, p.key, d)
                                }}
                              >
                                选择
                              </button>
                            )}
                            {p.type === 'file' && (
                              <button
                                className="ghost small"
                                onClick={async () => {
                                  const f = await api.pickFile()
                                  if (f) setValue(t.id, p.key, f)
                                }}
                              >
                                选择
                              </button>
                            )}
                          </span>
                        </label>
                      ))}
                      <button className="primary" onClick={() => run(t)}>
                        <Icon name="play" size={12} />
                        开始执行
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
      </div>
    </div>
  )
}
