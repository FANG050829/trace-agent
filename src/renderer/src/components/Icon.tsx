import type { CSSProperties, ReactNode } from 'react'

/**
 * 统一图标系统:1.5px 描边、16px 视觉网格、currentColor。
 * 全应用禁止 emoji / Unicode 字形充当图标,一律走这里。
 */

const PATHS: Record<string, ReactNode> = {
  // 品牌标记:一条事件轨迹(竖线 + 三个落点)
  mark: (
    <>
      <path d="M12 3v18" />
      <circle cx="12" cy="6.2" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" opacity="0.66" />
      <circle cx="12" cy="17.8" r="1.6" fill="currentColor" stroke="none" opacity="0.33" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  'arrow-down': <path d="M12 5v14M6 13l6 6 6-6" />,
  file: (
    <>
      <path d="M13.5 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V8z" />
      <path d="M13.5 3V8h5" />
    </>
  ),
  folder: <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z" />,
  folderOpen: <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9v1.5H5.2L3.5 17z M3.5 17l1.9-5h17l-2 7H5z" />,
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <path d="M7 9l3 3-3 3M12.5 15H17" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8A1.5 1.5 0 0 1 5 6.5h2.5L9 4.5h6l1.5 2H19A1.5 1.5 0 0 1 20.5 8v10A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z" />
      <circle cx="12" cy="12.8" r="3.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.3 4 5.2 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.2-4-8.5s1.4-6.2 4-8.5z" />
    </>
  ),
  appWindow: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <path d="M3 8.5h18M6.2 6.4h.01M8.6 6.4h.01" />
    </>
  ),
  wrench: <path d="M14.5 6.5a4 4 0 0 0-5.6 4.9L4 16.3V20h3.7l4.9-4.9a4 4 0 0 0 4.9-5.6l-2.8 2.8-2.4-2.4z" />,
  message: <path d="M4 6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 6v9a1.5 1.5 0 0 1-1.5 1.5H9l-4.2 3.6V6z" />,
  alert: (
    <>
      <path d="M12 3.8L21 19.5H3z" />
      <path d="M12 10v4M12 16.6v.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 7.8v.01" />
    </>
  ),
  download: <path d="M12 4v10M7.5 10.5L12 15l4.5-4.5M5 19h14" />,
  external: (
    <>
      <path d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M13.5 4.5H19.5V10.5M19 5l-8 8" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: <path d="M4 4l16 16M10 5.9A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7M6.6 6.6A16.6 16.6 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.5-.7M9.9 9.9a3 3 0 0 0 4.2 4.2" />,
  sliders: <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3M15 5.2v3.6M9 10.2v3.6M15 15.2v3.6" />,
  layout: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M9.5 9.5v10" />
    </>
  ),
  repeat: <path d="M4 9a5 5 0 0 1 5-5h9M15.5 1.5L18.5 4l-3 2.5M20 15a5 5 0 0 1-5 5H6M8.5 22.5L5.5 20l3-2.5" transform="translate(0 0.5) scale(0.98)" />,
  play: <path d="M8 5.5v13l10-6.5z" />,
  trash: <path d="M4.5 6.5h15M9 6.5V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8v1.7M6.5 6.5l1 12a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-12M10 10.5v5M14 10.5v5" />,
  pencil: <path d="M4 20l.8-3.8L16.6 4.4a1.8 1.8 0 0 1 2.6 0l.4.4a1.8 1.8 0 0 1 0 2.6L7.8 19.2z" />,
  send: <path d="M4.5 12L20 4.5 15 20l-3.8-5.7z M11.2 14.3L20 4.5" />,
  stop: <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" stroke="none" />,
  panelRight: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <path d="M14.5 4.5v15" />
    </>
  ),
  bookmark: <path d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5L12 16.5 5.5 20.5V5A1.5 1.5 0 0 1 7 3.5z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />,
  'arrow-right': <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />
}

export type IconName = keyof typeof PATHS | string

export function Icon({
  name,
  size = 16,
  className,
  style
}: {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
}): ReactNode {
  const path = PATHS[name] ?? PATHS.wrench
  return (
    <svg
      className={className}
      style={{ flexShrink: 0, ...style }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}

/** 工具名 → 图标(用于工具卡片与审计时间线) */
export function toolIconName(name: string): string {
  if (name === 'fs_list_dir') return 'folder'
  if (name === 'fs_search') return 'search'
  if (name.startsWith('fs_')) return 'file'
  if (name === 'run_command') return 'terminal'
  if (name === 'screenshot') return 'camera'
  if (name.startsWith('browser_')) return 'globe'
  if (name === 'window_list') return 'appWindow'
  return 'wrench'
}
