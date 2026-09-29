// 样式同步测试:导出报告 exportReport.ts 的颜色必须来自 styles.css :root token
// (DESIGN.md 要求"改 styles.css 时同步 exportReport.ts",本测试把这条纪律机械化)
// 用法:node tests/report-style-sync.mjs   失败时退出码 1
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = readFileSync(join(ROOT, 'src/renderer/src/styles.css'), 'utf8');
const REPORT = readFileSync(join(ROOT, 'src/main/exportReport.ts'), 'utf8');

const failures = [];

// ---------- 1. 解析 styles.css :root 色彩 token ----------
const rootBlock = CSS.match(/:root\s*\{([\s\S]*?)\}/);
if (!rootBlock) {
  console.error('FAIL: styles.css 里找不到 :root 块');
  process.exit(1);
}
/** @type {Map<string, string>} 变量名 → 规范化色值 */
const tokens = new Map();
for (const m of rootBlock[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
  tokens.set(m[1], m[2].trim());
}

const normHex = (h) => {
  let s = h.toLowerCase();
  if (s.length === 4) s = '#' + [...s.slice(1)].map((c) => c + c).join('');
  return s;
};
/** token 色值 → {r,g,b} 或 null(非纯色) */
const tokenRgb = new Map();
for (const [name, val] of tokens) {
  const m = val.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    const n = normHex(val);
    tokenRgb.set(name, {
      r: parseInt(n.slice(1, 3), 16),
      g: parseInt(n.slice(3, 5), 16),
      b: parseInt(n.slice(5, 7), 16),
      hex: n
    });
  } else {
    const rgba = val.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgba) tokenRgb.set(name, { r: +rgba[1], g: +rgba[2], b: +rgba[3], hex: null });
  }
}
const rgbSet = new Set([...tokenRgb.values()].filter((v) => v.hex).map((v) => `${v.r},${v.g},${v.b}`));

// ---------- 2. 抽取 exportReport.ts 里的色值字面量(限定 <style> 块 + TYPE_LABEL) ----------
const styleBlock = REPORT.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const typeLabelBlock = REPORT.match(/const TYPE_LABEL[\s\S]*?\n\}/)?.[0] ?? '';
const scoped = styleBlock + '\n' + typeLabelBlock;
const hexInScope = [...scoped.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)].map((m) => normHex('#' + m[1]));
const rgbaInScope = [...scoped.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/gi)].map((m) => ({
  r: +m[1],
  g: +m[2],
  b: +m[3],
  a: m[4] === undefined ? 1 : +m[4],
  raw: m[0]
}));

// ---------- 3. 断言:每个色值必须命中某个 token 的 RGB ----------
const describeToken = (rgb) =>
  [...tokenRgb.entries()].filter(([, v]) => v.r === rgb.r && v.g === rgb.g && v.b === rgb.b).map(([n]) => n);

for (const h of new Set(hexInScope)) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  if (!rgbSet.has(`${r},${g},${b}`)) {
    failures.push(`hex ${h} 不在 styles.css :root 色彩 token 中`);
  }
}
for (const c of rgbaInScope) {
  if (!rgbSet.has(`${c.r},${c.g},${c.b}`)) {
    failures.push(`rgba(${c.r},${c.g},${c.b},…) 的 RGB 不在 styles.css :root token 中`);
  }
}

// ---------- 4. 断言:TYPE_LABEL 的类型色必须与审计色点语义一致 ----------
const expectedDots = {
  user_message: 'accent', // --accent 钢蓝
  assistant_message: 'ink',
  tool_call: 'teal',
  tool_result: 'teal',
  approval_request: 'warn',
  approval_decision: 'warn',
  error: 'err',
  system: 'line-strong'
};
const typeLabel = REPORT.match(/const TYPE_LABEL[\s\S]*?\n\}/)?.[0] ?? '';
for (const [type, tokenName] of Object.entries(expectedDots)) {
  const row = typeLabel.match(new RegExp(`${type}:\\s*\\{\\s*color:\\s*'([^']+)'`));
  const token = tokens.get(`--${tokenName}`);
  if (!row) {
    failures.push(`TYPE_LABEL 缺少 ${type}`);
    continue;
  }
  const found = normHex(row[1]);
  const want = token && token.match(/^#/) ? normHex(token) : null;
  if (!want || found !== want) {
    failures.push(`TYPE_LABEL.${type} = ${found},应与 styles.css --${tokenName}=${token ?? '?'} 一致`);
  }
}

// ---------- 5. 报告 ----------
if (failures.length) {
  console.error(`FAIL report-style-sync: ${failures.length} 处漂移`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(
  `OK report-style-sync: 导出报告 ${new Set(hexInScope).size} 个 hex + ${rgbaInScope.length} 个 rgba ` +
    `全部命中 :root 的 ${tokenRgb.size} 个色彩 token;TYPE_LABEL 8 类色点一致`
);
