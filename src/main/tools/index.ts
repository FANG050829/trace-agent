import type { AuditEvent, AuditEventType, RiskLevel } from '@shared/types'
import type { SessionAudit } from '../audit'
import type { AppSettings } from '@shared/types'

export interface ToolContext {
  sessionId: string
  audit: SessionAudit
  settings: AppSettings
  /** 用户取消任务时触发,长耗时工具(命令、浏览器)应尽快中止 */
  signal?: AbortSignal
}

export interface ToolResult {
  /** 放入 tool 消息、给模型看的文本 */
  textForModel: string
  /** 截图文件名(会话 shots/ 下),审计面板展示 */
  shotFile?: string
  /** 视觉回传用 dataURL */
  imageDataUrl?: string
  /** 审计面板展示的结构化信息 */
  detail?: unknown
}

export interface ToolImpl {
  name: string
  label: string
  descForModel: string
  parameters: Record<string, unknown>
  risk: (args: any) => RiskLevel
  approvalSummary: (args: any) => string
  run: (args: any, ctx: ToolContext) => Promise<ToolResult>
}

export type ToolCall = { id: string; name: string; args: string }

export const toolCallSchemaOf = (t: ToolImpl) => ({
  type: 'function' as const,
  function: { name: t.name, description: t.descForModel, parameters: t.parameters }
})

/** 依据工具固有风险等级与用户风险策略,得出本次调用是否需要确认 */
export function assessRisk(t: ToolImpl, args: any, policy: AppSettings['riskPolicy']): RiskLevel {
  const intrinsic = t.risk(args)
  if (intrinsic === 'safe') return 'safe'
  if (intrinsic === 'dangerous') return 'confirm' // 不可逆操作任何策略下都要确认
  // confirm 级:宽松策略自动放行,标准/严格需要确认
  return policy === 'relaxed' ? 'safe' : 'confirm'
}
