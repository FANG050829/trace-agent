import type { ToolImpl } from './index'

/**
 * 原生键鼠引擎(@nut-tree-fork/nut-js,N-API 预编译,无需 electron-rebuild)。
 * 懒加载:引擎缺失时工具给出可操作的中文错误,应用其余功能不受影响。
 * 所有会动真实键鼠的工具一律 confirm 风险级 —— 它们作用于用户正在使用的桌面。
 */

type NutModule = typeof import('@nut-tree-fork/nut-js')

let cached: NutModule | null | undefined

function getNut(): NutModule | null {
  if (cached === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      cached = require('@nut-tree-fork/nut-js') as NutModule
      cached.keyboard.config.autoDelayMs = 24
      cached.mouse.config.mouseSpeed = 1200
    } catch {
      cached = null
    }
  }
  return cached
}

const fail = (msg: string) => ({ textForModel: msg, detail: { error: msg } })
const needNut = () => {
  const nut = getNut()
  if (!nut) throw new Error('原生键鼠引擎未安装或加载失败(nut.js)。请重新安装依赖:npm install')
  return nut
}

const KEY_ALIASES: Record<string, string> = {
  enter: 'Enter',
  return: 'Enter',
  esc: 'Escape',
  escape: 'Escape',
  tab: 'Tab',
  space: 'Space',
  ctrl: 'LeftControl',
  control: 'LeftControl',
  alt: 'LeftAlt',
  shift: 'LeftShift',
  win: 'LeftWin',
  meta: 'LeftWin',
  cmd: 'LeftCmd',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  backspace: 'Backspace',
  delete: 'Delete',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  capslock: 'CapsLock',
  numlock: 'NumLock',
  printscreen: 'Print'
}

function keyOf(nut: NutModule, name: string): number | string {
  const key = KEY_ALIASES[name.toLowerCase()] ?? name
  const table = nut.Key as unknown as Record<string, number | string>
  const member = table[key] ?? table[name]
  if (member === undefined) {
    throw new Error(`不支持的键名:${name}(可用:Enter / Escape / Tab / up down left right / ctrl alt shift win / 字母数字 / F1-F12)`)
  }
  return member
}

export const inputScreenSize: ToolImpl = {
  name: 'input_screen_size',
  label: '查询屏幕尺寸',
  descForModel: '获取主屏幕的分辨率(宽×高,像素)。鼠标坐标以此为参照。',
  parameters: { type: 'object', properties: {} },
  risk: () => 'safe',
  approvalSummary: () => '查询屏幕尺寸',
  async run() {
    try {
      const nut = needNut()
      const w = await nut.screen.width()
      const h = await nut.screen.height()
      return { textForModel: `主屏幕分辨率:${w} x ${h}。鼠标坐标以屏幕左上角为原点。`, detail: { width: w, height: h } }
    } catch (e) {
      return fail(`查询失败:${(e as Error).message}`)
    }
  }
}

