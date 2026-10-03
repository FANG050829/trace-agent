import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import { AgentRunner, resolveLLM } from './agent/loop'
import { completionsUrl } from './agent/llm'
import { buildReportHtml } from './exportReport'
import { dataDir, dataDirMarker, dataRoot, sessionsDir } from './config'
import { primaryLanUrl, syncLanApproval, lanAddresses } from './lan'
import { assertSessionId } from './guards'
import { TEMPLATE_INFOS, instantiateTemplate } from './templates/builtin'
import {
  listSessions,
  listSkills,
  loadAudit,
  loadSettings,
  loadTranscript,
  removeSession,
  removeSkill,
  renameSession,
  saveSettings,
  saveSessionIndex,
  shotsDir,
  upsertSession,
  upsertSkill
} from './store'
import type {
  AgentDeltaPush,
  AgentEventPush,
  AgentStatePush,
  AppInfo,
  AuditEvent,
  ExportResult,
  ProviderConfig,
  SessionMeta,
  SkillSchedule
} from '@shared/types'

function win(): BrowserWindow | null {
  return BrowserWindow.getAllWindows()[0] ?? null
}

/** 待审批状态切换时闪烁任务栏图标,窗口在后台也能被注意到 */
let lastFlashing = false
function updateFlash(pending: boolean): void {
  if (pending === lastFlashing) return
  lastFlashing = pending
  const w = win()
  if (!w) return
  try {
    w.flashFrame(pending)
  } catch {
    /* ignore */
  }
}

