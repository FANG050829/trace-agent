/* 冒烟测试 2:验证深度优化后的 UI——技能库、导出按钮、侧栏搜索/重命名、设置高级区、错误链路
 * 用法:先 npm run dev(可加 APP_DEBUG_PORT=9333),再 node tests/smoke2.mjs */
import puppeteer from 'puppeteer-core'
import { execSync } from 'node:child_process'
import path from 'node:path'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const SHOT = (n) => path.resolve('tests', `${n}.png`)
let failed = 0
const ok = (cond, name) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) failed++
}

// 把应用窗口拉到前台:窗口被遮挡时 Chromium 不产帧,截图会挂起
try {
  execSync(`powershell -NoProfile -c "(New-Object -ComObject WScript.Shell).AppActivate('留痕 Agent')"`)
  await sleep(400)
} catch {
  /* 激活失败不影响断言,只影响截图 */
}

const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null, protocolTimeout: 60000 })
const pages = await browser.pages()
const page = pages[0]
await page.setViewport({ width: 1440, height: 900 })
page.on('dialog', (d) => d.accept().catch(() => undefined))
console.log('page title:', await page.title())

const safeShot = async (name) => {
  try {
    await page.screenshot({ path: SHOT(name) })
  } catch (e) {
    console.log(`(截图 ${name} 跳过:${e.message.slice(0, 60)})`)
  }
}

const clickButtonByText = (text) =>
  page.evaluate((t) => {
    const el = [...document.querySelectorAll('button')].find((b) => (b.innerText || '').includes(t))
    if (el) {
      el.click()
      return true
    }
    return false
  }, text)

// React 受控输入的正确清空方式(直接赋值会被 value tracker 去重)
const clearInput = (sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s)
    if (!el) return false
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, '')
    el.dispatchEvent(new Event('input', { bubbles: true }))
    return true
  }, sel)

// CDP 鼠标派发在窗口被遮挡时会挂起,统一用 DOM click
const clickSelector = (sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s)
    if (el) {
      el.click()
      return true
    }
    return false
  }, sel)

// 清掉上次运行遗留的搜索词,保证过滤断言稳定
await clearInput('.session-search').catch(() => undefined)
await clearInput('.audit-search').catch(() => undefined)

// 1. 新建会话并发消息(未配置模型 → 应出现友好错误,进审计)
await clickButtonByText('新建会话')
await sleep(600)
await page.type('.input-bar textarea', '你好,帮我看看桌面有什么文件')
await sleep(200)
await clickSelector('.input-bar .send')
await sleep(1800)
const chatText = await page.evaluate(() => document.querySelector('.chat-scroll')?.innerText ?? '')
ok(chatText.includes('尚未选择模型服务'), '错误链路:未配置模型时给出可操作的中文提示')
await safeShot('sm2-chat-error')

// 2. 审计面板:搜索框 + 导出按钮存在
ok((await page.$('.audit-search')) !== null, '审计面板:关键词搜索框存在')
ok((await page.evaluate(() => [...document.querySelectorAll('.audit-head button')].some((b) => b.innerText.includes('导出')))), '审计面板:导出按钮存在')
// 过滤词命中
await page.type('.audit-search', '模型服务')
await sleep(300)
const filtered = await page.evaluate(() => document.querySelectorAll('.audit-item').length)
ok(filtered > 0, `审计面板:搜索过滤生效(${filtered} 条)`)
await clearInput('.audit-search')
await sleep(200)

// 3. 侧栏:搜索 + 双击重命名
ok((await page.$('.session-search')) !== null, '侧栏:会话搜索框存在')
await page.evaluate(() => {
  const el = document.querySelector('.session-item .session-title')
  el?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
})
await sleep(300)
ok((await page.$('.session-rename')) !== null, '侧栏:双击进入重命名')
await clickSelector('.session-rename')
await page.keyboard.down('Control')
await page.keyboard.press('a')
await page.keyboard.up('Control')
await page.type('.session-rename', '冒烟测试会话')
await page.keyboard.press('Enter')
await sleep(400)
const renamed = await page.evaluate(() => document.querySelector('.session-item .session-title')?.innerText ?? '')
ok(renamed === '冒烟测试会话', `侧栏:重命名生效(实际:"${renamed}")`)
// 搜索过滤:所有可见会话标题都应包含关键词
await page.type('.session-search', '冒烟测试会话')
await sleep(300)
const titles = await page.evaluate(() => [...document.querySelectorAll('.session-item .session-title')].map((i) => i.innerText))
ok(titles.length > 0 && titles.every((t) => t.includes('冒烟测试会话')), `侧栏:搜索过滤生效(${titles.length} 项均命中)`)
await clearInput('.session-search')
await sleep(200)

// 4. 技能库:新建 → 保存 → 卡片出现 → 删除
await clickButtonByText('技能')
await sleep(500)
ok((await page.evaluate(() => document.body.innerText.includes('还没有技能'))) || (await page.$('.tpl-card')) !== null, '技能库:空态提示或已有技能')
await clickButtonByText('新建技能')
await sleep(300)
await page.type('.modal input', '冒烟技能')
await page.type('.modal textarea', '这是冒烟测试的技能提示词')
await safeShot('sm2-skill-modal')
await page.evaluate(() => [...document.querySelectorAll('.modal button')].find((b) => b.innerText.includes('保存'))?.click())
await sleep(500)
const skillCard = await page.evaluate(() => document.querySelector('.tpl-card .tpl-name')?.innerText ?? '')
ok(skillCard === '冒烟技能', `技能库:保存成功(实际:"${skillCard}")`)
await safeShot('sm2-skills')
// 清理(删除会弹 confirm,由 dialog 处理器自动接受;CDP 偶发抖动时重试一次)
for (let i = 0; i < 3; i++) {
  await page.evaluate(() => [...document.querySelectorAll('.skill-actions button')].find((b) => b.innerText.includes('删除'))?.click())
  await sleep(1200)
  const gone = await page.evaluate(() => !document.body.innerText.includes('冒烟技能'))
  if (gone) break
}
ok(!(await page.evaluate(() => document.body.innerText.includes('冒烟技能'))), '技能库:删除生效')

// 5. 顶栏:状态指示存在
ok((await page.$('.status-dot')) !== null, '顶栏:状态指示存在')

// 6. 设置页:高级区(温度/上下文预算)、打开数据目录按钮、API Key 显隐
await clickButtonByText('设置')
await sleep(600)
const settingsText = await page.evaluate(() => document.querySelector('.settings-view')?.innerText ?? '')
ok(settingsText.includes('温度'), '设置:温度项存在')
ok(settingsText.includes('上下文预算'), '设置:上下文预算项存在')
ok(settingsText.includes('打开数据目录'), '设置:打开数据目录按钮存在')
ok((await page.evaluate(() => document.querySelector('.save-row .dirty-hint') !== null)) === false, '设置:初始无未保存提示')
// 添加一个服务商 → 出现 Key 显隐按钮
await clickButtonByText('＋ 智谱 GLM')
await sleep(400)
ok((await page.$('.key-row button')) !== null, '设置:API Key 显隐按钮存在')
await clickButtonByText('👁')
await sleep(200)
ok((await page.$('.key-row input[type="text"]')) !== null, '设置:点击后 Key 明文显示')
const dirty = await page.evaluate(() => document.querySelector('.dirty-hint')?.innerText ?? '')
ok(dirty.includes('未保存'), '设置:修改后出现未保存提示')
await safeShot('sm2-settings')
// 不保存,清理:刷新即可(不点保存)

await browser.disconnect()
console.log(failed === 0 ? 'SMOKE ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
