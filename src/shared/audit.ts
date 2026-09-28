import type { AuditEvent } from './types'

/**
 * 审计事件的浏览器侧共用逻辑。
 *
 * 只放不依赖 Node 的纯函数:渲染端要归一工具调用状态,主进程读历史记录时也要,
 * 两边必须得到同一份结果。哈希链部分依赖 node:crypto,放在 main/audit-chain.ts。
 *
 * 为什么需要归一:审计日志只追加、不重写。工具调用开始时记一条 tool_call(pending),
 * 结束后追加一条带 refId 的 tool_result,最终状态由这里推导出来。
 * 这样"只追加"与"时间线上不出现永远 pending 的工具"两件事才能同时成立。
 */
export function normalizeAudit(events: AuditEvent[]): AuditEvent[] {
  const finalStatus = new Map<string, NonNullable<AuditEvent['status']>>()
  for (const e of events) {
    if (e.type === 'tool_result' && e.refId && e.status) finalStatus.set(e.refId, e.status)
  }
  if (!finalStatus.size) return events
  return events.map((e) =>
    e.type === 'tool_call' && e.refId === undefined && finalStatus.has(e.id)
      ? { ...e, status: finalStatus.get(e.id) }
      : e
  )
}
