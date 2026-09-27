/* 重设计验收截图:批量捕获主要界面到 .impeccable/review/ */
import puppeteer from 'puppeteer-core'
import { execSync } from 'node:child_process'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const OUT = 'E:/ai-project/ZCode/trace-agent/.impeccable/review'
try {
  execSync(`powershell -NoProfile -c "(New-Object -ComObject WScript.Shell).AppActivate('留痕 Agent')"`)
  await sleep(500)
} catch {}

const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null, protocolTimeout: 60000 })
const p = (await b.pages())[0]
await p.setViewport({ width: 1440, height: 900 })
p.on('dialog', (d) => d.accept().catch(() => undefined))

const shot = async (name) => {
  for (let i = 0; i < 3; i++) {
    try {
      await p.screenshot({ path: `${OUT}/${name}.png` })
      console.log(name, 'ok')
      return
    } catch (e) {
      await sleep(1200)
    }
  }
  console.log(name, 'SKIP')
}
const click = (t) => p.evaluate((x) => [...document.querySelectorAll('button')].find((b) => (b.innerText || '').includes(x))?.click(), t)
const clearInput = (sel) =>
  p.evaluate((s) => {
    const el = document.querySelector(s)
    if (!el) return
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, '')
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }, sel)

// 1. 欢迎页
await p.evaluate(() => [...document.querySelectorAll('button')].find((b) => (b.innerText || '').includes('新建会话'))?.click())
await sleep(900)
await shot('desktop-welcome')

// 2. 对话页(错误链路 → 有内容)
await p.type('.input-bar textarea', '你好,帮我看看桌面有什么文件')
await sleep(200)
await p.evaluate(() => document.querySelector('.input-bar .send')?.click())
await sleep(1800)
await shot('desktop-chat')

// 3. 展开工具卡?错误链路没有工具卡;审计面板已有内容
await shot('desktop-audit')

// 4. 模板库
await click('模板库')
await sleep(700)
await p.evaluate(() => [...document.querySelectorAll('.tpl-head')].find((e) => e.innerText.includes('下载文件夹整理'))?.click())
await sleep(500)
await shot('desktop-templates')

// 5. 技能库
await click('技能库')
await sleep(600)
await shot('desktop-skills')

// 6. 设置页
await click('设置')
await sleep(700)
await click('＋ 智谱 GLM')
await sleep(500)
await shot('desktop-settings')

await clearInput('.session-search')
await b.disconnect()
console.log('CAPTURE DONE')
process.exit(0)
