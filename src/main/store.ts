import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { safeStorage } from 'electron'
import { dataDir, sessionsDir, settingsFile, skillsFile } from './config'
import { assertSessionId } from './guards'
import { normalizeAudit } from '@shared/audit'
import type { AuditEvent, AppSettings, SessionMeta, Skill } from '@shared/types'

// ---------- 设置 ----------

export function defaultSettings(): AppSettings {
  const home = os.homedir()
  return {
    providers: [],
    activeProviderId: null,
    ollama: { baseUrl: 'http://localhost:11434/v1', model: 'qwen3:8b', vision: false },
    riskPolicy: 'standard',
    workspaceRoots: [path.join(home, 'Desktop'), path.join(home, 'Documents'), path.join(home, 'Downloads')],
    screenshotToVision: true,
    maxSteps: 40,
    temperature: 0.7,
    maxContextChars: 60000,
    background: { closeToTray: false },
    lanApproval: { enabled: false, port: 8765, token: '' }
  }
}

/**
 * API Key 加密存储。
 *
 * 之前所有 Key 以明文躺在 settings.json 里,而 fs_read_file 的风险等级是 safe(零确认)——
 * 模型只要被诱导读一次配置就会把全部密钥拿走。现在用 Electron safeStorage
 * (Windows 上走 DPAPI,密钥由当前用户的凭据保护)加密后落盘。
 * 密文单独放一个文件,settings.json 里只留标记,Agent 的文件工具读不到密文也解不开。
 */
const secretsFile = path.join(dataDir, 'providers.secrets.json')

interface SecretBlob {
  /** providerId → base64 密文 */
  [providerId: string]: string
}

function canEncrypt(): boolean {
  try {
    return safeStorage.isEncryptionAvailable()
  } catch {
    return false
  }
}

function loadSecrets(): SecretBlob {
  try {
    const o = JSON.parse(fs.readFileSync(secretsFile, 'utf-8')) as SecretBlob
    return o && typeof o === 'object' ? o : {}
  } catch {
    return {}
  }
}

function saveSecrets(blob: SecretBlob): void {
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(secretsFile, JSON.stringify(blob, null, 2), 'utf-8')
}

function encryptKey(plain: string): string | null {
  if (!plain || !canEncrypt()) return null
  try {
    return safeStorage.encryptString(plain).toString('base64')
  } catch {
    return null
  }
}

