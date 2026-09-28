import path from 'node:path'

/**
 * 路径与会话 id 的安全边界(纯逻辑,无 Electron 依赖,可被测试直接编译运行)。
 *
 * 这里集中放置两类约束:
 *   1. 会话 id 必须是 UUID —— 所有会话目录都由 id 拼出,一旦允许 `../` 就能穿越出 sessions 目录
 *   2. 文件类工具受工作目录白名单约束 —— 之前 workspaceRoots 只被写进系统提示词,
 *      没有任何强制力,等同于把提示词当安全边界
 */

/** 会话 id 形态:randomUUID() 产出的标准 UUID(8-4-4-4-12) */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidSessionId(id: unknown): id is string {
  return typeof id === 'string' && UUID_RE.test(id)
}

/** 校验会话 id,不合法直接抛错(IPC 入口用它把住第一道门) */
export function assertSessionId(id: unknown): string {
  if (!isValidSessionId(id)) throw new Error(`非法的会话 ID:${String(id).slice(0, 64)}`)
  return id
}

function norm(p: string): string {
  return path.resolve(p).toLowerCase().replace(/[\\/]+$/, '')
}

/** p 是否等于 root 或位于 root 之下 */
export function isInside(root: string, p: string): boolean {
  const r = norm(root)
  const n = norm(p)
  return n === r || n.startsWith(r + path.sep)
}

/** p 是否是 root 的后代(不含 root 本身)—— 用于"不允许直接操作白名单根目录" */
export function isStrictlyInside(root: string, p: string): boolean {
  return isInside(root, p) && norm(root) !== norm(p)
}

/**
 * 解析并校验一个路径是否落在允许的工作目录内,返回规范化后的绝对路径。
 * 白名单为空时不加限制(用户尚未配置工作目录;此时仍按各工具自身的风险等级逐步确认)。
 */
export function resolveInWorkspace(target: string, roots: string[]): string {
  const abs = path.resolve(String(target ?? ''))
  const list = (roots ?? []).filter(Boolean).map(norm)
  if (!list.length) return abs
  if (list.some((r) => isInside(r, abs))) return abs
  const preview = list.slice(0, 3).join('、')
  throw new Error(
    `路径不在允许的工作目录内,已拒绝访问。\n目标:${abs}\n允许的目录:${preview}${list.length > 3 ? ' 等' : ''}\n` +
      '如需操作其他位置,请到「设置 → 安全与审计 → 允许的工作目录」里添加。'
  )
}

/**
 * 应用数据目录(含 settings.json 里的加密密钥、全部会话的审计与截图)。
 * 文件类工具一律不得读写这里面的任何内容 —— 否则 Agent 可以改写自己的留痕、读走密钥。
 */
export function assertNotProtected(target: string, dataDir: string): string {
  const abs = path.resolve(String(target ?? ''))
  if (isInside(dataDir, abs)) {
    throw new Error(
      `已拒绝访问应用数据目录:${abs}\n这里是留痕 Agent 自己的审计记录、会话数据与配置(含加密后的密钥),` +
        'Agent 的文件工具不能读写这些内容,否则「全程留痕」就不成立了。'
    )
  }
  return abs
}

/** 工作目录白名单解析 + 数据目录保护,文件类工具的统一入口 */
export function guardUserPath(target: string, roots: string[], dataDir: string): string {
  return assertNotProtected(resolveInWorkspace(target, roots), dataDir)
}
