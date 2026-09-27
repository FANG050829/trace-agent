import fs from 'node:fs'
import path from 'node:path'
import type { AuditEvent, SessionMeta } from '@shared/types'

const MAX_TOTAL_IMAGE_BYTES = 24 * 1024 * 1024 // 截图内嵌总量上限,超出后剩余的用相对路径占位

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const TYPE_LABEL: Record<string, { icon: string; label: string; cls: string }> = {
  user_message: { icon: '🙋', label: '用户', cls: 'user' },
  assistant_message: { icon: '✦', label: '回复', cls: 'assistant' },
  tool_call: { icon: '🔧', label: '工具调用', cls: 'tool' },
  tool_result: { icon: '✅', label: '工具结果', cls: 'tool' },
  approval_request: { icon: '⏸', label: '请求确认', cls: 'approval' },
  approval_decision: { icon: '⚖️', label: '审批决定', cls: 'approval' },
  error: { icon: '❌', label: '错误', cls: 'error' },
  system: { icon: 'ℹ️', label: '系统', cls: 'system' }
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', { hour12: false })
}

/** 把一个会话渲染成自包含的 HTML 审计报告(截图以 base64 内嵌,单文件即可打开) */
export function buildReportHtml(meta: SessionMeta, events: AuditEvent[], shotsDirPath: string): string {
  let imageBudget = MAX_TOTAL_IMAGE_BYTES
  const rows = events
    .map((e) => {
      const t = TYPE_LABEL[e.type] ?? TYPE_LABEL.system
      const time = fmtTime(e.ts)
      const status = e.status ? `<span class="chip st-${esc(e.status)}">${esc(e.status)}</span>` : ''
      let shotHtml = ''
      if (e.shot) {
        const file = path.join(shotsDirPath, path.basename(e.shot))
        try {
          const buf = fs.readFileSync(file)
          if (buf.length <= imageBudget) {
            imageBudget -= buf.length
            shotHtml = `<img class="shot" src="data:image/png;base64,${buf.toString('base64')}" alt="截图">`
          } else {
            shotHtml = `<div class="shot-missing">截图 ${esc(e.shot)} 过大未内嵌,见会话目录 shots/ 下同名文件</div>`
          }
        } catch {
          shotHtml = `<div class="shot-missing">截图 ${esc(e.shot)} 文件缺失</div>`
        }
      }
      const detailHtml =
        e.detail !== undefined
          ? `<details><summary>详情</summary><pre>${esc(JSON.stringify(e.detail, null, 2).slice(0, 20000))}</pre></details>`
          : ''
      return `<div class="ev ${t.cls}">
  <div class="ev-head"><span class="ev-time">${time}</span><span class="ev-icon">${t.icon}</span><span class="ev-label">${t.label}</span>${status}</div>
  ${e.text ? `<div class="ev-text">${esc(e.text)}</div>` : ''}
  ${shotHtml}
  ${detailHtml}
</div>`
    })
    .join('\n')

  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1
    return acc
  }, {})
  const summary = [
    `对话 ${counts.user_message ?? 0} / 回复 ${counts.assistant_message ?? 0}`,
    `工具调用 ${counts.tool_call ?? 0}`,
    `审批 ${counts.approval_decision ?? 0}`,
    `错误 ${counts.error ?? 0}`
  ]
    .map((s) => `<span>${s}</span>`)
    .join('')

  const firstTs = events[0]?.ts ?? meta.createdAt
  const lastTs = events[events.length - 1]?.ts ?? meta.updatedAt

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>审计报告 · ${esc(meta.title)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif; background: #f4f6fa; color: #1c2433; padding: 32px 16px; }
  .wrap { max-width: 860px; margin: 0 auto; }
  header { background: #fff; border: 1px solid #e3e8f0; border-radius: 12px; padding: 22px 26px; margin-bottom: 18px; }
  h1 { font-size: 20px; margin-bottom: 8px; }
  .meta { color: #5a647d; font-size: 13px; line-height: 1.8; }
  .summary { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 10px; font-size: 12.5px; color: #3b4553; }
  .summary span { background: #eef2f9; border-radius: 14px; padding: 3px 12px; }
  .ev { background: #fff; border: 1px solid #e3e8f0; border-left: 3px solid #c6cfdd; border-radius: 10px; padding: 12px 16px; margin-bottom: 8px; }
  .ev.user { border-left-color: #2b6cb0; } .ev.assistant { border-left-color: #6b46c1; }
  .ev.tool { border-left-color: #2f855a; } .ev.approval { border-left-color: #b7791f; }
  .ev.error { border-left-color: #c53030; } .ev.system { border-left-color: #a0aec0; }
  .ev-head { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #5a647d; }
  .ev-time { font-family: Consolas, monospace; }
  .ev-label { font-weight: 600; color: #3b4553; }
  .ev-text { margin-top: 6px; font-size: 13.5px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; }
  .chip { font-size: 11px; border-radius: 10px; padding: 1px 8px; background: #eef2f9; }
  .chip.st-ok, .chip.st-approved { color: #227950; background: #e3f4ea; }
  .chip.st-error, .chip.st-denied { color: #b02a2a; background: #fbe5e5; }
  .chip.st-pending { color: #8a6116; background: #fdf3dd; }
  .shot { display: block; max-width: 100%; margin-top: 8px; border: 1px solid #e3e8f0; border-radius: 8px; }
  .shot-missing { margin-top: 8px; font-size: 12px; color: #8a6116; background: #fdf3dd; border-radius: 6px; padding: 6px 10px; }
  details { margin-top: 6px; font-size: 12px; }
  summary { cursor: pointer; color: #5a647d; }
  pre { margin-top: 6px; background: #f6f8fb; border: 1px solid #e3e8f0; border-radius: 8px; padding: 10px; font-family: Consolas, monospace; font-size: 11.5px; overflow: auto; max-height: 320px; white-space: pre-wrap; word-break: break-all; }
  footer { text-align: center; color: #8a93a5; font-size: 12px; margin-top: 20px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>📋 审计报告 · ${esc(meta.title)}</h1>
    <div class="meta">会话 ID:${esc(meta.id)}<br>时间范围:${fmtTime(firstTs)} — ${fmtTime(lastTs)} · 共 ${events.length} 条事件</div>
    <div class="summary">${summary}</div>
  </header>
  ${rows || '<div class="ev system"><div class="ev-text">该会话没有审计事件。</div></div>'}
  <footer>由 留痕 Agent 导出 · 本文件自包含,可直接归档或分享</footer>
</div>
</body>
</html>`
}