function decryptKey(b64: string): string {
  try {
    return safeStorage.decryptString(Buffer.from(b64, 'base64'))
  } catch {
    return ''
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = JSON.parse(fs.readFileSync(settingsFile, 'utf-8')) as Partial<AppSettings>
    const d = defaultSettings()
    const secrets = loadSecrets()
    const providers = (raw.providers ?? []).map((p) => ({
      ...p,
      // 密文优先;没有密文时保留原值(兼容从旧版本升级、明文尚未迁移的记录)
      apiKey: secrets[p.id] ? decryptKey(secrets[p.id]) : (p.apiKey ?? '')
    }))
    return {
      ...d,
      ...raw,
      providers,
      ollama: { ...d.ollama, ...(raw.ollama ?? {}) },
      background: { ...d.background, ...(raw.background ?? {}) },
      lanApproval: { ...d.lanApproval, ...(raw.lanApproval ?? {}) }
    }
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(s: AppSettings): AppSettings {
  fs.mkdirSync(dataDir, { recursive: true })
  const secrets: SecretBlob = {}
  const providers = s.providers.map((p) => {
    if (!p.apiKey) return { ...p, apiKey: '' }
    const enc = encryptKey(p.apiKey)
    // 加密不可用时退回明文并保留在 settings.json(总比丢配置强),UI 会在设置页提示
    if (enc) {
      secrets[p.id] = enc
      return { ...p, apiKey: '' }
    }
    return { ...p }
  })
  // settings.json 只留不含密钥的结构
  const onDisk: AppSettings = { ...s, providers }
  fs.writeFileSync(settingsFile, JSON.stringify(onDisk, null, 2), 'utf-8')
  saveSecrets(secrets)
  return s
}

// ---------- 会话索引 ----------

function indexFile(): string {
  return path.join(sessionsDir, 'index.json')
}

export function listSessions(): SessionMeta[] {
  try {
    const arr = JSON.parse(fs.readFileSync(indexFile(), 'utf-8')) as SessionMeta[]
    return arr.sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    return []
  }
}

export function saveSessionIndex(metas: SessionMeta[]): void {
  fs.mkdirSync(sessionsDir, { recursive: true })
  fs.writeFileSync(indexFile(), JSON.stringify(metas, null, 2), 'utf-8')
}

export function upsertSession(meta: SessionMeta): void {
  const all = listSessions().filter((m) => m.id !== meta.id)
  all.push(meta)
  saveSessionIndex(all)
}

export function removeSession(id: string): void {
  assertSessionId(id) // id 会直接拼进 rmSync 的路径,必须挡住 `../` 之类的穿越
  saveSessionIndex(listSessions().filter((m) => m.id !== id))
  fs.rmSync(sessionDir(id), { recursive: true, force: true })
}

export function renameSession(id: string, title: string): void {
  assertSessionId(id)
  const meta = listSessions().find((m) => m.id === id)
  if (!meta) throw new Error(`会话不存在:${id}`)
  upsertSession({ ...meta, title: title.slice(0, 60) || meta.title })
}

// ---------- 会话目录 ----------

/** 所有会话路径都经由这里;id 非 UUID 一律拒绝,杜绝路径穿越 */
export function sessionDir(id: string): string {
  return path.join(sessionsDir, assertSessionId(id))
}

export function shotsDir(id: string): string {
  return path.join(sessionDir(id), 'shots')
}

export function transcriptFile(id: string): string {
  return path.join(sessionDir(id), 'transcript.json')
}

export function auditFile(id: string): string {
  return path.join(sessionDir(id), 'audit.jsonl')
}

export function loadTranscript(id: string): unknown[] {
  try {
    return JSON.parse(fs.readFileSync(transcriptFile(id), 'utf-8'))
  } catch {
    return []
  }
}

/** 保存对话记录;超过 64KB 的图片 dataURL 用占位符替换,避免文件膨胀 */
export function saveTranscript(id: string, messages: unknown[]): void {
  fs.mkdirSync(sessionDir(id), { recursive: true })
  const json = JSON.stringify(
    messages,
    (k, v) => {
      if (typeof v === 'string' && v.startsWith('data:image/') && v.length > 65536) {
        return v.slice(0, 64) + '...(截图数据已省略)'
      }
      return v
    },
    2
  )
  fs.writeFileSync(transcriptFile(id), json, 'utf-8')
}

export function loadAudit(id: string): AuditEvent[] {
  try {
    const raw = fs.readFileSync(auditFile(id), 'utf-8')
    const events: AuditEvent[] = []
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue
      try {
        const { h, ...rest } = JSON.parse(line) as AuditEvent & { h?: string }
        void h // 哈希只用于校验,不进入渲染层
        events.push(rest)
      } catch {
        /* 跳过坏行,不让单行损坏导致整个会话打不开 */
      }
    }
    // tool_call 的最终状态由 tool_result 归一得出(原始日志只追加、不重写)
    return normalizeAudit(events)
  } catch {
    return []
  }
}

// ---------- 技能 ----------

export function listSkills(): Skill[] {
  try {
    const arr = JSON.parse(fs.readFileSync(skillsFile, 'utf-8')) as Skill[]
    return Array.isArray(arr) ? arr.sort((a, b) => b.updatedAt - a.updatedAt) : []
  } catch {
    return []
  }
}

export function saveSkillFile(skills: Skill[]): void {
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(skillsFile, JSON.stringify(skills, null, 2), 'utf-8')
}

export function upsertSkill(input: { id?: string; name: string; prompt: string; schedule?: Skill['schedule'] }): Skill {
  const all = listSkills()
  const now = Date.now()
  const existing = input.id ? all.find((s) => s.id === input.id) : undefined
  const skill: Skill = existing
    ? {
        ...existing,
        name: input.name || existing.name,
        prompt: input.prompt,
        schedule: input.schedule ?? existing.schedule,
        updatedAt: now
      }
    : {
        id: `sk-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: input.name,
        prompt: input.prompt,
        schedule: input.schedule,
        createdAt: now,
        updatedAt: now
      }
  saveSkillFile([...all.filter((s) => s.id !== skill.id), skill])
  return skill
}

export function removeSkill(id: string): void {
  saveSkillFile(listSkills().filter((s) => s.id !== id))
}
