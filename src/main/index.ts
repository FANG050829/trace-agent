import { app, BrowserWindow, protocol } from 'electron'
import path from 'node:path'
import { join } from 'node:path'
import { dataDir, ensureDirs } from './config'
import { registerIpc } from './ipc'
import { registerProtocol } from './protocol'
import { AgentRunner } from './agent/loop'

// 必须在 ready 之前注册
protocol.registerSchemesAsPrivileged([
  { scheme: 'trace', privileges: { secure: true, supportFetchAPI: true, stream: true } }
])

// 开发模式下可通过 APP_DEBUG_PORT 环境变量开启渲染端调试端口(自动化测试用)
if (!app.isPackaged && process.env.APP_DEBUG_PORT) {
  app.commandLine.appendSwitch('remote-debugging-port', process.env.APP_DEBUG_PORT)
}

// 开发模式下 Electron 自身缓存也落在项目 .data/ 内,不写 C 盘
if (!app.isPackaged) {
  app.setPath('userData', path.join(dataDir, 'electron-userdata'))
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 660,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0e1116',
    title: '留痕 Agent',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.on('ready-to-show', () => win.show())

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

app.whenReady().then(() => {
  ensureDirs()
  registerProtocol()
  registerIpc()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  AgentRunner.cancelAll()
  if (process.platform !== 'darwin') app.quit()
})
