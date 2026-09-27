import type { ToolImpl } from './index'
import { runCommand } from './command'

/** 枚举有窗口的进程,供 agent 了解当前打开了哪些应用窗口 */
export const windowList: ToolImpl = {
  name: 'window_list',
  label: '查看窗口',
  descForModel: '列出当前屏幕上打开的应用窗口(进程名、标题),用于了解用户桌面状态。',
  parameters: { type: 'object', properties: {} },
  risk: () => 'safe',
  approvalSummary: () => '查看打开的窗口列表',
  async run() {
    const r = await runCommand.run(
      {
        command:
          "Get-Process | Where-Object { $_.MainWindowTitle } | Select-Object ProcessName, Id, MainWindowTitle | ConvertTo-Json -Compress"
      },
      { sessionId: 'system', audit: null as never, settings: null as never }
    )
    const text = r.textForModel
    let rows: { ProcessName: string; Id: number; MainWindowTitle: string }[] = []
    try {
      const start = text.indexOf('[') >= 0 ? text.indexOf('[') : text.indexOf('{')
      const json = JSON.parse(text.slice(start, text.lastIndexOf('}') + 1).replace(/}\s*{/g, '},{'))
      rows = Array.isArray(json) ? json : [json]
    } catch {
      /* 解析失败就原样返回 */
    }
    const lines = rows.map((w) => `- ${w.ProcessName}(pid ${w.Id}):${w.MainWindowTitle}`)
    return {
      textForModel: lines.length ? `当前打开的窗口:\n${lines.join('\n')}` : text,
      detail: { windows: rows }
    }
  }
}
