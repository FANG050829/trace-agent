import { Notification } from 'electron'
import { randomUUID } from 'node:crypto'
import type { Skill } from '@shared/types'
import { AgentRunner } from './agent/loop'
import { listSkills, loadSettings, upsertSession, upsertSkill } from './store'

/**
 * 技能定时执行:每 30 秒检查一次到期的技能,到期后在全新会话里自动运行。
 * 调度状态(nextRun)持久化在技能条目里;应用常驻(或最小化到托盘)时生效。
 */

const CHECK_INTERVAL_MS = 30_000
let timer: NodeJS.Timeout | null = null
const running = new Set<string>()

export function nextRunFor(sk: Skill, from = Date.now()): number | null {
  const s = sk.schedule
  if (!s?.enabled) return null
  if (s.kind === 'interval') {
    const min = Math.max(1, Number(s.intervalMin) || 30)
    return from + min * 60_000
  }
  if (s.kind === 'daily') {
    const [hh, mm] = String(s.time ?? '09:00').split(':').map((n) => Number(n) || 0)
    const next = new Date(from)
    next.setHours(hh, mm, 0, 0)
    if (next.getTime() <= from) next.setDate(next.getDate() + 1)
    return next.getTime()
  }
  if (s.kind === 'once') return s.nextRun && s.nextRun > from ? s.nextRun : from
  return null
}

function due(sk: Skill, now: number): boolean {
  const s = sk.schedule
  if (!s?.enabled || running.has(sk.id)) return false
  if (s.nextRun && s.nextRun > now) return false
  // daily 模式没有 nextRun 时,落在今天的时间点即触发
  if (s.kind === 'daily' && !s.nextRun) {
    const [hh, mm] = String(s.time ?? '09:00').split(':').map((n) => Number(n) || 0)
    const today = new Date(now)
    today.setHours(hh, mm, 0, 0)
    return now >= today.getTime()
  }
  return true
}

export function startScheduler(): void {
  if (timer) return
  timer = setInterval(() => void tick(), CHECK_INTERVAL_MS)
  void tick()
}

export async function tick(): Promise<void> {
  const now = Date.now()
  const skills = listSkills()
  for (const sk of skills) {
    if (!due(sk, now)) continue
    running.add(sk.id)
    try {
      runSkillNow(sk)
      const next = nextRunFor(sk, now)
      // once 模式跑完即停;其余写回下次运行时间
      upsertSkill({
        id: sk.id,
        name: sk.name,
        prompt: sk.prompt,
        schedule: sk.schedule!.kind === 'once' ? { ...sk.schedule!, enabled: false, nextRun: null as unknown as number } : { ...sk.schedule!, nextRun: next ?? undefined }
      })
    } finally {
      running.delete(sk.id)
    }
  }
}

/** 立即在全新会话里运行一个技能(供调度器与托盘菜单使用) */
export function runSkillNow(sk: Skill): void {
  const meta = { id: randomUUID(), title: `定时 · ${sk.name}`.slice(0, 40), createdAt: Date.now(), updatedAt: Date.now() }
  upsertSession(meta)
  void AgentRunner.get(meta.id).send(sk.prompt, loadSettings())
  try {
    new Notification({
      title: '留痕 Agent · 定时技能',
      body: `「${sk.name}」已开始执行,可在会话列表查看进度。`
    }).show()
  } catch {
    /* 通知失败不影响执行 */
  }
}
