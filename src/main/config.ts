import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 所有数据都落在项目目录内(E 盘),不占用 C 盘。
 * 开发模式下把 Electron userData 也重定向进 .data/,避免 Chromium 缓存写到 %APPDATA%。
 */
export const projectRoot = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath()

export const dataDir = path.join(projectRoot, '.data')
export const sessionsDir = path.join(dataDir, 'sessions')
export const settingsFile = path.join(dataDir, 'settings.json')
export const skillsFile = path.join(dataDir, 'skills.json')
export const browserProfileDir = path.join(dataDir, 'browser-profile')

export const BROWSER_DEBUG_PORT = 9223

export function ensureDirs(): void {
  for (const dir of [dataDir, sessionsDir, path.join(dataDir, 'electron-userdata')]) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
