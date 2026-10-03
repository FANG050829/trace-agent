import puppeteer, { type Browser, type Page } from 'puppeteer-core'
import { spawn, type ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import { BROWSER_DEBUG_PORT, browserProfileDir } from '../config'
import type { ToolImpl } from './index'

let browser: Browser | null = null
let proc: ChildProcess | null = null
let current: Page | null = null

const EXE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function findExe(): Promise<string> {
  for (const p of EXE_CANDIDATES) if (fs.existsSync(p)) return p
  throw new Error('未找到 Edge 或 Chrome 浏览器，请先安装其中之一。')
}

async function pageSummary(page: Page): Promise<string> {
  return await page
    .evaluate(() => {
      const links = [...document.querySelectorAll('a[href]')]
        .map((a) => ({ text: (a as HTMLElement).innerText.trim().slice(0, 40), href: (a as HTMLAnchorElement).href }))
        .filter((l) => l.text)
        .slice(0, 15)
      return (
        `标题：${document.title}\nURL:${location.href}\n` +
        `页面文本（前 1200 字）：\n${(document.body?.innerText ?? '').slice(0, 1200)}\n` +
        (links.length ? `可点击链接：\n${links.map((l) => `- ${l.text} → ${l.href}`).join('\n')}` : '')
      )
    })
    .catch(() => '读取页面内容失败（页面可能仍在加载）')
}

/** 启动(或连接)带调试端口的浏览器,返回当前页面。使用独立用户数据目录,不影响用户日常浏览器。 */
export async function ensureBrowser(startUrl?: string): Promise<Page> {
  if (browser?.connected) {
    if (!current || current.isClosed()) current = await browser.newPage()
    if (startUrl) await current.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => undefined)
    return current
  }
  const exe = await findExe()
  proc = spawn(
    exe,
    [
      `--remote-debugging-port=${BROWSER_DEBUG_PORT}`,
      `--user-data-dir=${browserProfileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      ...(startUrl ? [startUrl] : [])
    ],
    { stdio: 'ignore' }
  )
  proc.on('exit', () => {
    browser = null
    proc = null
    current = null
  })
  let ready = false
  for (let i = 0; i < 40; i++) {
    await sleep(500)
    try {
      const r = await fetch(`http://127.0.0.1:${BROWSER_DEBUG_PORT}/json/version`)
      if (r.ok) {
        ready = true
        break
      }
    } catch {
      /* retry */
    }
  }
  if (!ready) throw new Error('浏览器调试端口未就绪，无法连接。')
  browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${BROWSER_DEBUG_PORT}`, defaultViewport: null })
  const pages = await browser.pages()
  current = pages[0] ?? (await browser.newPage())
  return current
}

export async function closeBrowser(): Promise<void> {
  try {
    await browser?.close()
  } catch {
    /* ignore */
  }
  try {
    proc?.kill()
  } catch {
    /* ignore */
  }
  browser = null
  proc = null
  current = null
}

export const browserLaunch: ToolImpl = {
  name: 'browser_launch',
  label: '启动浏览器',
  descForModel: '启动一个独立的 Edge/Chrome 浏览器（带自动化调试接口），可指定起始网址。',
  parameters: {
    type: 'object',
    properties: { url: { type: 'string', description: '可选，起始网址' } }
  },
  risk: () => 'safe',
  approvalSummary: (a) => `启动浏览器${a.url ? `并打开 ${a.url}` : ''}`,
  async run(args) {
    const page = await ensureBrowser(args.url ? String(args.url) : undefined)
    return { textForModel: `浏览器已就绪。${await pageSummary(page)}`, detail: { url: page.url() } }
  }
}

export const browserNavigate: ToolImpl = {
  name: 'browser_navigate',
  label: '打开网页',
  descForModel: '在浏览器中打开一个网址，返回页面标题、正文摘要和可点击链接。',
  parameters: {
    type: 'object',
    properties: { url: { type: 'string', description: '要打开的网址（含 http/https）' } },
    required: ['url']
  },
  risk: () => 'safe',
  approvalSummary: (a) => `打开网页 ${a.url}`,
  async run(args) {
    const page = await ensureBrowser()
    await page.goto(String(args.url), { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) => {
      throw new Error(`打开页面失败：${e.message}`)
    })
    await sleep(800)
    return { textForModel: await pageSummary(page), detail: { url: page.url() } }
  }
}

export const browserExtract: ToolImpl = {
  name: 'browser_extract',
  label: '读取页面内容',
  descForModel: '读取当前页面的文字内容（可指定 CSS 选择器，默认整页），用于信息采集。',
  parameters: {
    type: 'object',
    properties: { selector: { type: 'string', description: '可选，CSS 选择器' } }
  },
  risk: () => 'safe',
  approvalSummary: () => '读取浏览器页面内容',
  async run(args) {
    const page = await ensureBrowser()
    const sel = args.selector ? String(args.selector) : null
    const text = await page
      .evaluate((s) => (s ? (document.querySelector(s) as HTMLElement | null)?.innerText : document.body?.innerText) ?? '', sel)
      .catch(() => '')
    return {
      textForModel: text ? `页面内容（${text.length} 字，截前 3000）：\n${text.slice(0, 3000)}` : '没有取到页面文字，页面可能还没加载完或选择器不匹配。',
      detail: { url: page.url(), selector: sel, length: text.length }
    }
  }
}

export const browserClick: ToolImpl = {
  name: 'browser_click',
  label: '点击页面元素',
  descForModel: '点击页面上的元素：用可见文字描述（如"登录"按钮），或给出 CSS 选择器。',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: '元素的可见文字（优先使用）' },
      selector: { type: 'string', description: 'CSS 选择器' }
    }
  },
  risk: () => 'safe',
  approvalSummary: (a) => `点击页面元素：${a.text ?? a.selector}`,
  async run(args) {
    const page = await ensureBrowser()
    const ok = await page
      .evaluate(({ text, selector }) => {
        let el: Element | null = null
        if (selector) el = document.querySelector(selector)
        else if (text) {
          const nodes = [
            ...document.querySelectorAll('a,button,[role=button],input[type=submit],input[type=button],li,summary,td,span,div')
          ] as HTMLElement[]
          const matches = nodes.filter((n) => (n.innerText || '').includes(text))
          el = matches.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length)[0] ?? null
        }
        if (!el) return false
        ;(el as HTMLElement).scrollIntoView({ block: 'center' })
        ;(el as HTMLElement).click()
        return true
      }, { text: args.text ? String(args.text) : null, selector: args.selector ? String(args.selector) : null })
    if (!ok) throw new Error('没有找到要点击的元素')
    await sleep(1200)
    return { textForModel: `已点击"${args.text ?? args.selector}"。当前页面状态：\n${await pageSummary(page)}`, detail: { clicked: args.text ?? args.selector } }
  }
}

export const browserType: ToolImpl = {
  name: 'browser_type',
  label: '输入文字',
  descForModel: '向页面输入框输入文字（可指定 CSS 选择器，不指定则输入到当前焦点处），可选自动回车。',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: '要输入的文字' },
      selector: { type: 'string', description: '可选，目标输入框 CSS 选择器' },
      submit: { type: 'boolean', description: '输入后是否按回车' }
    },
    required: ['text']
  },
  risk: () => 'safe',
  approvalSummary: (a) => `在页面输入：${String(a.text ?? '').slice(0, 60)}`,
  async run(args) {
    const page = await ensureBrowser()
    const text = String(args.text ?? '')
    if (args.selector) {
      await page.waitForSelector(String(args.selector), { timeout: 8000 })
      await page.type(String(args.selector), text, { delay: 30 })
    } else {
      await page.keyboard.type(text, { delay: 30 })
    }
    if (args.submit) await page.keyboard.press('Enter')
    await sleep(800)
    return { textForModel: `已输入文字${args.submit ? '并回车' : ''}。当前页面：\n${await pageSummary(page)}`, detail: { text: text.slice(0, 100), submit: !!args.submit } }
  }
}

export const browserPressKey: ToolImpl = {
  name: 'browser_press_key',
  label: '按键',
  descForModel: '在浏览器中按一个键，如 Enter、Tab、Escape、ArrowDown。',
  parameters: {
    type: 'object',
    properties: { key: { type: 'string', description: '键名，如 Enter / Tab / Escape' } },
    required: ['key']
  },
  risk: () => 'safe',
  approvalSummary: (a) => `按键 ${a.key}`,
  async run(args) {
    const page = await ensureBrowser()
    await page.keyboard.press(String(args.key) as never)
    await sleep(500)
    return { textForModel: `已按下 ${args.key}。当前页面：\n${await pageSummary(page)}`, detail: { key: args.key } }
  }
}

export const browserScreenshot: ToolImpl = {
  name: 'browser_screenshot',
  label: '浏览器截图',
  descForModel: '对当前浏览器页面截图并保存。',
  parameters: { type: 'object', properties: {} },
  risk: () => 'safe',
  approvalSummary: () => '对浏览器页面截图',
  async run(_args, ctx) {
    const page = await ensureBrowser()
    const png = await page.screenshot({ type: 'png' })
    const shotFile = ctx.audit.saveShot(Buffer.from(png))
    return {
      textForModel: `已对页面截图并保存（${page.url()}）。`,
      shotFile,
      imageDataUrl: `data:image/png;base64,${Buffer.from(png).toString('base64')}`,
      detail: { url: page.url() }
    }
  }
}

export const browserClose: ToolImpl = {
  name: 'browser_close',
  label: '关闭浏览器',
  descForModel: '关闭由你启动的自动化浏览器。',
  parameters: { type: 'object', properties: {} },
  risk: () => 'confirm',
  approvalSummary: () => '关闭自动化浏览器',
  async run() {
    await closeBrowser()
    return { textForModel: '浏览器已关闭。', detail: {} }
  }
}
