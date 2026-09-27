import { useState, type ReactNode } from 'react'
import { api } from './api'

/** 轻量 Markdown 渲染:代码块、标题、列表、表格、引用、链接、加粗/斜体/删除线。React 自动转义,无 XSS 面积。 */
export function Markdown({ text }: { text: string }): ReactNode {
  const parts = text.split('```')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <CodeBlock key={i} code={part.replace(/^[a-zA-Z0-9_+-]*\n/, '')} /> : <Blocks key={i} text={part} />
      )}
    </>
  )
}

// ---------- 代码块(带复制按钮) ----------

function CodeBlock({ code }: { code: string }): ReactNode {
  const [copied, setCopied] = useState(false)
  const copy = (): void => {
    navigator.clipboard.writeText(code.replace(/\n$/, '')).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      },
      () => undefined
    )
  }
  return (
    <pre className="code-block">
      <button className={`copy-btn ${copied ? 'done' : ''}`} onClick={copy} title="复制代码">
        {copied ? '✓ 已复制' : '复制'}
      </button>
      <code>{code}</code>
    </pre>
  )
}

// ---------- 块级解析 ----------

function Blocks({ text }: { text: string }): ReactNode {
  const lines = text.split('\n')
  const out: ReactNode[] = []
  let i = 0
  let key = 0
  const k = (): number => key++

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    // 标题
    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      const Tag = `h${Math.min(h[1].length + 2, 6)}` as 'h3'
      out.push(<Tag key={k()} className="md-h">{inline(h[2], k())}</Tag>)
      i++
      continue
    }
    // 分隔线
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push(<hr key={k()} className="md-hr" />)
      i++
      continue
    }
    // 表格:当前行含 |,下一行是分隔行
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]*-[\s:|-]*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitRow(lines[i++]))
      out.push(
        <div key={k()} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>{header.map((c, ci) => <th key={ci}>{inline(c, k())}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{inline(c, k())}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }
    // 引用
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''))
      out.push(
        <blockquote key={k()} className="md-quote">
          {inline(buf.join('\n'), k())}
        </blockquote>
      )
      continue
    }
    // 列表(支持按缩进嵌套)
    const li = /^\s*([-*+]|\d+[.)])\s+/.exec(line)
    if (li) {
      const items: { indent: number; ordered: boolean; text: string }[] = []
      while (i < lines.length) {
        const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i])
        if (m) {
          items.push({ indent: m[1].replace('\t', '  ').length, ordered: /\d/.test(m[2]), text: m[3] })
          i++
        } else if (lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && items.length) {
          items[items.length - 1].text += '\n' + lines[i].trim()
          i++
        } else break
      }
      out.push(<List key={k()} items={items} base={items[0].indent} />) // eslint-disable-line
      continue
    }
    // 普通段落:连续非空行
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      para.push(lines[i++])
    }
    if (para.length) out.push(<p key={k()} className="md-p">{inline(para.join('\n'), k())}</p>)
  }
  return <>{out}</>
}

function splitRow(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((c) => c.trim())
}

function List(props: { items: { indent: number; ordered: boolean; text: string }[]; base: number }): ReactNode {
  const { items, base } = props
  const out: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < items.length) {
    const it = items[i]
    if (it.indent < base) break
    // 收集当前项的子项
    const children: typeof items = []
    let j = i + 1
    while (j < items.length && items[j].indent > base) children.push(items[j++])
    out.push(
      <li key={key++}>
        {inline(it.text, key)}
        {children.length > 0 && <List items={children} base={children[0].indent} />}
      </li>
    )
    i = j
  }
  const Tag = (items[0]?.ordered ? 'ol' : 'ul') as 'ul'
  return <Tag className="md-list">{out}</Tag>
}

// ---------- 行内解析 ----------

const INLINE_RE =
  /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(~~[^~\n]+~~)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))|(https?:\/\/[^\s<>()\[\]】」』,，。;；]+)/g

function inline(text: string, keyBase: number): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  const pushPlain = (t: string): void => {
    nodes.push(...plainWithBreaks(t, keyBase * 100 + key))
  }
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) pushPlain(text.slice(last, m.index))
    key++
    const token = m[0]
    if (m[1]) {
      nodes.push(<code className="inline-code" key={`c${keyBase}-${key}`}>{token.slice(1, -1)}</code>)
    } else if (m[2] || m[3]) {
      nodes.push(<strong key={`b${keyBase}-${key}`}>{inline(token.slice(2, -2), keyBase + key)}</strong>)
    } else if (m[4]) {
      nodes.push(<del key={`d${keyBase}-${key}`}>{inline(token.slice(2, -2), keyBase + key)}</del>)
    } else if (m[5]) {
      nodes.push(<em key={`i${keyBase}-${key}`}>{inline(token.slice(1, -1), keyBase + key)}</em>)
    } else if (m[6]) {
      const mm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token)!
      nodes.push(<ExtLink key={`l${keyBase}-${key}`} href={mm[2]} text={mm[1]} />)
    } else if (m[7]) {
      nodes.push(<ExtLink key={`a${keyBase}-${key}`} href={token} text={token} />)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) pushPlain(text.slice(last))
  return nodes
}

function ExtLink({ href, text }: { href: string; text: string }): ReactNode {
  return (
    <a
      className="md-link"
      href={href}
      title={href}
      onClick={(e) => {
        e.preventDefault()
        void api.openExternal(href)
      }}
    >
      {text}
    </a>
  )
}

function plainWithBreaks(text: string, keyBase: number): ReactNode[] {
  const lines = text.split('\n')
  return lines.flatMap((line, i) => (i === 0 ? (line ? [line] : []) : [<br key={`br${keyBase}-${i}`} />, line]))
}
