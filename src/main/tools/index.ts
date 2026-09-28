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

/**
 * 依据工具固有风险等级与用户风险策略,得出本次调用是否需要确认。
 *
 * dangerous 会被原样返回(此前被降级成 confirm,导致 RiskLevel 的这个取值成了死值,
 * 局域网审批页的"不可逆操作"红色标记永远不会出现)。确认行为不受影响:
 * 下方 loop.ts 对 dangerous 与 confirm 一视同仁地要求用户确认,
 * 但 UI 能如实告诉用户这一步有多不可逆。
 *
 * relaxed 策略现在只对只读类 confirm 工具自动放行,不再放行任何写操作:
 * 之前 run_command 一旦绕过黑名单,在宽松模式下会静默执行,用户完全不知情。
 */
export function assessRisk(t: ToolImpl, args: any, policy: AppSettings['riskPolicy']): RiskLevel {
  const intrinsic = t.risk(args)
  if (intrinsic === 'safe') return 'safe'
  if (intrinsic === 'dangerous') return 'dangerous'
  // 命令执行永远不自动放行:它是唯一能绕过文件守卫的通道,正则黑名单也拦不干净,
  // 因此无论风险策略如何,都要求用户逐条确认。
  if (t.name === 'run_command') return 'confirm'
  // confirm 级:宽松策略对「只读」工具自动放行(它们的定义就是不改变系统状态)
  return policy === 'relaxed' && READ_ONLY_TOOLS.has(t.name) ? 'safe' : 'confirm'
}

/** 宽松策略下可免确认的工具:全部为只读,不改变系统状态 */
const READ_ONLY_TOOLS = new Set(['fs_list_dir', 'fs_read_file', 'fs_search', 'window_list', 'input_screen_size', 'screenshot'])
