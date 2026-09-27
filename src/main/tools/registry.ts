import type { ToolImpl } from './index'
import { toolCallSchemaOf } from './index'
import { fsListDir, fsReadFile, fsWriteFile, fsMkdir, fsMove, fsDelete, fsSearch } from './fs'
import { runCommand } from './command'
import { screenshotTool } from './screen'
import {
  browserLaunch,
  browserNavigate,
  browserExtract,
  browserClick,
  browserType,
  browserPressKey,
  browserScreenshot,
  browserClose
} from './browser'
import { windowList } from './windows'
import { inputScreenSize, mouseMove, mouseClick, mouseScroll, keyTap, keyType } from './native'

export const ALL_TOOLS: ToolImpl[] = [
  fsListDir,
  fsReadFile,
  fsWriteFile,
  fsMkdir,
  fsMove,
  fsDelete,
  fsSearch,
  runCommand,
  screenshotTool,
  windowList,
  browserLaunch,
  browserNavigate,
  browserExtract,
  browserClick,
  browserType,
  browserPressKey,
  browserScreenshot,
  browserClose,
  // 原生键鼠引擎
  inputScreenSize,
  mouseMove,
  mouseClick,
  mouseScroll,
  keyTap,
  keyType
]

export const TOOL_MAP = new Map(ALL_TOOLS.map((t) => [t.name, t]))

export const toolSchemas = ALL_TOOLS.map(toolCallSchemaOf)
