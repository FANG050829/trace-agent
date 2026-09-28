// 共享类型:主进程 / preload / 渲染端共用

// ---------- LLM 消息 ----------
export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

export interface ToolCallOut {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | ContentPart[]
  tool_call_id?: string
  tool_calls?: ToolCallOut[]
}

export interface ToolSchema {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

// ---------- 审计事件 ----------
export type AuditEventType =
  | 'user_message'
  | 'assistant_message'
  | 'tool_call'
  | 'tool_result'
  | 'approval_request'
  | 'approval_decision'
  | 'error'
  | 'system'

export interface AuditEvent {
  id: string
  ts: number
  type: AuditEventType
  text?: string
  detail?: unknown
  shot?: string // 截图文件名(位于会话 shots/ 目录)
  toolName?: string
  status?: 'ok' | 'error' | 'pending' | 'denied' | 'approved'
  refId?: string // tool_result 关联其 tool_call
}

// ---------- 会话 ----------
export interface SessionMeta {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}

// ---------- 技能(沉淀下来的可复用任务) ----------
export type ScheduleKind = 'daily' | 'interval' | 'once'

export interface SkillSchedule {
  kind: ScheduleKind
  time?: string // daily:HH:mm
  intervalMin?: number // interval:每 N 分钟
  enabled?: boolean
  nextRun?: number
}

export interface Skill {
  id: string
  name: string
  prompt: string
  schedule?: SkillSchedule
  createdAt: number
  updatedAt: number
}

// ---------- 风险与设置 ----------
export type RiskLevel = 'safe' | 'confirm' | 'dangerous'
export type RiskPolicy = 'relaxed' | 'standard' | 'strict'

export interface ProviderConfig {
  id: string
  name: string
  baseUrl: string
  apiKey: string
  model: string
  vision: boolean
}

export interface OllamaConfig {
  baseUrl: string
  model: string
  vision: boolean
}

export interface LanApprovalConfig {
  enabled: boolean
  port: number
  token: string
}

export interface AppSettings {
  providers: ProviderConfig[]
  activeProviderId: string | null // provider.id 或 'ollama'
  ollama: OllamaConfig
  riskPolicy: RiskPolicy
  workspaceRoots: string[]
  screenshotToVision: boolean
  maxSteps: number
  temperature: number
  maxContextChars: number // 发给模型的上下文字符预算(超出自动压缩历史)
  background: {
    closeToTray: boolean // 关闭窗口时最小化到托盘,定时任务继续执行
  }
  lanApproval: LanApprovalConfig
}

export interface AppInfo {
  version: string
  isPackaged: boolean
  dataDir: string
  dataRoot: string
  lanUrl: string | null // 局域网审批页地址(启用时)
  lanIps: string[]
}

// ---------- 模板 ----------
export interface TemplateParam {
  key: string
  label: string
  placeholder?: string
  required?: boolean
  type?: 'text' | 'dir' | 'file' | 'url'
}

export interface TemplateInfo {
  id: string
  name: string
  desc: string
  category: string
  badge?: string
  experimental?: boolean
  params: TemplateParam[]
}

// ---------- IPC ----------
export interface ApprovalRequest {
  sessionId: string
  approvalId: string
  toolName: string
  toolLabel: string
  summary: string
  argsText: string
  risk: RiskLevel
}

export interface AgentEventPush {
  sessionId: string
  event: AuditEvent
}

export interface AgentDeltaPush {
  sessionId: string
  kind: 'text' | 'tool' | 'reasoning'
  text: string
}

export interface AgentStatePush {
  sessionId: string
  running: boolean
  pendingApproval: ApprovalRequest | null
}

export interface OpenSessionResult {
  meta: SessionMeta
  messages: ChatMessage[]
  audit: AuditEvent[]
}

export interface ExportResult {
  ok: boolean
  message: string
}

export interface TestProviderResult {
  ok: boolean
  message: string
  models: string[] // 测试成功时顺带返回可用模型列表,供下拉选择
}

export interface TraceApi {
  // 会话
  listSessions(): Promise<SessionMeta[]>
  createSession(title?: string): Promise<SessionMeta>
  deleteSession(id: string): Promise<void>
  openSession(id: string): Promise<OpenSessionResult>
  renameSession(id: string, title: string): Promise<void>
  // agent
  send(sessionId: string, text: string): Promise<void>
  cancel(sessionId: string): Promise<void>
  respondApproval(sessionId: string, approvalId: string, approved: boolean): Promise<void>
  // 模板
  listTemplates(): Promise<TemplateInfo[]>
  instantiateTemplate(id: string, params: Record<string, string>): Promise<{ prompt: string }>
  // 技能
  listSkills(): Promise<Skill[]>
  saveSkill(s: { id?: string; name: string; prompt: string; schedule?: SkillSchedule }): Promise<Skill>
  deleteSkill(id: string): Promise<void>
  // 设置
  getSettings(): Promise<AppSettings>
  saveSettings(s: AppSettings): Promise<AppSettings>
  testProvider(p: ProviderConfig): Promise<TestProviderResult>
  listOllamaModels(baseUrl: string): Promise<{ ok: boolean; models: string[]; message: string }>
  // 文件与导出
  pickDirectory(): Promise<string | null>
  pickFile(): Promise<string | null>
  exportSession(id: string): Promise<ExportResult>
  openExternal(url: string): Promise<void>
  openDataDir(): Promise<void>
  getAppInfo(): Promise<AppInfo>
  setDataDir(dir: string): Promise<void>
  // 事件订阅(返回取消函数)
  onAgentEvent(cb: (p: AgentEventPush) => void): () => void
  onAgentDelta(cb: (p: AgentDeltaPush) => void): () => void
  onAgentState(cb: (p: AgentStatePush) => void): () => void
  onSessionTitle(cb: (p: { sessionId: string; title: string }) => void): () => void
}
