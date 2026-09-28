import React, { useEffect, useState } from 'react'
import type { AppInfo, AppSettings, ProviderConfig, RiskPolicy } from '@shared/types'
import { api } from '../api'
import { Icon } from './Icon'

const PRESETS: Omit<ProviderConfig, 'id' | 'apiKey'>[] = [
  { name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4.6', vision: true },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat', vision: false },
  { name: 'Kimi', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', vision: false },
  { name: '通义千问', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', vision: true },
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', vision: true }
]

const POLICY_DESC: Record<RiskPolicy, string> = {
  relaxed: '宽松:仅不可逆操作需确认,其余自动执行',
  standard: '标准(推荐):写文件/跑命令等敏感操作需确认,读取类自动',
  strict: '严格:除读取外每一步都要你点头'
}

export function SettingsView(props: { settings: AppSettings | null; onSaved: (s: AppSettings) => void }): React.ReactNode {
  const [draft, setDraft] = useState<AppSettings | null>(props.settings)
  const [saved, setSaved] = useState(false)
  const [testMsg, setTestMsg] = useState<Record<string, string>>({})
  const [models, setModels] = useState<Record<string, string[]>>({})
  const [keyVisible, setKeyVisible] = useState<Record<string, boolean>>({})
  const [ollamaModels, setOllamaModels] = useState<string[]>([])
  const [info, setInfo] = useState<AppInfo | null>(null)

  useEffect(() => {
    api.getAppInfo().then(setInfo).catch(() => undefined)
  }, [])

  useEffect(() => {
    if (props.settings && !draft) setDraft(props.settings)
  }, [props.settings]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!draft) return <div className="settings-view dim">加载中…</div>

  const dirty = JSON.stringify(draft) !== JSON.stringify(props.settings)

  const upd = (patch: Partial<AppSettings>): void => {
    setDraft({ ...draft, ...patch })
    setSaved(false)
  }
  const updProvider = (id: string, patch: Partial<ProviderConfig>): void =>
    upd({ providers: draft.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)) })

  const addProvider = (presetIndex: number | null): void => {
    const base = presetIndex === null ? { name: '自定义服务', baseUrl: '', model: '', vision: false } : PRESETS[presetIndex]
    const p: ProviderConfig = { id: `p-${Date.now().toString(36)}`, apiKey: '', ...base }
    upd({ providers: [...draft.providers, p], activeProviderId: draft.activeProviderId ?? p.id })
  }

  const testProvider = async (p: ProviderConfig): Promise<void> => {
    setTestMsg((m) => ({ ...m, [p.id]: '测试中…' }))
    const r = await api.testProvider(p)
    setTestMsg((m) => ({ ...m, [p.id]: `${r.ok ? '' : '连接失败 — '}${r.message}` }))
    if (r.models.length) {
      setModels((m) => ({ ...m, [p.id]: r.models }))
      // 未填模型名时自动采用服务端列表里的第一个
      if (!p.model.trim()) updProvider(p.id, { model: r.models[0] })
    }
  }

  const detectOllama = async (): Promise<void> => {
    setTestMsg((m) => ({ ...m, ollama: '检测中…' }))
    const r = await api.listOllamaModels(draft.ollama.baseUrl)
    setOllamaModels(r.models)
    setTestMsg((m) => ({ ...m, ollama: `${r.ok ? '' : '连接失败 — '}${r.message}` }))
  }

  const save = async (): Promise<void> => {
    const s = await api.saveSettings(draft)
    props.onSaved(s)
    setSaved(true)
  }

  return (
    <div className="settings-view">
      <h2>设置</h2>

      <section>
        <h3>模型服务</h3>
        <p className="dim">选择一个服务商并填入 API Key。只要是 OpenAI 兼容接口都能用(智谱、DeepSeek、Kimi、通义、OpenAI 等)。</p>
        <div className="preset-row">
          {PRESETS.map((p, i) => (
            <button key={p.name} className="ghost small" onClick={() => addProvider(i)}>
              ＋ {p.name}
            </button>
          ))}
          <button className="ghost small" onClick={() => addProvider(null)}>
            ＋ 自定义
          </button>
        </div>
        {draft.providers.length === 0 && <div className="dim">还没有添加服务商,点上面的按钮快速添加。</div>}
        {draft.providers.map((p) => (
          <div key={p.id} className={`provider-card ${draft.activeProviderId === p.id ? 'active' : ''}`}>
            <div className="provider-head">
              <label className="radio-row">
                <input
                  type="radio"
                  name="activeProvider"
                  checked={draft.activeProviderId === p.id}
                  onChange={() => upd({ activeProviderId: p.id })}
                />
                <strong>{p.name || '未命名'}</strong>
              </label>
              <span>
                <button className="ghost small" onClick={() => void testProvider(p)}>
                  测试连接
                </button>
                <button
                  className="ghost small danger-text"
                  onClick={() => {
                    if (!confirm(`删除服务商「${p.name || '未命名'}」?`)) return
                    upd({
                      providers: draft.providers.filter((x) => x.id !== p.id),
                      activeProviderId: draft.activeProviderId === p.id ? null : draft.activeProviderId
                    })
                  }}
                >
                  删除
                </button>
              </span>
            </div>
            <div className="field-grid">
              <label>名称 <input value={p.name} onChange={(e) => updProvider(p.id, { name: e.target.value })} /></label>
              <label>Base URL <input value={p.baseUrl} placeholder="https://..." onChange={(e) => updProvider(p.id, { baseUrl: e.target.value })} /></label>
              <label>
                API Key
                <span className="key-row">
                  <input
                    type={keyVisible[p.id] ? 'text' : 'password'}
                    value={p.apiKey}
                    onChange={(e) => updProvider(p.id, { apiKey: e.target.value })}
                  />
                  <button
                    className="ghost small"
                    title={keyVisible[p.id] ? '隐藏 API Key' : '显示 API Key'}
                    onClick={() => setKeyVisible((v) => ({ ...v, [p.id]: !v[p.id] }))}
                  >
                    <Icon name={keyVisible[p.id] ? 'eyeOff' : 'eye'} size={13} />
                  </button>
                </span>
              </label>
              <label>
                模型
                <input
                  value={p.model}
                  list={`models-${p.id}`}
                  placeholder="填模型名,或测试连接后从列表选"
                  onChange={(e) => updProvider(p.id, { model: e.target.value })}
                />
                <datalist id={`models-${p.id}`}>
                  {(models[p.id] ?? []).map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </label>
            </div>
            <label className="check-row">
              <input type="checkbox" checked={p.vision} onChange={(e) => updProvider(p.id, { vision: e.target.checked })} />
              支持看图(视觉模型,截图类任务需要)
            </label>
            {testMsg[p.id] && <div className="test-msg">{testMsg[p.id]}</div>}
          </div>
        ))}
      </section>

      <section>
        <h3>本地模型(Ollama)</h3>
        <label className="radio-row">
          <input
            type="radio"
            name="activeProvider"
            checked={draft.activeProviderId === 'ollama'}
            onChange={() => upd({ activeProviderId: 'ollama' })}
          />
          <strong>使用本地 Ollama</strong>
        </label>
        <div className="field-grid">
          <label>服务地址 <input value={draft.ollama.baseUrl} onChange={(e) => upd({ ollama: { ...draft.ollama, baseUrl: e.target.value } })} /></label>
          <label>
            模型
            <input
              value={draft.ollama.model}
              list="ollama-models"
              onChange={(e) => upd({ ollama: { ...draft.ollama, model: e.target.value } })}
            />
            <datalist id="ollama-models">
              {ollamaModels.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </label>
        </div>
        <div className="check-row-wrap">
          <label className="check-row">
            <input type="checkbox" checked={draft.ollama.vision} onChange={(e) => upd({ ollama: { ...draft.ollama, vision: e.target.checked } })} />
            支持看图(如 qwen2.5vl / llava)
          </label>
          <button className="ghost small" onClick={detectOllama}>
            检测并获取模型列表
          </button>
        </div>
        {testMsg.ollama && <div className="test-msg">{testMsg.ollama}</div>}
      </section>

      <section>
        <h3>安全与审计</h3>
        <div className="policy-group">
          {(['relaxed', 'standard', 'strict'] as RiskPolicy[]).map((p) => (
            <label key={p} className={`policy-card ${draft.riskPolicy === p ? 'active' : ''}`}>
              <input type="radio" name="riskPolicy" checked={draft.riskPolicy === p} onChange={() => upd({ riskPolicy: p })} />
              <span>{p === 'relaxed' ? '宽松' : p === 'standard' ? '标准' : '严格'}</span>
              <em>{POLICY_DESC[p]}</em>
            </label>
          ))}
        </div>
        <label className="check-row">
          <input type="checkbox" checked={draft.screenshotToVision} onChange={(e) => upd({ screenshotToVision: e.target.checked })} />
          截图自动回传给视觉模型(模型不支持看图时可关闭)
        </label>
        <div className="roots-block">
          <div className="roots-head">
            允许的工作目录
            <button
              className="ghost small"
              onClick={async () => {
                const dir = await api.pickDirectory()
                if (dir && !(draft.workspaceRoots ?? []).includes(dir)) {
                  upd({ workspaceRoots: [...(draft.workspaceRoots ?? []), dir] })
                }
              }}
            >
              添加目录
            </button>
          </div>
          <p className="roots-hint">
            Agent 的文件工具只能读写这里列出的目录;留空则不限制范围(其余步骤仍按风险等级确认)。
            应用数据目录(审计记录、加密密钥)始终禁止访问。
          </p>
          <div className="roots-list">
            {(draft.workspaceRoots ?? []).map((r) => (
              <div className="root-item" key={r}>
                <span className="root-path" title={r}>
                  {r}
                </span>
                <button
                  className="ghost small danger-text"
                  onClick={() => upd({ workspaceRoots: draft.workspaceRoots.filter((x) => x !== r) })}
                  title="移除该目录"
                >
                  移除
                </button>
              </div>
            ))}
            {(draft.workspaceRoots ?? []).length === 0 && (
              <div className="root-item dim">未设置 — 文件工具不限制目录范围</div>
            )}
          </div>
        </div>
        <div className="check-row-wrap">
          <label className="check-row">
            单次任务最大步数
            <input
              type="number"
              min={5}
              max={200}
              value={draft.maxSteps}
              onChange={(e) => upd({ maxSteps: Number(e.target.value) || 40 })}
              style={{ width: 90 }}
            />
          </label>
        </div>
      </section>

      <section>
        <h3>高级</h3>
        <div className="check-row-wrap">
          <label className="check-row">
            温度(创造性,0-2)
            <input
              type="number"
              min={0}
              max={2}
              step={0.1}
              value={draft.temperature}
              onChange={(e) => upd({ temperature: Math.max(0, Math.min(2, Number(e.target.value) || 0)) })}
              style={{ width: 90 }}
            />
          </label>
          <label className="check-row">
            上下文预算(字符)
            <input
              type="number"
              min={12000}
              max={400000}
              step={4000}
              value={draft.maxContextChars}
              onChange={(e) => upd({ maxContextChars: Number(e.target.value) || 60000 })}
              style={{ width: 110 }}
            />
          </label>
        </div>
        <p className="dim">上下文预算控制发给模型的历史长度:超出后最早的消息会被自动省略,较老的截图只保留最近几张。上下文窗口小的模型(如 8k)建议调低。</p>
      </section>

      <section>
        <h3>后台与定时</h3>
        <label className="check-row">
          <input
            type="checkbox"
            checked={draft.background.closeToTray}
            onChange={(e) => upd({ background: { ...draft.background, closeToTray: e.target.checked } })}
          />
          关闭窗口时最小化到托盘(定时技能继续执行,托盘图标可唤回窗口)
        </label>
        <p className="dim">技能库里可为任意技能设置定时(每天 / 按间隔 / 单次)。应用运行期间(含托盘常驻)每 30 秒检查一次到期任务。</p>
      </section>

      <section>
        <h3>局域网审批</h3>
        <label className="check-row">
          <input
            type="checkbox"
            checked={draft.lanApproval.enabled}
            onChange={(e) => upd({ lanApproval: { ...draft.lanApproval, enabled: e.target.checked } })}
          />
          启用局域网远程审批(高风险操作可发送到同局域网的手机/平板确认)
        </label>
        {draft.lanApproval.enabled && (
          <>
            <div className="check-row-wrap" style={{ marginTop: 8 }}>
              <label className="check-row">
                端口
                <input
                  type="number"
                  min={1024}
                  max={65535}
                  value={draft.lanApproval.port}
                  onChange={(e) => upd({ lanApproval: { ...draft.lanApproval, port: Number(e.target.value) || 8765 } })}
                  style={{ width: 100 }}
                />
              </label>
              {info?.lanUrl && (
                <button
                  className="ghost small"
                  title="复制到剪贴板,在同一 Wi-Fi 下的手机浏览器打开"
                  onClick={() => navigator.clipboard.writeText(info.lanUrl ?? '')}
                >
                  <Icon name="copy" size={12} /> 复制审批页地址
                </button>
              )}
            </div>
            {info?.lanUrl && (
              <div className="test-msg">审批页:{info.lanUrl}</div>
            )}
            <p className="dim">保存后生效。手机与电脑需在同一局域网;地址自带访问令牌,请勿外传。仅建议在可信网络使用。</p>
          </>
        )}
      </section>

      <section>
        <h3>数据目录</h3>
        <div className="test-msg" style={{ marginBottom: 10 }}>{info?.dataDir ?? '读取中…'}</div>
        <div className="check-row-wrap">
          <button className="ghost small" onClick={() => void api.openDataDir()}>
            <Icon name="folderOpen" size={13} />
            打开数据目录
          </button>
          {info?.isPackaged ? (
            <button
              className="ghost small"
              onClick={async () => {
                const dir = await api.pickDirectory()
                if (!dir) return
                if (!confirm('把数据目录更改为:' + dir + '?应用将自动重启以生效。')) return
                await api.setDataDir(dir)
              }}
            >
              更改数据目录(重启生效)
            </button>
          ) : (
            <span className="dim" style={{ fontSize: 11.5 }}>开发模式下数据目录固定在项目内。</span>
          )}
        </div>
        <p className="dim">审计日志、会话记录、技能与设置都在数据目录内;打包版默认在程序旁,可通过标记文件 data-dir.txt 或环境变量 TRACE_DATA_DIR 指定其他位置。</p>
      </section>

      <div className="save-row">
        {dirty && !saved && <span className="dirty-hint">● 有未保存的修改</span>}
        <button className="primary save-btn" onClick={save}>
          {saved ? '✓ 已保存' : '保存设置'}
        </button>
      </div>
    </div>
  )
}
