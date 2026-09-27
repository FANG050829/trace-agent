/* 生成应用图标 icons/icon.png(512×512):石墨圆角方块 + 时间线标记,与产品视觉同一血统。
 * 无第三方依赖:自绘像素 + node:zlib PNG 编码。用法:node scripts/gen-icon.mjs */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const SIZE = 512

// ---------- 极简 PNG 编码器 ----------
function crc32(buf) {
  let table = crc32.table
  if (!table) {
    table = crc32.table = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
  }
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encodePng(rgba, w, h) {
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

// ---------- 绘制 ----------
const px = Buffer.alloc(SIZE * SIZE * 4)
const set = (x, y, r, g, b, a) => {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return
  const i = (y * SIZE + x) * 4
  const na = a / 255
  px[i] = Math.round(r * na + px[i] * (1 - na))
  px[i + 1] = Math.round(g * na + px[i + 1] * (1 - na))
  px[i + 2] = Math.round(b * na + px[i + 2] * (1 - na))
  px[i + 3] = Math.round(Math.max(a, px[i + 3]))
}
const inRoundedRect = (x, y, x0, y0, x1, y1, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  const cx = Math.max(Math.min(x, x1 - r), x0 + r)
  const cy = Math.max(Math.min(y, y1 - r), y0 + r)
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= r * r || (x >= x0 + r && x <= x1 - r) || (y >= y0 + r && y <= y1 - r)
}

// 石墨圆角方块(全出血 12px 内缩,留出透明边)
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    if (inRoundedRect(x, y, 14, 14, SIZE - 15, SIZE - 15, 100)) set(x, y, 0x14, 0x15, 0x19, 255)
  }
}
// 细描边(略亮一档,呼应发丝线)
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const inside = inRoundedRect(x, y, 14, 14, SIZE - 15, SIZE - 15, 100)
    const outer = inRoundedRect(x, y, 10, 10, SIZE - 11, SIZE - 11, 104)
    if (outer && !inside) set(x, y, 0x35, 0x38, 0x3f, 255)
  }
}

// 时间线:竖线 + 三个圆点(白 → 0.66 → 0.33 透明度阶梯)
const cx = SIZE / 2
for (let y = 96; y <= SIZE - 96; y++) {
  for (let dx = -7; dx <= 7; dx++) set(cx + dx, y, 0xe8, 0xe9, 0xec, 255)
}
const dot = (cy, alpha) => {
  const r = 30
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const d = Math.hypot(x - cx, y - cy)
      if (d <= r + 2) {
        // 点外圈用底色挖空,再画实心圆
        set(x, y, 0x14, 0x15, 0x19, 255)
        if (d <= r - 4) set(x, y, 0xe8, 0xe9, 0xec, alpha)
      }
    }
  }
}
dot(160, 255)
dot(256, 168)
dot(352, 84)

const out = path.resolve('icons')
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, 'icon.png'), encodePng(px, SIZE, SIZE))
console.log('icons/icon.png written,', SIZE, 'x', SIZE)
