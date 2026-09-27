import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 数据目录解析(生产模式可选,不占 C 盘):
 *   1. 环境变量 TRACE_DATA_DIR
 *   2. 命令行参数 --data-dir=<path>
 *   3. exe 同目录 data-dir.txt 里写的路径(设置页"更改数据目录"写入)
 *   4. 默认:exe 同目录 .data(便携模式)
 * 开发模式固定为项目目录。
 */
export const projectRoot = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath()

function resolveDataRoot(): string {
  if (!app.isPackaged) return projectRoot
  const envDir = process.env.TRACE_DATA_DIR?.trim()
  if (envDir) return path.resolve(envDir)
  const arg = process.argv.find((a) => a.startsWith('--data-dir='))
  if (arg) return path.resolve(arg.slice('--data-dir='.length))
  try {
    const marker = path.join(projectRoot, 'data-dir.txt')
    if (fs.existsSync(marker)) {
      const dir = fs.readFileSync(marker, 'utf-8').trim()
      if (dir) return path.resolve(dir)
    }
  } catch {
    /* ignore */
  }
  return projectRoot
}

export const dataRoot = resolveDataRoot()
export const dataDir = path.join(dataRoot, '.data')
export const sessionsDir = path.join(dataDir, 'sessions')
export const settingsFile = path.join(dataDir, 'settings.json')
export const skillsFile = path.join(dataDir, 'skills.json')
export const browserProfileDir = path.join(dataDir, 'browser-profile')

export const BROWSER_DEBUG_PORT = 9223

/** "更改数据目录"的写入位置(exe 旁的标记文件);开发模式无此文件 */
export const dataDirMarker = app.isPackaged ? path.join(projectRoot, 'data-dir.txt') : null

export function ensureDirs(): void {
  for (const dir of [dataDir, sessionsDir, path.join(dataDir, 'electron-userdata')]) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
