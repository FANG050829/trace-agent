import { desktopCapturer, screen } from 'electron'
import type { ToolImpl } from './index'

/** 截取主屏幕,保存到会话目录并可回传给视觉模型 */
export const screenshotTool: ToolImpl = {
  name: 'screenshot',
  label: '屏幕截图',
  descForModel: '截取当前主屏幕画面。截完后你(如果所用模型支持图片)会直接"看到"截图内容。',
  parameters: { type: 'object', properties: {} },
  risk: () => 'safe',
  approvalSummary: () => '截取屏幕',
  async run(_args, ctx) {
    const display = screen.getPrimaryDisplay()
    const cap = (n: number, max: number) => Math.min(Math.round(n * display.scaleFactor), max)
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: cap(display.size.width, 1920), height: cap(display.size.height, 1080) }
    })
    if (!sources.length) throw new Error('没有可用的屏幕捕获源')
    const source = sources.find((s) => s.display_id === String(display.id)) ?? sources[0]
    const png = source.thumbnail.toPNG()
    const size = source.thumbnail.getSize()
    const shotFile = ctx.audit.saveShot(png)
    return {
      textForModel: `已截取屏幕并保存为 ${shotFile}(${size.width}x${size.height})。`,
      shotFile,
      imageDataUrl: `data:image/png;base64,${png.toString('base64')}`,
      detail: { width: size.width, height: size.height }
    }
  }
}
