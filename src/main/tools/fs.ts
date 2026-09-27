import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { dataDir, projectRoot } from '../config'
import type { ToolImpl } from './index'

const MAX_LIST = 500
const MAX_READ_BYTES = 512 * 1024
const MAX_SEARCH_RESULTS = 200

/** 绝对不允许删除的路径:盘根/系统目录/用户主目录/本项目审计数据(小写比较) */
function deleteGuard(p: string): string | null {
  const norm = path.resolve(p).toLowerCase().replace(/[\\/]+$/, '')
  const home = path.resolve(os.homedir()).toLowerCase()
  // 整棵子树禁删:系统文件与审计记录,删除会破坏系统或"全程留痕"承诺
  const subtree = ['c:\\windows', 'c:\\program files', 'c:\\program files (x86)', path.resolve(dataDir).toLowerCase()]
  // 仅目录本身禁删(其子内容仍可正常操作)
  const selfOnly = ['c:', 'd:', 'e:', 'f:', 'g:', 'c:\\users', home, path.resolve(projectRoot).toLowerCase()]
  for (const t of subtree) {
    if (norm === t || norm.startsWith(t + path.sep)) return t
  }
  for (const t of selfOnly) {
    if (norm === t) return t
  }
  return null
}

function decodeSmart(buf: Buffer): string {
  const utf8 = buf.toString('utf-8')
  const bad = (utf8.match(/\uFFFD/g) ?? []).length
  if (bad > utf8.length * 0.01) {
    try {
      return new TextDecoder('gbk').decode(buf)
    } catch {
      return utf8
    }
  }
  return utf8
}

function looksBinary(buf: Buffer): boolean {
  const head = buf.subarray(0, 8192)
  return head.includes(0)
}

function fmtSize(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export const fsListDir: ToolImpl = {
  name: 'fs_list_dir',
  label: '列出目录',
  descForModel: '列出一个目录下的文件和子目录(名称、类型、大小、修改时间)。',
  parameters: {
    type: 'object',
    properties: { path: { type: 'string', description: '目录绝对路径' } },
    required: ['path']
  },
  risk: () => 'safe',
  approvalSummary: (a) => `查看目录 ${a.path}`,
  async run(args) {
    const p = String(args.path ?? '')
    const entries = fs.readdirSync(p, { withFileTypes: true })
    const rows = entries.slice(0, MAX_LIST).map((e) => {
      const full = path.join(p, e.name)
      let size = 0
      try {
        size = e.isDirectory() ? 0 : fs.statSync(full).size
      } catch {
        /* ignore */
      }
      return `${e.isDirectory() ? '[目录]' : '[文件]'} ${e.name}${e.isDirectory() ? '' : ` (${fmtSize(size)})`}`
    })
    return {
      textForModel: `目录 ${p} 共 ${entries.length} 项:\n${rows.join('\n') || '(空目录)'}${entries.length > MAX_LIST ? `\n(仅显示前 ${MAX_LIST} 项)` : ''}`,
      detail: { path: p, count: entries.length, entries: rows }
    }
  }
}

export const fsReadFile: ToolImpl = {
  name: 'fs_read_file',
  label: '读取文件',
  descForModel: '读取一个文本文件的内容(自动识别 UTF-8/GBK 编码)。不适合读图片等二进制文件。',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: '文件绝对路径' },
      max_bytes: { type: 'number', description: '最多读取的字节数,默认 524288' }
    },
    required: ['path']
  },
  risk: () => 'safe',
  approvalSummary: (a) => `读取文件 ${a.path}`,
  async run(args) {
    const p = String(args.path ?? '')
    const stat = fs.statSync(p)
    if (stat.isDirectory()) throw new Error('这是一个目录,请用 fs_list_dir')
    const limit = Math.min(Number(args.max_bytes) || MAX_READ_BYTES, 4 * 1024 * 1024)
    const fh = fs.openSync(p, 'r')
    const buf = Buffer.alloc(Math.min(stat.size, limit))
    fs.readSync(fh, buf, 0, buf.length, 0)
    fs.closeSync(fh)
    if (looksBinary(buf)) {
      return {
        textForModel: `${p} 是二进制文件(${fmtSize(stat.size)}),无法按文本读取。`,
        detail: { path: p, size: stat.size, binary: true }
      }
    }
    const text = decodeSmart(buf)
    const truncated = stat.size > limit
    return {
      textForModel: `文件 ${p}(${fmtSize(stat.size)}):\n${text}${truncated ? `\n...(已截断,原文件共 ${fmtSize(stat.size)})` : ''}`,
      detail: { path: p, size: stat.size, truncated }
    }
  }
}

export const fsWriteFile: ToolImpl = {
  name: 'fs_write_file',
  label: '写入文件',
  descForModel: '把文本内容写入文件(覆盖或新建),父目录不存在会自动创建。',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: '文件绝对路径' },
      content: { type: 'string', description: '要写入的完整文本内容' }
    },
    required: ['path', 'content']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `写入文件 ${a.path}`,
  async run(args) {
    const p = String(args.path ?? '')
    const content = String(args.content ?? '')
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, content, 'utf-8')
    return {
      textForModel: `已写入 ${p}(${fmtSize(Buffer.byteLength(content))})。`,
      detail: { path: p, bytes: Buffer.byteLength(content) }
    }
  }
}

