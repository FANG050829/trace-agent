---
name: 留痕 Agent
description: 工程石墨深色的桌面审计仪器——每一步都被记录、可扫读、可查证、可归档；应用与介绍页共享同一视觉世界
colors:
  window-base: "#0d0e11"
  code-well: "#0a0b0d"
  panel: "#141519"
  raised: "#1a1c21"
  hover: "#22242b"
  hairline: "#26282e"
  hairline-strong: "#35383f"
  ink: "#e8e9ec"
  ink-secondary: "#a6abb5"
  ink-tertiary: "#7f8490"
  steel-blue: "#6c9ee6"
  steel-blue-dim: "rgba(108, 158, 230, 0.14)"
  steel-blue-hover: "#8fb4ec"
  ok-green: "#58b380"
  warn-amber: "#d9a850"
  err-red: "#e07a7a"
  tool-teal: "#5fb3a3"
  press-white: "#ffffff"
  press-black: "#101114"
  overlay-scrim: "rgba(8, 9, 12, 0.7)"
typography:
  title:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.01em"
  heading:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.6
  subheading:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  control:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.6
  micro:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.4
  mono-data:
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, 'Courier New', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.55
  web-display:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "clamp(36px, 5.2vw, 58px)"
    fontWeight: 650
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  web-headline:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "clamp(26px, 3.4vw, 36px)"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  web-title:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: "1.75"
  web-body:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.75
  web-label:
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, 'Courier New', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.8"
    letterSpacing: "normal"
rounded:
  xs: "4px"
  sm: "5px"
  md: "6px"
  lg: "8px"
components:
  button-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
  button-default-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.press-black}"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
  button-primary-hover:
    backgroundColor: "{colors.press-white}"
  input-text:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
  chip-status:
    textColor: "{colors.ink-tertiary}"
  modal:
    backgroundColor: "{colors.panel}"
    rounded: "10px"
    padding: "18px 20px"
  web-button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.press-black}"
    rounded: "{rounded.sm}"
    padding: "7px 16px"
  web-button-primary-hover:
    backgroundColor: "{colors.press-white}"
    textColor: "{colors.press-black}"
  web-button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
    padding: "7px 16px"
  web-filter-idle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.xs}"
    padding: "2px 9px"
  web-filter-active:
    backgroundColor: "{colors.steel-blue-dim}"
    textColor: "{colors.steel-blue}"
    rounded: "{rounded.xs}"
    padding: "2px 9px"
  web-mono-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.xs}"
    padding: "2px 9px"
---

# Design System: 留痕 Agent

本文件记录一个共享的工程石墨世界与它的两个表面。**第一部分是桌面应用（renderer）的定稿系统，原文保留**；**第二部分是介绍页 `index.html` 在同一世界上的阅读距离延伸与专属组件**——同一套 token 与图标规范，分歧处（正文字号、按钮内距、脉冲节奏等）以各自 build 为准，延伸值随文标注。

---

## Part 1 · 桌面应用 —「审计仪器」

**Creative North Star: "审计仪器" (The Audit Instrument)**

这个界面是一台常驻桌边的仪器,不是聊天玩具。视觉系统的首要职责是让"每一步都被记录"成为常驻的视觉事实:三栏等高共存,审计时间线与对话同屏,状态(空闲/执行中/待确认)永远可扫读。密度对标 VS Code、Linear 深色主题的工艺水准——13px 紧凑正文、1px 发丝线分隔、零装饰、原生桌面预期。

品牌感存在于精确的细节里:等宽时间戳列对齐、审计行的类型色点、新事件落位时一次性的"留痕脉冲"。没有渐变、发光、玻璃拟态、彩色药丸,也没有 emoji。唯一的强调色钢蓝被限制在焦点/链接/激活三处语义;视觉权重不靠颜色,靠全应用唯一的反色主按钮(白底黑字)承担。信息密度优先于表达欲。

