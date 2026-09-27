import fs from 'node:fs'
import path from 'node:path'
import { auditFile, sessionDir, shotsDir } from './store'
import type { AuditEvent, AuditEventType } from '@shared/types'

/** 每个会话一个审计记录器:所有事件追加写入 audit.jsonl,永不删除 */
export class SessionAudit {
  constructor(public sessionId: string) {
    fs.mkdirSync(shotsDir(sessionId), { recursive: true })
  }

  append(type: AuditEventType, fields: Partial<AuditEvent> = {}): AuditEvent {
    const event: AuditEvent = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      type,
      ...fields
    }
    fs.appendFileSync(auditFile(this.sessionId), JSON.stringify(event) + '\n', 'utf-8')
    return event
  }

  /** 保存截图到会话目录,返回文件名 */
  saveShot(png: Buffer): string {
    fs.mkdirSync(shotsDir(this.sessionId), { recursive: true })
    const name = `shot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.png`
    fs.writeFileSync(path.join(shotsDir(this.sessionId), name), png)
    return name
  }

  /** 给定事件 id,修正(替换)audit.jsonl 中对应行 —— 用于 tool_call 从 pending 变更状态 */
  patch(eventId: string, fields: Partial<AuditEvent>): AuditEvent | null {
    const file = auditFile(this.sessionId)
    try {
      const lines = fs.readFileSync(file, 'utf-8').split('\n').filter((l) => l.trim())
      let patched: AuditEvent | null = null
      const next = lines.map((l) => {
        const e = JSON.parse(l) as AuditEvent
        if (e.id === eventId) {
          patched = { ...e, ...fields }
          return JSON.stringify(patched)
        }
        return l
      })
      if (patched) fs.writeFileSync(file, next.join('\n') + '\n', 'utf-8')
      return patched
    } catch {
      return null
    }
  }
}