export function registerIpc(): void {
  AgentRunner.hooks = {
    emitEvent: (sessionId, event: AuditEvent) => win()?.webContents.send('agent:event', { sessionId, event } satisfies AgentEventPush),
    emitDelta: (sessionId, kind, text) => win()?.webContents.send('agent:delta', { sessionId, kind, text } satisfies AgentDeltaPush),
    emitState: (sessionId, running, pendingApproval) => {
      win()?.webContents.send('agent:state', { sessionId, running, pendingApproval } satisfies AgentStatePush)
      updateFlash(!!pendingApproval)
    },
    emitTitle: (sessionId, title) => win()?.webContents.send('session:title', { sessionId, title })
  }

  // ---- 会话 ----
  ipcMain.handle('sessions:list', () => listSessions())

  ipcMain.handle('sessions:create', (_e, title?: string) => {
    const meta: SessionMeta = { id: randomUUID(), title: title || '新会话', createdAt: Date.now(), updatedAt: Date.now() }
    upsertSession(meta)
    return meta
  })

  ipcMain.handle('sessions:delete', (_e, id: string) => {
    removeSession(id) // 内部已校验 id 为 UUID
  })

  ipcMain.handle('sessions:open', (_e, id: string) => {
    assertSessionId(id)
    const meta = listSessions().find((m) => m.id === id) ?? { id, title: '会话', createdAt: 0, updatedAt: 0 }
    return { meta, messages: loadTranscript(id), audit: loadAudit(id) }
  })

  ipcMain.handle('sessions:rename', (_e, id: string, title: string) => {
    renameSession(id, String(title ?? '').trim())
  })

  // ---- agent ----
  ipcMain.handle('agent:send', (_e, sessionId: string, text: string) => {
    void AgentRunner.get(sessionId).send(text, loadSettings())
  })

  ipcMain.handle('agent:cancel', (_e, sessionId: string) => {
    AgentRunner.get(sessionId).cancel()
  })

  ipcMain.handle('agent:respond', (_e, sessionId: string, approvalId: string, approved: boolean) => {
    AgentRunner.get(sessionId).respond(approvalId, approved)
  })

  // ---- 模板 ----
  ipcMain.handle('templates:list', () => TEMPLATE_INFOS)
  ipcMain.handle('templates:instantiate', (_e, id: string, params: Record<string, string>) => instantiateTemplate(id, params))

  // ---- 技能 ----
  ipcMain.handle('skills:list', () => listSkills())
  ipcMain.handle('skills:save', (_e, s: { id?: string; name: string; prompt: string; schedule?: unknown }) => {
    const name = String(s.name ?? '').trim()
    const prompt = String(s.prompt ?? '').trim()
    if (!name) throw new Error('请给技能起个名字')
    if (!prompt) throw new Error('技能内容（提示词）不能为空')
    const schedule = (s.schedule ?? undefined) as SkillSchedule | undefined
    return upsertSkill({ id: s.id, name, prompt, schedule })
  })
  ipcMain.handle('skills:delete', (_e, id: string) => {
    removeSkill(id)
  })

  // ---- 设置 ----
  ipcMain.handle('settings:get', () => loadSettings())
  ipcMain.handle('settings:save', (_e, s) => {
    const saved = saveSettings(s)
    syncLanApproval() // 局域网审批开关/端口变化即时生效
    return saved
  })

  ipcMain.handle('settings:testProvider', async (_e, p: ProviderConfig) => {
    if (!p.baseUrl) return { ok: false, message: '请先填写 Base URL', models: [] }
    // 先试 GET /models(部分服务不支持),失败再发一次 1 token 的对话请求
    try {
      const r = await fetch(completionsUrl(p.baseUrl).replace('/chat/completions', '/models'), {
        headers: p.apiKey ? { authorization: `Bearer ${p.apiKey}` } : {},
        signal: AbortSignal.timeout(15000)
      })
      if (r.ok) {
        const j: any = await r.json().catch(() => null)
        const ids: string[] = (j?.data ?? []).map((m: any) => m.id).filter(Boolean)
        return {
          ok: true,
          message: `连接成功，可用模型：${ids.slice(0, 8).join(', ') || '（服务未返回列表）'}`,
          models: ids.slice(0, 200)
        }
      }
    } catch {
      /* fallthrough */
    }
    try {
      const r = await fetch(completionsUrl(p.baseUrl), {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(p.apiKey ? { authorization: `Bearer ${p.apiKey}` } : {}) },
        body: JSON.stringify({ model: p.model || 'gpt-3.5-turbo', messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }),
        signal: AbortSignal.timeout(20000)
      })
      if (r.ok) return { ok: true, message: `连接成功（模型 ${p.model}）`, models: p.model ? [p.model] : [] }
      const t = await r.text().catch(() => '')
      return { ok: false, message: `HTTP ${r.status}${t ? ':' + t.slice(0, 200) : ''}`, models: [] }
    } catch (e) {
      return { ok: false, message: `连接失败：${(e as Error).message}`, models: [] }
    }
  })

  ipcMain.handle('settings:testOllama', async (_e, baseUrl: string) => {
    try {
      const root = baseUrl.replace(/\/v\d+$/, '')
      const r = await fetch(`${root}/api/tags`, { signal: AbortSignal.timeout(5000) })
      if (!r.ok) return { ok: false, models: [] as string[], message: `HTTP ${r.status}` }
      const j: any = await r.json()
      const models: string[] = (j?.models ?? []).map((m: any) => m.name).filter(Boolean)
      return { ok: true, models, message: `Ollama 可用，共 ${models.length} 个模型` }
    } catch (e) {
      return { ok: false, models: [] as string[], message: `连不上 Ollama：${(e as Error).message}` }
    }
  })

  // ---- 文件选择与导出 ----
  ipcMain.handle('dialog:pickDirectory', async () => {
    const r = await dialog.showOpenDialog(win()!, { properties: ['openDirectory', 'createDirectory'] })
    return r.canceled ? null : r.filePaths[0] ?? null
  })
  ipcMain.handle('dialog:pickFile', async () => {
    const r = await dialog.showOpenDialog(win()!, { properties: ['openFile'] })
    return r.canceled ? null : r.filePaths[0] ?? null
  })

  ipcMain.handle('export:session', async (_e, id: string): Promise<ExportResult> => {
    assertSessionId(id)
    const meta = listSessions().find((m) => m.id === id)
    if (!meta) return { ok: false, message: `会话不存在：${id}` }
    const events = loadAudit(id) as AuditEvent[]
    if (!events.length) return { ok: false, message: '该会话还没有审计记录，先让 agent 干点活吧。' }
    const safeName = (meta.title || '会话').replace(/[\\/:*?"<>|]/g, '_').slice(0, 40)
    const r = await dialog.showSaveDialog(win()!, {
      title: '导出审计报告',
      defaultPath: path.join(dataDir, `${safeName}-审计报告.html`),
      filters: [{ name: 'HTML 报告', extensions: ['html'] }]
    })
    if (r.canceled || !r.filePath) return { ok: false, message: '已取消导出。' }
    try {
      fs.writeFileSync(r.filePath, buildReportHtml(meta, events, shotsDir(id)), 'utf-8')
      shell.showItemInFolder(r.filePath)
      return { ok: true, message: `已导出：${r.filePath}` }
    } catch (e) {
      return { ok: false, message: `导出失败：${(e as Error).message}` }
    }
  })

  // ---- 杂项 ----
  ipcMain.handle('app:openExternal', (_e, url: string) => {
    if (!/^https?:\/\//i.test(String(url))) throw new Error('只允许打开 http/https 链接')
    return shell.openExternal(String(url))
  })

  ipcMain.handle('app:openDataDir', () => {
    fs.mkdirSync(sessionsDir, { recursive: true })
    return shell.openPath(dataDir)
  })

  ipcMain.handle('app:getAppInfo', (): AppInfo => {
    const settings = loadSettings()
    return {
      version: app.getVersion(),
      isPackaged: app.isPackaged,
      dataDir,
      dataRoot,
      lanUrl: settings.lanApproval.enabled ? primaryLanUrl(settings.lanApproval.port) : null,
      lanIps: settings.lanApproval.enabled ? lanAddresses(settings.lanApproval.port).map((a) => a.ip) : []
    }
  })

  ipcMain.handle('app:setDataDir', (_e, dir: string) => {
    if (!dataDirMarker) throw new Error('开发模式下数据目录固定在项目内，无需更改。')
    const target = path.resolve(String(dir ?? ''))
    if (!fs.existsSync(target)) throw new Error('目录不存在，请先创建。')
    fs.writeFileSync(dataDirMarker, target, 'utf-8')
    // 立即生效需要重启:重启后 config 按标记文件解析
    app.relaunch()
    app.exit(0)
  })

  // 供渲染端检查模型是否已配置(顶栏提示)
  ipcMain.handle('app:llmReady', () => {
    try {
      resolveLLM(loadSettings())
      return true
    } catch {
      return false
    }
  })
}