导出的 HTML 审计报告与界面同一血统:复用同一套石墨色阶、类型色点与发丝线,不允许出现第二种视觉语言。

**Key Characteristics:**

- 三栏仪器布局:240px 侧栏 / 弹性对话列(助手回复 ≤72ch)/ 320px 审计时间线
- 中性石墨色阶(#0a0b0d–#22242b)+ 墨白三级文字
- 全部结构线为 1px 发丝线;静态版面零阴影
- 钢蓝 #6c9ee6 只做焦点/链接/激活;主按钮白底黑字反色
- 统一 1.5px 描边 SVG 图标系统,零 emoji
- 等宽字体只承载数据:时间戳、路径、代码、参数、计数
- 状态 = 色点 + 文字;脉冲节奏区分执行中(1.6s)与待确认(0.7s)

### Colors

中性石墨打底、语义色只做状态标记、钢蓝做唯一强调——颜色在这台仪器上是读数,不是装饰。

#### Primary

- **钢蓝 Steel Blue** (#6c9ee6,弱化态 rgba(108,158,230,0.14),悬亮 #8fb4ec):唯一强调色。用于焦点环(`:focus-visible` 1px 描边)、输入框/文本域聚焦边框、链接文字与下划线、导航激活图标、选中卡片描边、流式光标、用户消息色点,以及留痕脉冲的沉降底色(14% 弱化态)。从不做大面积底色,从不用于普通图标或标题。

#### Secondary

语义状态色,只出现在色点、文字、描边与徽标上,一律不做底色填充(弱化态描边/底纹除外):

- **完成绿 OK Green** (#58b380):成功、已批准状态("完成"chip、复制成功反馈)。
- **警示琥珀 Warn Amber** (#d9a850):待确认、已拒绝、敏感操作;审批卡描边与标题("等待确认"的脉冲点、风险徽标)。
- **错误红 Err Red** (#e07a7a):错误与不可逆操作;错误卡片描边、危险按钮描边与文字。
- **工具青 Tool Teal** (#5fb3a3):"执行中"状态点与工具调用色点——它的语义是"agent 正在干活",不是装饰色。

#### Neutral

石墨色阶,自上而下承担全部表面与文字层次:

- **墨 Ink** (#e8e9ec):正文、标题、反色主按钮的底色、助手消息色点。
- **墨二级 Ink Secondary** (#a6abb5):次级文字、工具参数、引用块。
- **墨三级 Ink Tertiary** (#7f8490):占位符、时间戳、标签、说明与空态文字。
- **窗底 Window Base** (#0d0e11):窗口底色、侧栏搜索框内嵌底。
- **面板 Panel** (#141519):侧栏、顶栏、审计面板、卡片、模态框。
- **浮起 Raised** (#1a1c21):悬停面、用户气泡、toast、表格头部。
- **悬停 Hover** (#22242b):控件悬停底、激活筛选片。
- **代码井 Code Well** (#0a0b0d):代码块、参数 JSON、审计详情的深底。
- **发丝线 Hairline** (#26282e) / **强线 Hairline Strong** (#35383f):1px 分隔线与控件描边,常规场景用前者、强调场景用后者。
- **按压白/黑 Press White/Black** (#ffffff / #101114):反色主按钮的 hover 底色与文字。

#### Named Rules

**反色权重规则(The Inverted Weight Rule)。** 全应用唯一的"重"按钮是主按钮:白底(#e8e9ec,hover 纯白 #ffffff)黑字(#101114)加粗。其余按钮一律透明底 + 细描边。权重感来自反差,不来自彩色。

**钢蓝三处规则(The One Voice Rule)。** 钢蓝只出现在焦点、链接、激活三处语义,外加留痕脉冲这一处动态反馈。把它用于装饰、标题或大面积填充都是违规;任何屏幕上它都只是零星读数。

### Typography

**Display Font:** Segoe UI Variable Text(兜底 Segoe UI → Microsoft YaHei UI → Microsoft YaHei → system-ui)
**Body Font:** 同上(单一系统栈,无第二字族)
**Label/Mono Font:** Cascadia Code(兜底 Cascadia Mono → Consolas → Courier New)

**Character:** 纯系统字族的工程感——无衬线正文承载中文界面,紧凑字号建立仪器密度;Cascadia 等宽专门负责"可核对的数据",全部配 `font-variant-numeric: tabular-nums` 保证时间戳列对齐。

#### Hierarchy

- **Title** (600, 16px, 1.25):欢迎页标题——全应用最大的字,也只大这么一点。
- **Heading** (600, 15px):页面标题(模板库/技能库/设置/崩溃页)。
- **Subheading** (600, 14px, 1.4):消息内 Markdown 标题、模态框标题。
- **Body** (400, 13px, 1.6;助手回复 1.7):基准正文;助手回复列宽 ≤72ch。
- **Control** (400, 12.5px):按钮、输入框、表格、次级说明——控件层统一字号;小号按钮 12px。
- **Caption** (400, 11.5px):状态文字、审计行文字、参数预览、导航说明。
- **Micro** (400, 10–11px):时间戳(等宽 10–10.5px)、徽标、页脚路径、侧栏导航标签(唯一带 0.08em 字距的特例)。
- **Mono Data** (400, 10–12px, 1.55):代码块 12px、参数 JSON 11.5px、模型徽章 11px、时间戳 10–10.5px、页脚路径 10px。

#### Named Rules

**等宽即数据规则(The Mono Is Data Rule)。** 等宽字体只用于时间戳、路径、会话 ID、代码、参数 JSON 与计数,且必须带 tabular-nums;绝不用于界面文案、标题或正文。

### Layout

固定视口的三栏仪器:应用占满 100vh 且页面本身不滚动(`overflow: hidden`),每栏独立滚动。左侧栏固定 240px(字标 + 全宽新建按钮 + 内嵌搜索 + 会话列表 + 底部资源导航);中部主区弹性伸展,顶部 46px 状态栏(面包屑 + 等宽模型徽章 + 状态点 + 面板开关);右侧审计时间线固定 320px,可用 Ctrl+B 开合。窄窗口 ≤1100px 时只做一处降级:隐藏模型徽章,让位给标题。

对话列:助手消息最大 72ch,用户气泡最大 72% 宽、右对齐;聊天区上下留白 22px/26px;输入栏吸底,发送/停止按钮固定右下。整页视图(模板/技能/设置)统一内边距 26px 32px 60px,设置页限宽 840px。模板网格 `repeat(auto-fill, minmax(280px, 1fr))`,间距 10px;设置表单双列网格,列距 10px 行距 14px。

间距无令牌刻度,靠 4px 基数的微节奏:元素间隙以 4/5/6/8/10/12/16px 递进,组件内边距 5–15px。密度恒定,不为任何页面放松。

### Elevation & Depth

平面优先。静态版面的层次全部由色阶(窗底 → 面板 → 浮起 → 悬停四级)与 1px 发丝线表达,没有任何装饰性阴影。box-shadow 只出现在三种脱离文档流的浮层上:回到底部按钮(0 6px 20px rgba(0,0,0,0.45))、toast(0 8px 28px rgba(0,0,0,0.5))、模态框(0 16px 48px rgba(0,0,0,0.5))——深色、大模糊、纯黑投影,作用是把浮层从版面上"托"出来,而非制造高级感。模态遮罩为 rgba(8,9,12,0.7) 纯色压暗,无 backdrop-filter。

#### Shadow Vocabulary

- **float-low** (`box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45)`):悬浮的"回到底部"胶囊按钮。
- **float-toast** (`box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5)`):底部居中 toast。
- **float-modal** (`box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5)`):居中模态框。

#### Named Rules

**悬浮才投影规则(Shadow Only What Floats)。** 只有脱离文档流的浮层(模态、toast、悬浮按钮)允许 box-shadow;静态版面上的卡片、面板、卡片悬停一律零阴影,靠色阶与发丝线分层。

### Shapes

圆角克制且分档明确:微型元素(徽标、筛选片、审计行)4px;按钮与输入框 5px;默认容器(工具卡、模板卡、设置分区、代码块)6px;重要容器(审批卡、欢迎示例组、输入框文本域)8px;模态框 10px 为唯一的大圆角特例。正圆只属于"点":状态点 7px、chip 前置点 5px、审计色点 5px、滚动条 5px 胶囊。

边框语言是"发丝线纪律":全部结构线与描边都是 1px,全系统只有两个线色(发丝线 #26282e 常规、强线 #35383f 强调);没有 2px 边框,没有彩色左/右边条——引用块与思考过程的左轨只用中性线色。悬停反馈优先换底色或加深描边,不位移、不缩放。

#### Named Rules

**发丝线纪律(The Hairline Discipline)。** 一切分隔与描边都是 1px,只准用 #26282e 与 #35383f 两个灰阶;彩色只能出现在状态描边的弱化态(如审批卡 40% 琥珀),永远不做 2px 彩条。

### Components

#### Buttons

- **Shape:** 5px 圆角,1px 描边,内边距 5px 12px,字号 12.5px;小号 3px 9px / 12px。
- **Default:** 透明底 + 强线描边 + 墨二级文字;hover 换悬停底 #22242b、文字提亮为墨白。
- **Primary:** 反色白底黑字(#e8e9ec 底 / #101114 字 / 600 加粗),hover 变纯白;disabled 退成悬停灰底 + 墨三级字。全应用唯一重按钮,只给"发送""批准执行""保存技能"这类主动作。
- **Ghost / Icon:** ghost 透明描边,hover 才浮现底色;icon-btn 只包图标,默认墨三级。
- **Danger:** danger-outline(红 50% 描边 + 红字,hover 红底 10%);stop-btn 同族但 600 加粗,表示"中止正在执行的任务"。
- **Focus / Transition:** `:focus-visible` 1px 钢蓝描边 offset 1px;所有状态过渡 0.12s ease-out。
- **Disabled:** opacity 0.38,not-allowed。

#### Inputs / Fields

- **Style:** 面板底 #141519 + 1px 发丝线 + 5px 圆角,内边距 6px 10px,12.5px;文本域用 8px 圆角、13.5px、吸底输入栏内最大高 160px 自适应。
- **Focus:** 边框变钢蓝,无发光、无阴影;插入符 caret 钢蓝,选区 rgba(108,158,230,0.32)。
- **Placeholder:** 墨三级;错误态由文案与红字提示承担,输入框本身不变红。

#### Status Chips & Dots

- **Style:** 状态 = 5px 圆点 + 同色文字(currentColor),无底、无胶囊;风险徽标是 3px 圆角的琥珀描边小标签("敏感操作/不可逆操作")。
- **State:** 完成绿 / 出错红 / 已拒绝与等待确认琥珀;等待与不可逆的点以 1s 脉冲。顶栏状态点三态节奏:空闲静止(墨三级)/ 执行中(工具青,1.6s 慢脉)/ 待确认(琥珀,0.7s 急脉)。

#### Tool Card

- **Shape:** 1px 发丝线 + 6px 圆角 + 面板底,通栏 ≤72ch。
- **Anatomy:** 头行 = 工具图标(墨三级)+ 工具名(500)+ 状态 chip + 90° 旋转的 chevron;点击展开"调用参数 / 执行结果"两段等宽 JSON,落在代码井底。
- **State:** 错误时整卡描边染红(35% 琥珀为"已拒绝");截图结果全宽展示、点击放大;调用中显示钢蓝旋转指示 + "正在调用 X"。

#### Approval Card

- **Shape:** 8px 圆角,琥珀 40% 描边,面板底,内边距 13px 15px。
- **Anatomy:** 标题行(alert 图标 + 琥珀 600 "需要你的确认")→ 工具名 + 风险 chip → 加粗摘要 → 等宽参数井(最大高 160px)→ 动作行。
- **Actions:** 主按钮"批准执行" + 红描边"拒绝"——批准与拒绝在视觉上不等权,反色按钮永远站在"放行"一侧。

#### Audit Timeline Item(签名交互)

- **Row:** 等宽时间戳(10px,墨三级)+ 类型色点(5px:用户钢蓝/回复墨白/工具青/审批琥珀/错误红/系统强线灰)+ 单行截断文本(11.5px);点击展开等宽详情(≤3000 字符,代码井底)。
- **Signature Motion — 留痕脉冲:** 挂载后新落位的事件播放一次 `trail-settle` 0.9s ease-out(钢蓝弱化底 14% → 透明)后沉降,不残留高亮;打开历史会话不触发,避免满屏闪烁。
- **Foot:** 面板底部常驻等宽小字展示追加写入路径(`.data/sessions/{id}/audit.jsonl`),提醒日志是落盘事实。

#### Cards / Containers

- **Corner Style:** 6px 默认,8px 重要容器;内部再无嵌套圆角堆叠。
- **Background:** 面板底;设置页供应商卡用窗底做出内嵌层次。
- **Border:** 1px 发丝线;hover 加深为强线;选中(策略卡/供应商卡/模板卡展开)描边染钢蓝,策略卡额外叠 14% 钢蓝底。
- **Shadow Strategy:** 永远无(见 Elevation)。
- **Internal Padding:** 卡片 11–15px;分区标题 600 与说明文字(墨二级/三级)之间只留 3–5px。

#### Navigation

- **Sidebar(240px):** 品牌行 = mark 图标(20px,墨白,事件轨迹母题)+ 字标(13.5px/600)+ 副题(11px 墨三级);新建会话为全宽默认按钮;会话项 active = 浮起底 + 强线描边,时间戳等宽 10.5px;底部资源导航文字按钮,active 时底色浮起且图标染钢蓝——钢蓝在导航里只出现在图标上,不染文字。
- **Topbar(46px):** 面包屑 600 13px 单行截断;右侧依次为等宽模型徽章(描边小胶囊)、三态状态点 + 状态文字、面板开关 ghost 按钮。
- **Mobile:** 桌面应用无移动形态;仅 1100px 断点隐藏模型徽章。

#### Modal & Toast

模态:纯色遮罩 rgba(8,9,12,0.7),540px 面板底、10px 圆角、强线描边、float-modal 投影;动作行右对齐,取消 ghost + 主按钮收尾。Toast:底部居中、浮起底 + 强线描边 + float-toast 投影,2.6s 自动消失,不做彩色语义变体。

### Do's and Don'ts(应用)

#### Do:

- **Do** 用 Icon.tsx 的统一 SVG 图标系统(24 viewBox / 1.5px 描边 / currentColor / 圆头圆角);新图标先查现有 PATHS,工具名一律走 `toolIconName` 映射。
- **Do** 状态一律"色点 + 文字":等待与不可逆操作的点要脉冲;顶栏三态节奏(静止 / 1.6s / 0.7s)不得改动。
- **Do** 分隔用 1px 发丝线(常规 #26282e,强调 #35383f);引用块与思考过程左轨只用中性线色。
- **Do** 给交互反馈统一 0.12s ease-out 过渡;给等宽数据统一加 tabular-nums。
- **Do** 让导出的审计报告复用界面令牌:同一套石墨色阶、类型色点、发丝线,改 styles.css 时同步 exportReport.ts。
- **Do** 只给浮层(模态/toast/悬浮按钮)加深色大投影 rgba(0,0,0,0.45–0.5)。

#### Don't:

- **Don't** 用 emoji 或 Unicode 字形充当图标——一律走 SVG 图标系统(用户钉死)。
- **Don't** 用发光、渐变、玻璃拟态、紫蓝"AI 风";唯一允许的透明度渐变是思考流底部功能性淡出的 mask。
- **Don't** 用彩色左/右边条(2px 彩色 border-left/right)标记卡片、列表项或告警。
- **Don't** 用彩色药丸底表示状态;状态是点,不是胶囊。
- **Don't** 让钢蓝出现在焦点/链接/激活/留痕脉冲之外的语义,或作大面积填充;权重交给反色主按钮。
- **Don't** 把等宽字体用于界面文案,也不要在静态版面上加阴影。

---

## Part 2 · 介绍页 index.html —「审计台账」

**Creative North Star: 「工程石墨 · 审计台账」 (The Graphite Audit Ledger)**

介绍页不是一张"营销页"，而是一台可以被亲眼核对的仪器。访客落地的第一屏就是一段实时留痕的自动化任务：左边对话流在跑，右边审计时间线在追加，一条审批请求停下来等访客亲手批准或拒绝。整个视觉世界为这种"机制先于文案"的姿态服务——工程石墨深色、1px 发丝线、钢蓝只出现在焦点/链接/激活态，工艺基准对标 VS Code / Linear 的深色主题。

密度优先于表达欲：正文行高 1.75、段落限宽（640–680px / 62ch），区块之间用整宽发丝线分隔而不是卡片海。所有窗口类组件（演示窗、代码卡、终端卡）都遵循与 Part 1 相同的"窗框语法"：`line-strong` 外框 + `line` 内缝。色彩上钢蓝是唯一的中性色之外的"声音"（**遵守 Part 1 的钢蓝三处规则**），其余颜色全部是执行语义。

### Colors（相对 Part 1 的延伸）

- token 与应用同源同名（介绍页 `:root` 里是 `--bg0/--line/--accent`……，对应 Part 1 的 window-base/hairline/steel-blue 等，值一致；`--teal` #5fb3a3 即应用的 tool-teal）。
- **轨迹青 Tool Teal 的延伸语义**：除"执行中状态点"外，在介绍页的代码井里承担字符串值与 PowerShell 提示符的语法色（`--teal` 在 bg-code 上对比度约 7.9:1）。
- 墨阶新增一条世界级规则——**墨阶规则(The Ink Ladder Rule)**：文字只从三级墨阶取色（`ink` 正文与强调 / `ink-2` 次级与描述 / `ink-3` 元数据），强调永远用 600 字重 + 提亮到 `ink`，不引入新颜色。
- **状态四色规则(The Status Quartet Rule)**：ok/warn/err/teal 四色只标注执行语义（状态点、判定文字、风险分级、代码语法），从不做装饰、不做品牌色、不用于正文文字。

### Typography（阅读距离延伸）

同一二元字族结构（Segoe/雅黑 + Cascadia，Part 1 的等宽即数据规则全效），但面向"读"拉开层级：

- **Display** (650, clamp(36px, 5.2vw, 58px), 1.18, -0.02em, `text-wrap: balance`, max-width 18em)：首屏一句话主张，全页唯一。
- **Headline** (650, clamp(26px, 3.4vw, 36px), 1.3, -0.01em)：各区块 h2，一节一句。
- **Title** (650, 17px)：分组小标题 h3。
- **Lead** (400, 16.5px, `text-wrap: pretty`, max-width 680px/640px)：区块导语与首屏副文，用 `ink-2`。
- **Body** (400, 15.5px, 1.75；≤520px 时 15px)：正文基准（应用为 13px——阅读距离分歧，各自成立）。
- **UI Small** (400/600, 13.5px；演示窗内部 12.5–13px)：按钮、导航、对话气泡、表格体。
- **Label/Mono** (400, 11–12.5px, `tabular-nums`)：时间戳、路径、JSON、命令、计数徽标、版本号、注脚。

字重四档：400 正文 / 500 表头 / 600 强调与次按钮 / 650 标题。

### Layout（单列长页 + 整宽"机制窗"）

`.wrap` 容器 max-width 1200px，左右 padding `clamp(20px, 4.5vw, 48px)`。区块之间靠发丝线：每节 `border-top: 1px solid var(--line)`，节内 padding-block `clamp(68px, 9vw, 116px)`；首屏 hero 免顶线，padding-top `clamp(52px, 7vw, 88px)`；节头下边距 `clamp(36px, 5vw, 56px)`；标题上方留白恒大于下方。

- **首屏**：细导航（sticky，60px，bg0 底 + 底部发丝线；全局 `scroll-padding-top: 76px`）→ 左列一句话主张 + 两个动作 + 等宽元数据行 → 下方整宽演示窗（`.demo-body` 双栏 1.05fr / 0.95fr，高 500px，左对话流右审计时间线，各栏独立滚动）。
- **台账式行**（审批门/能力/边界共用）：grid `250px / minmax(0,1fr)`（能力节 220px），列距 20px 40px，行 padding 26px 0、底部发丝线；左列"色点 + 等宽英文关键词 + 中文关键词"，右列说明文 max-width 62ch。
- **双栏 split**（时间线与报告 `5fr/7fr`、快速开始 `7fr/5fr`）：gap `clamp(36px, 5vw, 64px)`，顶部对齐。
- **断点**：980px——导航锚点隐藏、演示窗竖排（对话 380px + 时间线 460px）、split/台账全部塌成单栏；520px——正文降至 15px、首屏按钮拉满宽、表格首列隐藏、事件行收窄。

### Elevation（同族更轻的两档浮层影）

遵守 Part 1 的悬浮才投影规则，介绍页只有两档黑色环境影：**浮层-低** `0 6px 18px rgba(0,0,0,0.35)`（"回到底部"悬浮控件）、**浮层-中** `0 10px 28px rgba(0,0,0,0.4)`（toast）。静态表面零阴影。

### Shapes

圆角四阶复用：4px（迷你标签、过滤钮）、5px（按钮）、6px（代码 pre、工具调用片、toast）、8px（演示窗、代码卡、终端卡、审批卡、用户气泡）。全页唯一的 999px 全圆属于"回到底部"浮层控件，不是标签形制。线形二分同 Part 1：`line` 做内缝与节奏线，`line-strong` 做外框与交互描边。滚动条 8px、thumb #2c2f36（应用为 10px/5px，同色系）。

### Components

- **Buttons**：5px 圆角、1px 描边、gap 7px 可带 13–15px 图标、过渡 0.12s；Primary（全页唯一重按钮）`ink` 底 / `press-black` 字 / 600 / padding 7px 16px，hover 提亮为 `press-white`；Secondary 透明底 / `line-strong` 边 / `ink-2` 字，hover `bg3` 底；sm 12.5px、5px 12px；disabled opacity .38。
- **Status Dots**：7px 圆点 + 12px 文字（台账分级点 8px）。idle=`ink-3` 静止；run=`teal` 脉冲 1.6s（与应用一致）；wait=`warn` 脉冲 1s（应用 0.7s——页面阅读节奏的分歧值）。状态永远"点 + 文字"。
- **Mono Tags / Chips**：等宽 11–12px、`ink-3` 字、1px `line` 边、4px 圆角：版本号、会话标签、审批策略标签（琥珀变体：`warn` 字 + rgba(217,168,80,.35) 边）、计数徽标（`bg3` 底无边）、风险词（无边、语义色文字）。
- **Filter Segments**：12px、4px 圆角、无边框透明底；idle `ink-3`，hover `ink` + `bg3`，激活（`aria-pressed`）`accent` 字 + `accent-dim` 底（钢蓝的激活态语义，合规）。
- **Ledger Row（台账式行——介绍页签名组件）**：左列"8px 语义色点 + 等宽英文关键词 + 600 中文关键词"，右列 `ink-2` 说明文（62ch）内嵌 mono 词片；底部发丝线，26px 行距。
- **Demo Window（活体演示窗——首屏签名组件）**：`line-strong` 外框 + 8px 圆角 + `bg1` 底 + overflow hidden；标题栏（46px，`bg2`）含品牌标记、mono 会话标签、状态点、重播；主体双栏——左对话流（用户气泡 = 石墨 `bg2` + `line-strong` 边 + 8px 圆角，**非彩色**（应用内的钢蓝用户色点在此收敛为石墨气泡，finish review 落地）；助手消息裸排 `ink-2`；工具调用片 = 代码井底 mono 片）与审批卡（`bg2` 底、`line-strong` 边、头部琥珀图标 + mono 策略标签、mono 命令原文、批准/拒绝；已决议降透明 .62 并替换判定行）；右审计时间线（计数徽标 + 过滤段 + 导出按钮；事件行 = mono 时间戳 + 类型图标 + 摘要 + 旋转 chevron，点击展开 JSON pre；底部 mono 脚注标注审计路径）。事件入场 0.28s ease-out 上浮（`prefers-reduced-motion` 下全部关闭）。
- **Code Window（代码卡 / 终端卡）**：代码井 `bg-code` 底 + `line-strong` 外框 + 8px 圆角；头部 mono 12px + `ink-3` 注记；pre 12.5–13px、行高 1.85–2、`tabular-nums`。语法只用墨阶 + teal：键/命令=`ink`，字符串/提示符=`teal`，注释=`ink-3`。
- **Toast**：固定底部居中、`bg2` 底、`line-strong` 边、6px 圆角、浮层-中阴影，0.18s 淡入上移，2.6s 自动消失，`role="status"`。
- **Icons**：与 Part 1 完全同规范——SVG `<symbol>` 表、24 viewBox、1.5px 描边、round cap/join、`currentColor`（品牌轨迹标记的三个落点是仅有的填充），使用尺寸 12–20px。

### Do's and Don'ts（介绍页增量）

#### Do:

- **Do** 用台账式行与整宽发丝线组织区块，行与区块靠"线 + 一致节奏"，不靠卡片。
- **Do** 动效限制在 0.12s（状态）/ 0.15s（chevron）/ 0.28s（事件入场）的 ease-out，脉冲只给 run/wait 状态点，`prefers-reduced-motion` 下全部关闭。
- **Do** 让演示会话保持"机制先于文案"：审批闸门必须真的可批准/拒绝，演示数据必须带"演示"标注。

#### Don't:

- **Don't** 给用户气泡上彩色或非石墨底（finish review 落地的修正；钢蓝只留在焦点/链接/激活）。
- **Don't** 把 999px 全圆用于标签或按钮——它只属于"回到底部"浮层控件。
- **Don't** 在 token 表外引入新颜色；一次性内联值（noscript 回退、导出报告内嵌样式）除外，它们是自包含产物，不进入系统。
- **Don't** 用 kicker/眉题、区块编号（01/02/03）或同尺寸图标卡片海组织页面。

### Provenance / evidence note

本部分记录的是介绍页（`index.html`，单文件：head 内全部 CSS + SVG symbol 图标表 + 一个 IIFE 演示脚本）定稿后的实际系统，finish review（verdict: ship）的三条物料修复已落地并体现于上文数值：`--teal` 已定义、用户气泡改石墨、步骤计数器用 `ink-3`。

截图栅格溯源——`.impeccable/review/` 下的整页截图渲染自 puppeteer-core 驱动的项目自带 Electron（Chromium），宽度为视口宽度减 15px 滚动条（desktop.png 像素宽 1425 ≡ 声明视口 1440；mobile.png 像素宽 750 ≡ 声明视口 390 @DPR2）。本页无其他 shipping raster：页面全部视觉由 CSS/SVG 代码绘制，无位图资产。
