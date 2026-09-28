/* 生成应用图标 icons/icon.png(512×512):石墨圆角方块 + 时间线标记,与产品视觉同一血统。
 * 4x 超采样绘制后盒式降采样,边缘平滑。无第三方依赖。用法:node scripts/gen-icon.mjs */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const SIZE = 512
const SS = 4 // 超采样倍率
const N = SIZE * SS

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
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

// ---------- 4x 超采样绘制 ----------
const px = Buffer.alloc(N * N * 4)
const set = (x, y, r, g, b, a) => {
  if (x < 0 || y < 0 || x >= N || y >= N) return
  const i = (y * N + x) * 4
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

const M = 14 * SS // 方块内缩
const R = 104 * SS // 圆角
const B = { r: 0x14, g: 0x15, b: 0x19 } // 面板底
const L = { r: 0x35, g: 0x38, b: 0x3f } // 发丝线
const INK = { r: 0xe8, g: 0xe9, b: 0xec } // 墨白

// 方块(硬边;4x 降采样自带平滑)+ 内缘发丝线
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const inner = inRoundedRect(x, y, M, M, N - M - 1, N - M - 1, R)
    if (!inner) continue
    const hair = !inRoundedRect(x, y, M + 2 * SS, M + 2 * SS, N - M - 1 - 2 * SS, N - M - 1 - 2 * SS, R - 2 * SS)
    if (hair) set(x, y, L.r, L.g, L.b, 255)
    else set(x, y, B.r, B.g, B.b, 255)
  }
}

// 时间线:一条留痕的竖线 + 末端实心落点(顶部远端小点融进线里)
// 与站点 i-mark 同一几何(24 viewBox 归一 → ×512/24):线 5.8→17,点 r 1 / 3
const cx = N / 2
const lineHalf = 7.5 * SS
const Y0 = 124 * SS, Y1 = 363 * SS // 5.8 / 17.0 × 512/24
for (let y = Y0; y <= Y1; y++) {
  for (let dx = -Math.ceil(lineHalf); dx <= Math.ceil(lineHalf); dx++) {
    set(cx + dx, y, INK.r, INK.g, INK.b, 255)
  }
}
// alpha 混合:点与其下的线重叠处要透出线的颜色,而不是被点盖死
const blend = (x, y, c, a) => {
  if (x < 0 || y < 0 || x >= N || y >= N) return
  const i = (y * N + x) * 4
  px[i] = Math.round(px[i] * (1 - a) + c.r * a)
  px[i + 1] = Math.round(px[i + 1] * (1 - a) + c.g * a)
  px[i + 2] = Math.round(px[i + 2] * (1 - a) + c.b * a)
  px[i + 3] = 255
}
const dot = (cy512, r512, a) => {
  const r = r512 * SS
  const cy = cy512 * SS
  const hole = 5 * SS // 点与线之间挖空一圈,呼应应用里的节奏
  for (let y = cy - r - hole; y <= cy + r + hole; y++) {
    for (let x = cx - r - hole; x <= cx + r + hole; x++) {
      const d = Math.hypot(x - cx, y - cy)
      if (d > r + hole) continue
      if (d >= r && d <= r + hole) set(x, y, B.r, B.g, B.b, 255)
      if (d <= r) blend(x, y, INK, a)
    }
  }
}
dot(123.7, 1.0, 0.30) // 5.8 / 24 × 512
dot(362.7, 3.0, 1.00) // 17.0 / 24 × 512

// ---------- 盒式降采样 4x → 1x ----------
const out = Buffer.alloc(SIZE * SIZE * 4)
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let r = 0
    let g = 0
    let b = 0
    let a = 0
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const i = ((y * SS + sy) * N + (x * SS + sx)) * 4
        r += px[i]
        g += px[i + 1]
        b += px[i + 2]
        a += px[i + 3]
      }
    }
    const n = SS * SS
    const o = (y * SIZE + x) * 4
    out[o] = Math.round(r / n)
    out[o + 1] = Math.round(g / n)
    out[o + 2] = Math.round(b / n)
    out[o + 3] = Math.round(a / n)
  }
}

const dir = path.resolve('icons')
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, 'icon.png'), encodePng(out, SIZE, SIZE))
console.log('icons/icon.png written (4x supersampled),', SIZE, 'x', SIZE)
