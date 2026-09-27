import { protocol } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { sessionsDir } from './config'

/** trace://shots/<sessionId>/<file> → 会话截图目录,渲染端用它显示截图 */
export function registerProtocol(): void {
  protocol.handle('trace', (request) => {
    try {
      const url = new URL(request.url)
      if (url.hostname === 'shots') {
        const [, sessionId, file] = url.pathname.split('/')
        if (!sessionId || !file) return new Response('not found', { status: 404 })
        const p = path.join(sessionsDir, path.basename(sessionId), 'shots', path.basename(file))
        if (!fs.existsSync(p)) return new Response('not found', { status: 404 })
        return new Response(fs.readFileSync(p), { headers: { 'content-type': 'image/png' } })
      }
      return new Response('not found', { status: 404 })
    } catch {
      return new Response('error', { status: 500 })
    }
  })
}
