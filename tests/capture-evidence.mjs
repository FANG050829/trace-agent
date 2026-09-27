/* 端到端证据捕获:假模型驱动完整闭环,拍下运行中/待确认/展开详情/最终状态 */
import puppeteer from 'puppeteer-core'
import { execSync } from 'node:child_process'
import fs from 'node:fs'

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
  for (let i = 0; i < 4; i++) {
    try {
      await p.screenshot({ path: `${OUT}/${name}.png` })
      console.log(name, 'ok')
      return
    } catch {
      await sleep(1200)
    }
  }
  console.log(name, 'SKIP')
}
const click = (t) =>
  p.evaluate((x) => [...document.querySelectorAll('button')].find((b) => (b.innerText || '').includes(x))?.click(), t)

// 1. 新会话,发送消息(假模型已在 settings.json 指向本地服务)
await click('新建会话')
await sleep(800)
await p.type('.input-bar textarea', '读取 package.json,然后跑一条演示命令')
await sleep(150)
await p.evaluate(() => document.querySelector('.input-bar .send')?.click())

// 2. 模型流式输出中 → 顶栏应为青绿"执行中"状态点
await sleep(1100)
await shot('evidence-running')

// 3. 等待审批卡片出现(run_command 需要 confirm)
await p.waitForSelector('.approval-card', { timeout: 30000 }).catch(() => console.log('approval card timeout'))
await sleep(900)
await shot('evidence-waiting')

// 4. 批准执行 → 命令运行 → 模型收尾
await click('批准执行')
await sleep(2600)

// 5. 展开审计时间线里"读取文件"那条,看原始 JSON
const expanded = await p.evaluate(() => {
  const el = [...document.querySelectorAll('.audit-item')].find((e) => e.innerText.includes('读取文件'))
  if (el) {
    el.click()
    return true
  }
  return false
})
console.log('audit expanded:', expanded)
await sleep(600)
await shot('evidence-expanded')

// 6. 最终对话状态(工具卡完成 + 模型收尾文本)
await shot('evidence-final')

await b.disconnect()
console.log('EVIDENCE DONE')
process.exit(0)
