import fs from 'node:fs'
import path from 'node:path'
import type { AuditEvent, SessionMeta } from '@shared/types'

const MAX_TOTAL_IMAGE_BYTES = 24 * 1024 * 1024 // 截图内嵌总量上限,超出后剩余的用相对路径占位

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const TYPE_LABEL: Record<string, { color: string; label: string; cls: string }> = {
  user_message: { color: '#6c9ee6', label: '用户', cls: 'user' },
  assistant_message: { color: '#e8e9ec', label: '回复', cls: 'assistant' },
  tool_call: { color: '#5fb3a3', label: '工具调用', cls: 'tool' },
  tool_result: { color: '#5fb3a3', label: '工具结果', cls: 'tool' },
  approval_request: { color: '#d9a850', label: '请求确认', cls: 'approval' },
  approval_decision: { color: '#d9a850', label: '审批决定', cls: 'approval' },
  error: { color: '#e07a7a', label: '错误', cls: 'error' },
  system: { color: '#35383f', label: '系统', cls: 'system' }
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
            shotHtml = `<div class="shot-missing">截图 ${esc(e.shot)} 过大未内嵌，见会话目录 shots/ 下同名文件</div>`
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
  <div class="ev-head"><span class="ev-time">${time}</span><span class="ev-dot" style="background: ${t.color}"></span><span class="ev-label">${t.label}</span>${status}</div>
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

  // 与主界面同一血统:石墨色阶 + 类型色点 + 发丝线,不含第二种视觉语言
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="dark">
<title>审计报告 · ${esc(meta.title)}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif; background: #0d0e11; color: #e8e9ec; padding: 32px 16px; font-size: 13px; line-height: 1.6; }
  ::selection { background: rgba(108,158,230,.32); }
  .wrap { max-width: 860px; margin: 0 auto; }
  header { background: #141519; border: 1px solid #26282e; border-radius: 8px; padding: 20px 24px; margin-bottom: 14px; }
  h1 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .meta { color: #a6abb5; font-size: 12.5px; line-height: 1.8; }
  .meta .mono, .mono { font-family: 'Cascadia Code', Consolas, monospace; font-variant-numeric: tabular-nums; }
  .summary { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 10px; font-size: 12px; color: #a6abb5; }
  .summary span { border: 1px solid #26282e; border-radius: 4px; padding: 2px 10px; }
  .ev { background: #141519; border: 1px solid #26282e; border-radius: 6px; padding: 11px 14px; margin-bottom: 6px; }
  .ev-head { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: #7f8490; }
  .ev-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ev-time { font-family: 'Cascadia Code', Consolas, monospace; font-size: 10.5px; font-variant-numeric: tabular-nums; }
  .ev-label { font-weight: 600; color: #a6abb5; }
  .ev-text { margin-top: 6px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; color: #e8e9ec; }
  .chip { font-size: 11px; display: inline-flex; align-items: center; gap: 5px; color: #7f8490; }
  .chip::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .chip.st-ok, .chip.st-approved { color: #58b380; }
  .chip.st-error, .chip.st-denied { color: #e07a7a; }
  .chip.st-pending { color: #d9a850; }
  .shot { display: block; max-width: 100%; margin-top: 8px; border: 1px solid #26282e; border-radius: 6px; }
  .shot-missing { margin-top: 8px; font-size: 11.5px; color: #d9a850; border: 1px solid rgba(217,168,80,.3); border-radius: 4px; padding: 5px 10px; }
  details { margin-top: 6px; font-size: 11.5px; }
  summary { cursor: pointer; color: #7f8490; }
  summary:hover { color: #a6abb5; }
  pre { margin-top: 6px; background: #0a0b0d; border: 1px solid #26282e; border-radius: 5px; padding: 9px 10px; font-family: 'Cascadia Code', Consolas, monospace; font-size: 11px; color: #a6abb5; overflow: auto; max-height: 320px; white-space: pre-wrap; word-break: break-all; }
  footer { text-align: center; color: #7f8490; font-size: 11.5px; margin-top: 18px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>审计报告 · ${esc(meta.title)}</h1>
    <div class="meta">会话 ID：<span class="mono">${esc(meta.id)}</span><br>时间范围：<span class="mono">${fmtTime(firstTs)} — ${fmtTime(lastTs)}</span> · 共 ${events.length} 条事件</div>
    <div class="summary">${summary}</div>
  </header>
  ${rows || '<div class="ev system"><div class="ev-text">该会话没有审计事件。</div></div>'}
  <footer>由 留痕 Agent 导出 · 本文件自包含，可直接归档或分享</footer>
</div>
</body>
</html>`
}
