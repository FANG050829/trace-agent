import http from 'node:http'
import os from 'node:os'
import { randomBytes } from 'node:crypto'
import type { ApprovalRequest } from '@shared/types'
import { AgentRunner } from './agent/loop'
import { loadSettings, saveSettings } from './store'

/**
 * 局域网多人审批:在本机 0.0.0.0 上开一个只读审批页,
 * 同一局域网的手机/平板打开带令牌的地址,即可批准/拒绝高风险操作。
 * 令牌必须匹配;仅建议在可信局域网使用。
 */

let server: http.Server | null = null

/**
 * 登录失败的限流:令牌走明文 HTTP,同网段可被抓包,没有失败锁定就等于可以无限试。
 * 成功一次即清零,避免正常用户被自己的误操作锁住。
 */
const attempts = new Map<string, { fails: number; firstAt: number }>()
const RATE_WINDOW_MS = 10 * 60_000
const RATE_MAX_FAILS = 12

function clientKey(req: http.IncomingMessage): string {
  return req.socket.remoteAddress ?? 'unknown'
}

function isRateLimited(key: string): boolean {
  const rec = attempts.get(key)
  if (!rec) return false
  if (Date.now() - rec.firstAt > RATE_WINDOW_MS) {
    attempts.delete(key)
    return false
  }
  return rec.fails >= RATE_MAX_FAILS
}

function noteFailure(key: string): void {
  const rec = attempts.get(key)
  if (!rec || Date.now() - rec.firstAt > RATE_WINDOW_MS) {
    attempts.set(key, { fails: 1, firstAt: Date.now() })
    return
  }
  rec.fails++
}

function noteSuccess(key: string): void {
  attempts.delete(key)
}

function parseCookies(header?: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of (header ?? '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

function errorPage(msg: string): string {
  const safe = esc(msg)
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><body style="background:#0d0e11;color:#e07a7a;font-family:sans-serif;text-align:center;padding:60px">${safe}</body>`
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function lanToken(): string {
  const s = loadSettings()
  // 旧版只用了 8 字节(64 位);升级到 16 字节并保留已有令牌,避免正在用的手机链接突然失效
  if (s.lanApproval.token && s.lanApproval.token.length >= 32) return s.lanApproval.token
  const token = randomBytes(16).toString('hex')
  saveSettings({ ...s, lanApproval: { ...s.lanApproval, token } })
  return token
}

export function lanAddresses(port: number): { ip: string; url: string }[] {
  const token = lanToken()
  const out: { ip: string; url: string }[] = []
  const nets = os.networkInterfaces()
  for (const list of Object.values(nets)) {
    for (const net of list ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        out.push({ ip: net.address, url: `http://${net.address}:${port}/?t=${token}` })
      }
    }
  }
  return out
}

export function primaryLanUrl(port: number): string | null {
  return lanAddresses(port)[0]?.url ?? null
}

function pendingList(): { sessionId: string; req: ApprovalRequest }[] {
  return AgentRunner.getAllPending()
}