export const mouseMove: ToolImpl = {
  name: 'mouse_move',
  label: '移动鼠标',
  descForModel: '把鼠标移动到屏幕绝对坐标 (x, y)。配合截图使用:先截图确认目标位置再移动。',
  parameters: {
    type: 'object',
    properties: {
      x: { type: 'number', description: '目标 X 坐标(像素)' },
      y: { type: 'number', description: '目标 Y 坐标(像素)' }
    },
    required: ['x', 'y']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `移动鼠标到 (${a.x}, ${a.y})`,
  async run(args) {
    try {
      const x = Math.round(Number(args.x))
      const y = Math.round(Number(args.y))
      if (!Number.isFinite(x) || !Number.isFinite(y)) return fail('坐标必须是数字')
      const nut = needNut()
      await nut.mouse.move([new nut.Point(x, y)])
      return { textForModel: `鼠标已移动到 (${x}, ${y})。`, detail: { x, y } }
    } catch (e) {
      return fail(`移动失败:${(e as Error).message}`)
    }
  }
}

export const mouseClick: ToolImpl = {
  name: 'mouse_click',
  label: '鼠标点击',
  descForModel: '在当前鼠标位置(或指定的绝对坐标)点击。button: left/right/middle,double 为双击。作用于真实桌面,点击前请确认目标。',
  parameters: {
    type: 'object',
    properties: {
      x: { type: 'number', description: '可选,目标 X 坐标;不填在当前位置点击' },
      y: { type: 'number', description: '可选,目标 Y 坐标' },
      button: { type: 'string', description: 'left / right / middle,默认 left' },
      double: { type: 'boolean', description: '是否双击,默认否' }
    }
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `鼠标${a.double ? '双击' : '点击'}${a.button === 'right' ? '(右键)' : ''}${a.x !== undefined ? ` @(${a.x}, ${a.y})` : ''}`,
  async run(args) {
    try {
      const nut = needNut()
      const btn = args.button === 'right' ? nut.Button.RIGHT : args.button === 'middle' ? nut.Button.MIDDLE : nut.Button.LEFT
      if (args.x !== undefined && args.y !== undefined) {
        const x = Math.round(Number(args.x))
        const y = Math.round(Number(args.y))
        await nut.mouse.setPosition(new nut.Point(x, y))
      }
      if (args.double) await nut.mouse.doubleClick(btn)
      else await nut.mouse.click(btn)
      const pos = await nut.mouse.getPosition()
      const label = btn === nut.Button.RIGHT ? '右键' : btn === nut.Button.MIDDLE ? '中键' : '左键'
      return {
        textForModel: `已在 (${pos.x}, ${pos.y})${args.double ? '双击' : '单击'}(${label})。`,
        detail: { x: pos.x, y: pos.y, button: label, double: !!args.double }
      }
    } catch (e) {
      return fail(`点击失败:${(e as Error).message}`)
    }
  }
}

export const mouseScroll: ToolImpl = {
  name: 'mouse_scroll',
  label: '滚动滚轮',
  descForModel: '滚动鼠标滚轮。amount 为正向下滚、为负向上滚,单位约为一格。',
  parameters: {
    type: 'object',
    properties: { amount: { type: 'number', description: '滚动量,正=向下,负=向上' } },
    required: ['amount']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `滚动滚轮 ${a.amount} 格`,
  async run(args) {
    try {
      const amount = Math.round(Number(args.amount) || 0)
      if (!amount) return fail('滚动量必须是非零数字')
      const nut = needNut()
      if (amount > 0) await nut.mouse.scrollDown(amount)
      else await nut.mouse.scrollUp(-amount)
      return { textForModel: `已滚动 ${Math.abs(amount)} 格(${amount > 0 ? '向下' : '向上'})。`, detail: { amount } }
    } catch (e) {
      return fail(`滚动失败:${(e as Error).message}`)
    }
  }
}

export const keyTap: ToolImpl = {
  name: 'key_tap',
  label: '按键',
  descForModel: '按一次键盘键(可加修饰键)。key 如 Enter / Escape / Tab / up(方向键)/ a;modifiers 如 ["ctrl","shift"]。作用于真实桌面。',
  parameters: {
    type: 'object',
    properties: {
      key: { type: 'string', description: '键名' },
      modifiers: { type: 'array', items: { type: 'string' }, description: '可选,修饰键数组,如 ["ctrl"]' }
    },
    required: ['key']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `按键 ${Array.isArray(a.modifiers) && a.modifiers.length ? a.modifiers.join('+') + '+' : ''}${a.key}`,
  async run(args) {
    try {
      const nut = needNut()
      const keys: (number | string)[] = [keyOf(nut, String(args.key ?? ''))]
      const mods = Array.isArray(args.modifiers) ? (args.modifiers as string[]) : []
      for (const m of mods) keys.unshift(keyOf(nut, m))
      await (nut.keyboard.pressKey as (...k: unknown[]) => Promise<unknown>)(...keys)
      const label = `${mods.length ? mods.join('+') + '+' : ''}${String(args.key)}`
      return { textForModel: `已按下 ${label}。`, detail: { key: String(args.key), modifiers: mods } }
    } catch (e) {
      return fail(`按键失败:${(e as Error).message}`)
    }
  }
}

export const keyType: ToolImpl = {
  name: 'key_type',
  label: '输入文字',
  descForModel: '向当前焦点窗口模拟键入一段文字(作用于真实桌面,输入前请确认焦点在正确位置)。中文与符号均可。',
  parameters: {
    type: 'object',
    properties: { text: { type: 'string', description: '要键入的文字' } },
    required: ['text']
  },
  risk: () => 'confirm',
  approvalSummary: (a) => `键入文字:${String(a.text ?? '').slice(0, 60)}`,
  async run(args) {
    try {
      const text = String(args.text ?? '')
      if (!text) return fail('没有要输入的文字')
      await needNut().keyboard.type(text)
      return { textForModel: `已键入 ${text.length} 个字符。`, detail: { length: text.length } }
    } catch (e) {
      return fail(`输入失败:${(e as Error).message}`)
    }
  }
}
