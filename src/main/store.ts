import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { dataDir, sessionsDir, settingsFile, skillsFile } from './config'
import type { AppSettings, SessionMeta, Skill } from '@shared/types'

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
    maxContextChars: 60000
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = JSON.parse(fs.readFileSync(settingsFile, 'utf-8')) as Partial<AppSettings>
    return { ...defaultSettings(), ...raw, ollama: { ...defaultSettings().ollama, ...(raw.ollama ?? {}) } }
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(s: AppSettings): AppSettings {
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(settingsFile, JSON.stringify(s, null, 2), 'utf-8')
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
  saveSessionIndex(listSessions().filter((m) => m.id !== id))
  fs.rmSync(path.join(sessionsDir, id), { recursive: true, force: true })
}

export function renameSession(id: string, title: string): void {
  const meta = listSessions().find((m) => m.id === id)
  if (!meta) throw new Error(`会话不存在:${id}`)
  upsertSession({ ...meta, title: title.slice(0, 60) || meta.title })
}

// ---------- 会话目录 ----------

export function sessionDir(id: string): string {
  return path.join(sessionsDir, id)
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

export function loadAudit(id: string): unknown[] {
  try {
    const raw = fs.readFileSync(auditFile(id), 'utf-8')
    return raw
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l))
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

export function upsertSkill(input: { id?: string; name: string; prompt: string }): Skill {
  const all = listSkills()
  const now = Date.now()
  const existing = input.id ? all.find((s) => s.id === input.id) : undefined
  const skill: Skill = existing
    ? { ...existing, name: input.name || existing.name, prompt: input.prompt, updatedAt: now }
    : { id: `sk-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`, name: input.name, prompt: input.prompt, createdAt: now, updatedAt: now }
  saveSkillFile([...all.filter((s) => s.id !== skill.id), skill])
  return skill
}

export function removeSkill(id: string): void {
  saveSkillFile(listSkills().filter((s) => s.id !== id))
}