function page(token: string, nonce: string): string {
  const list = pendingList()
  const rows =
    list.length === 0
      ? '<div class="empty">当前没有等待确认的操作。</div>'
      : list
          .map(
            (it) => `<div class="card">
  <div class="head"><span class="label">${esc(it.req.toolLabel)}</span><span class="chip ${it.req.risk === 'dangerous' ? 'danger' : 'warn'}">${it.req.risk === 'dangerous' ? '不可逆操作' : '敏感操作'}</span></div>
  <div class="summary">${esc(it.req.summary)}</div>
  <pre>${esc(it.req.argsText)}</pre>
  <div class="actions">
    <form method="post" action="/respond"><input type="hidden" name="t" value="${esc(token)}"><input type="hidden" name="n" value="${esc(nonce)}"><input type="hidden" name="sessionId" value="${esc(it.sessionId)}"><input type="hidden" name="approvalId" value="${esc(it.req.approvalId)}"><input type="hidden" name="approved" value="1"><button class="ok" type="submit">批准执行</button></form>
    <form method="post" action="/respond"><input type="hidden" name="t" value="${esc(token)}"><input type="hidden" name="n" value="${esc(nonce)}"><input type="hidden" name="sessionId" value="${esc(it.sessionId)}"><input type="hidden" name="approvalId" value="${esc(it.req.approvalId)}"><input type="hidden" name="approved" value="0"><button class="deny" type="submit">拒绝</button></form>
  </div>
  <div class="meta">来自会话 ${esc(it.sessionId.slice(0, 8))}…</div>
</div>`
          )
          .join('')
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>留痕 Agent · 远程审批</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif; background: #0d0e11; color: #e8e9ec; padding: 20px 14px 40px; font-size: 14px; line-height: 1.65; }
  .wrap { max-width: 560px; margin: 0 auto; }
  h1 { font-size: 17px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
  .card { background: #141519; border: 1px solid #26282e; border-radius: 8px; padding: 14px 16px; margin-bottom: 10px; }
  .head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .label { font-weight: 600; font-size: 14.5px; }
  .chip { font-size: 11px; display: inline-flex; align-items: center; gap: 5px; }
  .chip::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .chip.warn { color: #d9a850; } .chip.danger { color: #e07a7a; }
  .summary { margin: 8px 0; font-weight: 600; word-break: break-all; }
  pre { background: #0a0b0d; border: 1px solid #26282e; border-radius: 5px; padding: 8px 10px; font-family: Consolas, monospace; font-size: 11.5px; color: #a6abb5; max-height: 180px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
  .actions { display: flex; gap: 10px; margin-top: 12px; }
  form { flex: 1; }
  button { width: 100%; padding: 10px 0; font-size: 14px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
  button.ok { background: #e8e9ec; color: #101114; }
  button.deny { background: transparent; color: #e07a7a; border: 1px solid rgba(224,122,122,.5); }
  .meta { margin-top: 8px; font-size: 11.5px; color: #7f8490; font-family: Consolas, monospace; }
  .empty { text-align: center; color: #7f8490; padding: 60px 0; }
  .ok-msg { text-align: center; padding: 40px 0; }
  .ok-msg b { color: #58b380; }
</style>
</head>
<body>
<div class="wrap">
  <h1>⌁ 留痕 Agent · 远程审批</h1>
  ${rows}
  <p style="color:#7f8490;font-size:11.5px;margin-top:14px">页面即拉即显,批准/拒绝后请刷新查看最新列表。仅限可信局域网使用。</p>
</div>
</body>
</html>`
}

export function startLanApproval(): void {
  if (server) return
  const port = loadSettings().lanApproval.port || 8765
  server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`)
    const settings = loadSettings()
    if (!settings.lanApproval.enabled) {
      res.writeHead(404).end()
      return
    }
    // 审批页不缓存:否则设备在批准/拒绝后仍会看到旧列表,甚至重放一次已完成的表单
    const baseHeaders = { 'cache-control': 'no-store, no-cache, must-revalidate', 'x-content-type-options': 'nosniff' }
    const client = clientKey(req)
    if (isRateLimited(client)) {
      res
        .writeHead(429, { ...baseHeaders, 'content-type': 'text/html; charset=utf-8', 'retry-after': '60' })
        .end(errorPage('尝试次数过多,请稍后再试。'))
      return
    }
    const token = settings.lanApproval.token
    const reply = (code: number, body: string, extra: Record<string, string | number> = {}): void => {
      res.writeHead(code, { ...baseHeaders, 'content-type': 'text/html; charset=utf-8', ...extra }).end(body)
    }
    if (url.pathname === '/respond' && req.method === 'POST') {
      // 限制请求体大小,避免被撑爆内存
      let body = ''
      let tooLarge = false
      req.on('data', (c) => {
        body += c
        if (body.length > 64 * 1024) {
          tooLarge = true
          req.destroy()
        }
      })
      req.on('end', () => {
        if (tooLarge) return
        const form = new URLSearchParams(body)
        if (form.get('t') !== token) {
          noteFailure(client)
          return reply(403, errorPage('令牌不正确,拒绝访问。'))
        }
        // CSRF 防护:表单里的 nonce 必须与本次会话 cookie 一致。
        // 单纯校验 URL 上的令牌挡不住"诱导已打开页面的浏览器自动提交表单"。
        const cookies = parseCookies(req.headers.cookie)
        if (form.get('n') !== cookies['trace_lan']) {
          noteFailure(client)
          return reply(403, errorPage('请求来源校验失败(CSRF),请重新打开审批页再操作。'))
        }
        const sessionId = form.get('sessionId') ?? ''
        const approvalId = form.get('approvalId') ?? ''
        const approved = form.get('approved') === '1'
        let ok = false
        try {
          ok = AgentRunner.get(sessionId).respond(approvalId, approved, 'lan')
        } catch {
          ok = false // 非法会话 id
        }
        const respBody = `<meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><body style="background:#0d0e11;color:#e8e9ec;font-family:sans-serif;text-align:center;padding:80px 20px"><div class="ok-msg"><b style="font-size:20px">${ok ? (approved ? '已批准' : '已拒绝') : '未找到该待确认操作(可能已被处理)'}</b><p style="color:#7f8490;margin-top:10px">3 秒后返回列表…</p></div></body>`
        reply(200, respBody, { refresh: `3; url=/?t=${encodeURIComponent(token)}` })
      })
      return
    }
    if (url.searchParams.get('t') !== token) {
      noteFailure(client)
      return reply(403, errorPage('令牌不正确,拒绝访问。'))
    }
    noteSuccess(client)
    // 每个访问者一个 CSRF nonce,写进 HttpOnly cookie(明文 HTTP 下无法用 Secure 标记)
    const nonce = randomBytes(16).toString('hex')
    reply(200, page(token, nonce), { 'set-cookie': `trace_lan=${nonce}; Path=/; HttpOnly; SameSite=Strict` })
  })
  server.on('error', () => {
    /* 端口被占等错误:关闭状态,设置页会看到未生效 */
    server = null
  })
  server.listen(port, '0.0.0.0')
}

export function stopLanApproval(): void {
  try {
    server?.close()
  } catch {
    /* ignore */
  }
  server = null
}

export function syncLanApproval(): void {
  const enabled = loadSettings().lanApproval.enabled
  if (enabled && !server) startLanApproval()
  if (!enabled && server) stopLanApproval()
}
