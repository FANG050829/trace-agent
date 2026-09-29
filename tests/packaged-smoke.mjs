// 打包冒烟:启动 release/win-unpacked 里的真实 exe,断言窗口挂载且非崩溃页
// 用法:node tests/packaged-smoke.mjs   失败退出码 1
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXE = join(ROOT, 'release', 'win-unpacked', '留痕 Agent.exe');
const CDP_PORT = 9351;

if (!existsSync(EXE)) {
  console.error(`FAIL packaged-smoke: 找不到打包产物 ${EXE}(先跑 npm run dist)`);
  process.exit(1);
}

const child = spawn(EXE, [`--remote-debugging-port=${CDP_PORT}`, '--disable-gpu-sandbox'], {
  stdio: 'ignore',
  cwd: ROOT
});

let browser = null;
for (let i = 0; i < 40 && !browser; i++) {
  await new Promise((r) => setTimeout(r, 500));
  try {
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${CDP_PORT}`,
      protocolTimeout: 30000
    });
  } catch {
    /* not ready */
  }
}
if (!browser) {
  console.error('FAIL packaged-smoke: CDP 连接失败(应用未在 20s 内启动调试端口)');
  child.kill();
  process.exit(1);
}

const failures = [];
try {
  let page = null;
  for (let i = 0; i < 30 && !page; i++) {
    const pages = await browser.pages();
    page = pages.find((p) => p.url().startsWith('file:')) || null;
    if (!page) await new Promise((r) => setTimeout(r, 500));
  }
  if (!page) throw new Error('未找到应用窗口');

  // 等渲染层挂载(加载中 → .app 或崩溃页)
  await page.waitForSelector('.app, .crash-screen, .settings-view, .welcome', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 800));

  const crashed = await page.$('.crash-screen');
  if (crashed) {
    const err = await page.evaluate(() => document.querySelector('.tool-pre')?.textContent || '');
    failures.push(`渲染层崩溃: ${err.slice(0, 300)}`);
  } else {
    console.log('PASS packaged-smoke: 渲染层挂载,非崩溃页');
  }

  // 主进程 IPC 通路:preload 暴露的 window.trace 应可用
  const apiOk = await page.evaluate(() => typeof window.trace?.listSessions === 'function');
  if (apiOk) console.log('PASS packaged-smoke: preload API 已注入 (window.trace)');
  else failures.push('preload API 未注入(window.trace.listSessions 不是函数)');

  // 三栏骨架存在
  const shell = await page.evaluate(() => ({
    sidebar: !!document.querySelector('.sidebar'),
    main: !!document.querySelector('.main'),
    hasCrash: !!document.querySelector('.crash-screen')
  }));
  if (shell.sidebar && shell.main && !shell.hasCrash) {
    console.log('PASS packaged-smoke: 三栏骨架就位');
  } else {
    failures.push(`骨架异常: ${JSON.stringify(shell)}`);
  }

  // 审计落盘通路:主进程能列出会话(经 preload)
  const sessionsOk = await page.evaluate(async () => {
    const api = window.trace;
    if (!api?.listSessions) return 'no-api';
    try {
      const s = await api.listSessions();
      return Array.isArray(s) ? null : 'listSessions 非数组';
    } catch (e) {
      return String(e);
    }
  });
  if (sessionsOk === null) console.log('PASS packaged-smoke: listSessions IPC 正常');
  else failures.push(`listSessions: ${sessionsOk}`);
} catch (e) {
  failures.push(String(e));
} finally {
  await browser.close().catch(() => undefined);
  child.kill();
}

if (failures.length) {
  console.error(`FAIL packaged-smoke: ${failures.length} 项`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('ALL PASS packaged-smoke');
