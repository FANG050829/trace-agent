import { app, BrowserWindow, protocol } from 'electron'
import path from 'node:path'
import { join } from 'node:path'
import { dataDir, ensureDirs } from './config'
import { registerIpc } from './ipc'
import { registerProtocol } from './protocol'
import { AgentRunner } from './agent/loop'
import { createTray, destroyTray } from './tray'
import { startScheduler } from './scheduler'
import { syncLanApproval } from './lan'
import { loadSettings } from './store'

// 必须在 ready 之前注册
protocol.registerSchemesAsPrivileged([
  { scheme: 'trace', privileges: { secure: true, supportFetchAPI: true, stream: true } }
])

// 单实例锁:二次启动唤起已有窗口(托盘常驻模式下尤其重要)
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

// 开发模式下可通过 APP_DEBUG_PORT 环境变量开启渲染端调试端口(自动化测试用)
if (!app.isPackaged && process.env.APP_DEBUG_PORT) {
  app.commandLine.appendSwitch('remote-debugging-port', process.env.APP_DEBUG_PORT)
}

// Electron 自身缓存与用户数据全部重定向到数据目录内,不写 C 盘
app.setPath('userData', path.join(dataDir, 'electron-userdata'))
app.setAppUserModelId('com.youxi.trace-agent') // Windows 通知需要

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 660,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0d0e11',
    title: '留痕 Agent',
    icon: join(__dirname, '../../icons/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.on('ready-to-show', () => win.show())

  // 托盘常驻:开启"关闭到托盘"时,点关闭 = 隐藏窗口,定时任务继续
  win.on('close', (e) => {
    const settings = loadSettings()
    const forceQuit = (app as unknown as { forceQuit?: boolean }).forceQuit
    if (settings.background.closeToTray && !forceQuit) {
      e.preventDefault()
      win.hide()
    }
  })

  // Ctrl+= / Ctrl+- / Ctrl+0 缩放(菜单被隐藏后的替代方案)
  win.webContents.on('before-input-event', (event, input) => {
    if (!input.control || input.type !== 'keyDown' || input.alt || input.shift) return
    const key = input.key.toLowerCase()
    if (key === '=' || key === '+') {
      win.webContents.setZoomLevel(Math.min(win.webContents.getZoomLevel() + 0.5, 5))
      event.preventDefault()
    } else if (key === '-') {
      win.webContents.setZoomLevel(Math.max(win.webContents.getZoomLevel() - 0.5, -4))
      event.preventDefault()
    } else if (key === '0') {
      win.webContents.setZoomLevel(0)
      event.preventDefault()
    }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.on('second-instance', () => {
  const win = BrowserWindow.getAllWindows()[0]
  if (win) {
    win.show()
    win.focus()
  }
})

app.whenReady().then(() => {
  ensureDirs()
  registerProtocol()
  registerIpc()
  createWindow()
  createTray()
  startScheduler() // 定时技能:应用运行期间(含托盘常驻)每 30 秒检查一次
  syncLanApproval()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  ;(app as unknown as { forceQuit?: boolean }).forceQuit = true
  destroyTray()
})

app.on('window-all-closed', () => {
  AgentRunner.cancelAll()
  if (process.platform !== 'darwin') app.quit()
})