export const fsMkdir: ToolImpl = {
  name: 'fs_mkdir',
  label: '创建目录',
  descForModel: '创建目录(含多级父目录)。',
  parameters: {
    type: 'object',
    properties: { path: { type: 'string', description: '目录绝对路径' } },
    required: ['path']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `创建目录 ${a.path}`,
  async run(args) {
    const p = String(args.path ?? '')
    fs.mkdirSync(p, { recursive: true })
    return { textForModel: `已创建目录 ${p}`, detail: { path: p } }
  }
}

export const fsMove: ToolImpl = {
  name: 'fs_move',
  label: '移动/重命名',
  descForModel: '移动或重命名文件/目录。目标位置已存在同名文件时会拒绝执行,不会覆盖。',
  parameters: {
    type: 'object',
    properties: {
      src: { type: 'string', description: '源路径' },
      dst: { type: 'string', description: '目标路径' }
    },
    required: ['src', 'dst']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `移动 ${a.src} → ${a.dst}`,
  async run(args) {
    const src = String(args.src ?? '')
    const dst = String(args.dst ?? '')
    // 不做静默覆盖:目标已存在时停下,让模型/用户决定改名还是先删除
    if (fs.existsSync(dst)) {
      return {
        textForModel: `目标已存在:${dst}。本次没有执行移动(拒绝覆盖)。可以换一个目标名,或先确认后再删除已有文件。`,
        detail: { src, dst, conflict: true }
      }
    }
    fs.mkdirSync(path.dirname(dst), { recursive: true })
    try {
      fs.renameSync(src, dst)
    } catch {
      fs.copyFileSync(src, dst)
      fs.rmSync(src)
    }
    return { textForModel: `已移动 ${src} → ${dst}`, detail: { src, dst } }
  }
}

export const fsDelete: ToolImpl = {
  name: 'fs_delete',
  label: '删除',
  descForModel: '删除文件或目录(目录会递归删除)。这是不可逆操作,会请求用户确认。',
  parameters: {
    type: 'object',
    properties: { path: { type: 'string', description: '要删除的路径' } },
    required: ['path']
  },
  risk: () => 'dangerous',
  approvalSummary: (a) => `删除 ${a.path}(不可恢复)`,
  async run(args) {
    const p = String(args.path ?? '')
    const guard = deleteGuard(p)
    if (guard) {
      const msg = `已拒绝删除「${p}」:受保护路径(${guard})。系统目录、盘符根目录、用户主目录与本应用审计数据不允许被删除。`
      return { textForModel: msg, detail: { path: p, blocked: true } }
    }
    const stat = fs.statSync(p)
    fs.rmSync(p, { recursive: true, force: true })
    return {
      textForModel: `已删除 ${p}(${stat.isDirectory() ? '目录' : fmtSize(stat.size)})。`,
      detail: { path: p }
    }
  }
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.data', '.cache', 'out', '$RECYCLE.BIN', 'System Volume Information'])

export const fsSearch: ToolImpl = {
  name: 'fs_search',
  label: '搜索文件',
  descForModel: '在目录下递归搜索:文件名或文本文件内容包含关键词的文件(跳过 node_modules 等)。',
  parameters: {
    type: 'object',
    properties: {
      dir: { type: 'string', description: '搜索起始目录' },
      keyword: { type: 'string', description: '关键词' },
      in_content: { type: 'boolean', description: '是否同时搜索文件内容,默认 true' }
    },
    required: ['dir', 'keyword']
  },
  risk: () => 'safe',
  approvalSummary: (a) => `在 ${a.dir} 中搜索 "${a.keyword}"`,
  async run(args) {
    const dir = String(args.dir ?? '')
    const kw = String(args.keyword ?? '').toLowerCase()
    const inContent = args.in_content !== false
    const hits: string[] = []
    const walk = (d: string, depth: number): void => {
      if (hits.length >= MAX_SEARCH_RESULTS || depth > 8) return
      let entries: fs.Dirent[]
      try {
        entries = fs.readdirSync(d, { withFileTypes: true })
      } catch {
        return
      }
      for (const e of entries) {
        if (hits.length >= MAX_SEARCH_RESULTS) return
        const full = path.join(d, e.name)
        if (e.isDirectory()) {
          if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) walk(full, depth + 1)
          continue
        }
        try {
          if (e.name.toLowerCase().includes(kw)) {
            hits.push(full)
            continue
          }
          if (inContent && fs.statSync(full).size <= 1024 * 1024 && /\.(txt|md|json|js|ts|css|html|csv|log|xml|yaml|yml|ini|bat|ps1|py|java|c|cpp|h|md)$/i.test(e.name)) {
            const buf = fs.readFileSync(full)
            if (!buf.includes(0) && buf.toString('utf-8').toLowerCase().includes(kw)) hits.push(full)
          }
        } catch {
          /* ignore */
        }
      }
    }
    walk(dir, 0)
    return {
      textForModel: hits.length
        ? `在 ${dir} 中找到 ${hits.length} 个匹配"${args.keyword}"的文件:\n${hits.join('\n')}`
        : `在 ${dir} 中没有找到匹配"${args.keyword}"的文件。`,
      detail: { dir, keyword: args.keyword, count: hits.length, hits }
    }
  }
}
