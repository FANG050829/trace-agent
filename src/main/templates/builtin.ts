import type { TemplateInfo, TemplateParam } from '@shared/types'

interface TemplateDef extends TemplateInfo {
  buildPrompt: (p: Record<string, string>) => string
}

const P = (key: string, label: string, type: TemplateParam['type'] = 'text', required = true, placeholder?: string): TemplateParam => ({
  key,
  label,
  type,
  required,
  placeholder
})

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'browser-open-shot',
    name: '打开网页并截图存档',
    desc: '用自动化浏览器打开指定网址,截图保存到会话记录,并简述页面内容。',
    category: '浏览器',
    params: [P('url', '网址', 'url')],
    buildPrompt: (p) =>
      `请用浏览器打开网页 ${p.url},等页面加载完成后,截取屏幕或页面截图保存,然后用两三句话告诉我这个页面上有什么。`
  },
  {
    id: 'web-extract',
    name: '网页正文采集存档',
    desc: '打开网页、提取正文,整理成 Markdown 文件保存到指定目录。',
    category: '浏览器',
    params: [P('url', '网址', 'url'), P('dir', '保存目录', 'dir', false, '留空则保存到桌面')],
    buildPrompt: (p) =>
      `请打开网页 ${p.url},提取页面正文内容,整理成一篇结构清晰的 Markdown 文档(以网页标题命名),保存到目录「${p.dir || '桌面'}」。保存后告诉我文件路径和文章大意。`
  },
  {
    id: 'download-cleanup',
    name: '下载文件夹整理',
    desc: '扫描目录里的文件,给出分类整理方案;你确认后它才会真正移动文件。',
    category: '文件整理',
    params: [P('dir', '要整理的目录', 'dir', false, '留空则整理「下载」文件夹')],
    buildPrompt: (p) =>
      `请帮我整理「${p.dir || '下载'}」文件夹:先列出文件清单(只读不改),按文件类型/用途提出分类方案(比如 图片/文档/安装包/压缩包/其他,各移到哪个子文件夹),把方案表格给我看。我确认后再执行移动,移动时不要覆盖同名文件。`
  },
  {
    id: 'batch-rename',
    name: '批量重命名文件',
    desc: '按你定的规则给一批文件改名,先给预览表再执行。',
    category: '文件整理',
    params: [P('dir', '文件所在目录', 'dir'), P('rule', '命名规则', undefined, true, '如:照片-序号 / 报告-日期')],
    buildPrompt: (p) =>
      `请把目录「${p.dir}」下的文件按规则「${p.rule}」批量重命名:先列出原文件名和新文件名的对照预览表等我确认,确认后再逐个执行,遇到重名要跳过并说明。`
  },
  {
    id: 'office-to-pdf',
    name: 'Word/WPS 文档批量转 PDF',
    desc: '用系统里的 Word 或 WPS,把目录下的 .docx/.doc 批量另存为 PDF。',
    category: '国产办公',
    params: [P('dir', '文档目录', 'dir')],
    buildPrompt: (p) =>
      `请把目录「${p.dir}」下所有 .docx 和 .doc 文档批量转换成 PDF,输出到该目录下的 pdf 子文件夹。建议用 PowerShell 调用 COM:先试 Word.Application,失败再用 KWPS.Application(WPS)。每个文档转换完要释放 COM 对象,最后给我成功/失败清单。`
  },
  {
    id: 'system-report',
    name: '电脑体检报告',
    desc: '只读收集磁盘、内存、进程、开机启动项等信息,生成一份体检报告存到桌面。',
    category: '系统',
    params: [],
    buildPrompt: () =>
      '请做一次电脑体检:用只读命令收集磁盘剩余空间、内存占用前 5 的进程、CPU 占用、开机启动项列表、系统已运行时长,汇总成一份简短的 Markdown 体检报告保存到桌面,并在对话里给我摘要。全程不要修改任何系统设置。'
  },
  {
    id: 'screenshot-ask',
    name: '看屏问答',
    desc: '截取当前屏幕,针对画面内容回答你的问题(需要视觉模型)。',
    category: '屏幕',
    badge: '需视觉模型',
    params: [P('question', '想问什么', undefined, false, '如:这个报错怎么解决?')],
    buildPrompt: (p) =>
      `请截一张当前屏幕的截图,然后回答:${p.question || '现在屏幕上显示的是什么内容?如果有需要处理的事项,请指出来。'}`
  },
  {
    id: 'wechat-send-msg',
    name: '微信给联系人发消息',
    desc: '激活微信窗口,搜索联系人并发送一条文字消息。模拟键盘操作,可能因窗口状态失败。',
    category: '国产应用',
    badge: '实验性',
    experimental: true,
    params: [P('contact', '联系人备注/昵称'), P('message', '要发送的消息')],
    buildPrompt: (p) =>
      `请通过模拟键盘操作给微信联系人「${p.contact}」发送消息:「${p.message}」。步骤:先用 window_list 确认微信(WeChat/Weixin)已打开;再用 PowerShell 的 WScript.Shell.AppActivate 激活微信主窗口,并发送 Ctrl+F 打开搜索、输入联系人名、回车选中、延迟后粘贴消息文本(Set-Clipboard + Ctrl+V)、回车发送。每一步之间要等待 1-2 秒,操作完成后截图验证;任何一步失败就立刻停下告诉我,不要反复重试。`
  }
]

export const TEMPLATE_INFOS: TemplateInfo[] = TEMPLATES.map(({ buildPrompt: _b, ...info }) => info)

export function instantiateTemplate(id: string, params: Record<string, string>): { prompt: string } {
  const t = TEMPLATES.find((x) => x.id === id)
  if (!t) throw new Error(`模板不存在:${id}`)
  for (const param of t.params) {
    if (param.required && !params[param.key]?.trim()) {
      throw new Error(`请填写「${param.label}」`)
    }
  }
  return { prompt: t.buildPrompt(params) }
}
