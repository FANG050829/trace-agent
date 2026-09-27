import { app, Menu, Tray } from 'electron'
import path from 'node:path'

/**
 * 托盘常驻:关闭窗口可最小化到托盘(设置里开启后),定时任务继续在后台执行。
 */
let tray: Tray | null = null

function showMainWindow(): void {
  const { BrowserWindow } = require('electron') as typeof import('electron')
  const win = BrowserWindow.getAllWindows()[0]
  if (!win) return
  win.show()
  win.focus()
}

export function createTray(): void {
  if (tray) return
  try {
    tray = new Tray(path.resolve(__dirname, '../../icons/icon.png'))
    tray.setToolTip('留痕 Agent — 桌面自动化 · 全程可审计')
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: '显示主窗口', click: () => showMainWindow() },
        { type: 'separator' },
        { label: '退出', click: () => { (app as unknown as { forceQuit?: boolean }).forceQuit = true; app.quit() } }
      ])
    )
    tray.on('click', () => showMainWindow())
  } catch {
    /* 图标缺失等异常不阻塞启动 */
  }
}

export function destroyTray(): void {
  try {
    tray?.destroy()
  } catch {
    /* ignore */
  }
  tray = null
}
