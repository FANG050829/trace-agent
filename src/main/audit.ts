import fs from 'node:fs'
import path from 'node:path'
import { auditFile, shotsDir } from './store'
import { AUDIT_GENESIS, serializeAuditLine, verifyAuditChain, type ChainCheck } from './audit-chain'
import type { AuditEvent, AuditEventType } from '@shared/types'

/**
 * 每个会话一个审计记录器:所有事件以"只追加"方式写入 audit.jsonl,永不删除、永不重写。
 *
 * 工具调用的状态变化不再回头改写 tool_call 那一行,而是追加一条带 refId 的 tool_result,
 * 由它在读取时归一出最终状态(见 shared/audit.ts 的 normalizeAudit)。
 * 完整性由哈希链保证,任何一条记录被改写或删除都会在 verify 时暴露。
 */
export class SessionAudit {
  private prevHash: string

  constructor(public sessionId: string) {
    fs.mkdirSync(shotsDir(sessionId), { recursive: true })
    this.prevHash = this.readTailHash()
  }

  /** 取链尾哈希,让续写的会话接上已有日志 */
  private readTailHash(): string {
    try {
      const lines = fs.readFileSync(auditFile(this.sessionId), 'utf-8').split('\n')
      for (let i = lines.length - 1; i >= 0; i--) {
        if (!lines[i].trim()) continue
        try {
          const o = JSON.parse(lines[i]) as { h?: unknown }
          if (typeof o.h === 'string') return o.h
        } catch {
          /* 坏行继续往前找 */
        }
      }
    } catch {
      /* 日志不存在,新链从起点开始 */
    }
    return AUDIT_GENESIS
  }

  /**
   * 追加一行,并把本行接入哈希链。
   *
   * 防篡改不靠「置只读」:Windows 上 chmod 0o444 会设置只读属性,之后任何写入者
   * (包括应用自己)的 appendFileSync 都会 EPERM,留痕会直接停摆。
   * 改为两层都不依赖文件属性的方案:
   *   1. 文件工具的路径守卫挡住 Agent 读写本文件(见 guards.ts,已有测试覆盖)
   *   2. 哈希链让任何绕过守卫的改写都能被 verifyAuditChain 检出
   * 可检测性比不可逆的写入失败更符合「可审计」的承诺。
   */
  private writeLine(event: AuditEvent): void {
    const line = serializeAuditLine(event, this.prevHash)
    const file = auditFile(this.sessionId)
    try {
      fs.appendFileSync(file, line + '\n', 'utf-8')
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'EPERM' && (e as NodeJS.ErrnoException).code !== 'EACCES') throw e
      // 上一进程被杀时可能残留只读属性,清掉后重试一次;再失败就让它抛出,
      // 不能静默吞掉 —— 留痕写不进去必须是可见的故障。
      try {
        fs.chmodSync(file, 0o666)
        fs.appendFileSync(file, line + '\n', 'utf-8')
      } catch (e2) {
        throw new Error(`审计日志写入失败：${(e2 as Error).message}（${file}）`)
      }
    }
    this.prevHash = (JSON.parse(line) as { h: string }).h
  }

  append(type: AuditEventType, fields: Partial<AuditEvent> = {}): AuditEvent {
    const event: AuditEvent = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      type,
      ...fields
    }
    this.writeLine(event)
    return event
  }

  /** 保存截图到会话目录,返回文件名 */
  saveShot(png: Buffer): string {
    fs.mkdirSync(shotsDir(this.sessionId), { recursive: true })
    const name = `shot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.png`
    fs.writeFileSync(path.join(shotsDir(this.sessionId), name), png)
    return name
  }

  /** 校验本会话的审计链完整性 */
  verify(): ChainCheck {
    try {
      const raw = fs.readFileSync(auditFile(this.sessionId), 'utf-8')
      return verifyAuditChain(raw.split('\n'))
    } catch {
      return { ok: true, total: 0, brokenAt: -1, reason: '尚无审计记录' }
    }
  }
}
