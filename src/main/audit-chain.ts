import { createHash } from 'node:crypto'
import type { AuditEvent } from '@shared/types'

/**
 * 审计链的哈希实现(仅主进程;依赖 node:crypto,不能进渲染端)。
 *
 * 留痕 Agent 的核心承诺是"每一步操作都被完整记录、可审计"。要让这句话站得住,
 * 记录本身必须只追加、不覆盖、可验证。这里给每行事件串一条哈希链(与比特币同构):
 * 任何一条被改写、删除或乱序,后续校验都会立刻失败。
 */
export const AUDIT_GENESIS = '0'.repeat(64)

/** 一行的哈希 = 前一行哈希 + 本行事件的规范化 JSON */
export function auditHash(prevHash: string, event: AuditEvent): string {
  return createHash('sha256').update(prevHash).update(JSON.stringify(event), 'utf8').digest('hex')
}

/** 序列化成一行落盘(事件 + 自身哈希) */
export function serializeAuditLine(event: AuditEvent, prevHash: string): string {
  return JSON.stringify({ ...event, h: auditHash(prevHash, event) })
}

export interface ChainCheck {
  ok: boolean
  total: number
  /** 首次发现异常的行号(1 起);无异常为 -1 */
  brokenAt: number
  reason: string
}

/**
 * 校验整条链:逐行重算哈希。
 * 无哈希的旧日志(升级前写入的)只做结构检查,不报链断裂。
 */
export function verifyAuditChain(lines: string[]): ChainCheck {
  let prev = AUDIT_GENESIS
  let total = 0
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim()
    if (!raw) continue
    total++
    let event: AuditEvent
    let stored: string
    try {
      const { h, ...rest } = JSON.parse(raw) as AuditEvent & { h?: string }
      event = rest
      if (typeof h !== 'string') continue // 旧日志:无链可验
      stored = h
    } catch {
      return { ok: false, total, brokenAt: i + 1, reason: '这一行不是合法的 JSON，文件可能被截断或改写' }
    }
    if (auditHash(prev, event) !== stored) {
      return { ok: false, total, brokenAt: i + 1, reason: '该行内容与哈希不符，记录疑似被改写或删除' }
    }
    prev = stored
  }
  return { ok: true, total, brokenAt: -1, reason: '链完整' }
}
