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

品牌感存在于精确的细节里:等宽时间戳列对齐、审计行的类型色点、新事件落位时一次性的"留痕脉冲"。没有发光、玻璃拟态、彩色药丸,也没有 emoji。**渐变已受控解禁**（v5，见下文「受控渐变」小节）——只用于造体积/光线与表达状态，不做装饰。唯一的强调色钢蓝被限制在焦点/链接/激活三处语义;视觉权重不靠颜色,靠全应用唯一的反色主按钮(白底黑字)承担。信息密度优先于表达欲。

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
- **Don't** 用发光、玻璃拟态、紫蓝"AI 风";**渐变仅限受控清单内的 6 个令牌**（v5 解禁，见「受控渐变」小节）——清单外的任何渐变、装饰性渐变一律不用。
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

圆角四阶复用：4px（迷你标签、过滤钮）、5px（按钮）、6px（代码 pre、工具调用片、toast）、8px（演示窗、代码卡、终端卡、审批卡、用户气泡）。全页唯一的 999px 全圆属于"回到底部"浮层控件，不是标签形制。线形二分同 Part 1：`line` 做内缝与节奏线，`line-strong` 做外框与交互描边。滚动条：根文档 10px、窗格与代码井 8px，thumb #2c2f36、hover #3a3e46、圆角 4/5px（Firefox 走 `scrollbar-color`），与应用同配方。

### Components

- **Buttons**：5px 圆角、1px 描边、gap 7px 可带 13–15px 图标、过渡 0.12s；Primary（全页唯一重按钮）`ink` 底 / `press-black` 字 / 600 / padding 7px 16px，hover 提亮为 `press-white`；Secondary 透明底 / `line-strong` 边 / `ink-2` 字，hover `bg3` 底；sm 12.5px、5px 12px；disabled opacity .38。
- **Status Dots**：7px 圆点 + 12px 文字（台账分级点 8px）。idle=`ink-3` 静止；run=`teal` 脉冲 1.6s（与应用一致）；wait=`warn` 脉冲 1s（应用 0.7s——页面阅读节奏的分歧值）。状态永远"点 + 文字"。
- **Mono Tags / Chips**：等宽 11–12px、`ink-3` 字、1px `line` 边、4px 圆角：版本号、会话标签、审批策略标签（琥珀变体：`warn` 字 + rgba(217,168,80,.35) 边）、计数徽标（`bg3` 底无边）、风险词（无边、语义色文字）。
- **Filter Segments**：12px、4px 圆角、无边框透明底；idle `ink-3`，hover `ink` + `bg3`，激活（`aria-pressed`）`accent` 字 + `accent-dim` 底（钢蓝的激活态语义，合规）。
- **Ledger Row（台账式行——介绍页签名组件）**：左列"8px 语义色点 + 等宽英文关键词 + 600 中文关键词"，右列 `ink-2` 说明文（62ch）内嵌 mono 词片；底部发丝线，26px 行距。
- **Demo Window（活体演示窗——首屏签名组件）**：`line-strong` 外框 + 8px 圆角 + `bg1` 底 + overflow hidden；标题栏（46px，`bg2`）含品牌标记、mono 会话标签、状态点、重播；主体双栏——左对话流（用户气泡 = 石墨 `bg2` + `line-strong` 边 + 8px 圆角，**非彩色**（应用内的钢蓝用户色点在此收敛为石墨气泡，finish review 落地）；助手消息裸排 `ink-2`；工具调用片 = 代码井底 mono 片）与审批卡（`bg2` 底、`line-strong` 边、头部琥珀图标 + mono 策略标签、mono 命令原文、批准/拒绝；已决议降透明 .62 并替换判定行）；右审计时间线（计数徽标 + 过滤段 + 导出按钮；事件行 = mono 时间戳 + 类型图标 + 摘要 + 旋转 chevron，点击展开 JSON pre；底部 mono 脚注标注审计路径）。事件入场 0.28s ease-out 上浮（`prefers-reduced-motion` 下全部关闭）。
- **Code Window（代码卡 / 终端卡）**：代码井 `bg-code` 底 + `line-strong` 外框 + 8px 圆角；头部 mono 12px + `ink-3` 注记；pre 12.5–13px、行高 1.85–2、`tabular-nums`。语法只用墨阶 + teal：键/命令=`ink`，字符串/提示符=`teal`，注释=`ink-3`。
- **Toast**：固定底部居中、`bg2` 底、`line-strong` 边、6px 圆角、浮层-中阴影，0.18s 淡入上移，2.6s 自动消失，`role="status"`。
- **Icons**：与 Part 1 完全同规范——SVG `<symbol>` 表、24 viewBox、1.5px 描边、round cap/join、`currentColor`（品牌轨迹标记的两个落点是仅有的填充），使用尺寸 12–20px。
- **品牌标记（v4 重做）**：审计时间线母题，从三等大圆点改为**两点式**——一条 1.5px 竖线（y 5.8→17）+ 线顶一个 r1 / opacity .3 的远端点 + 线底一个 r3 / 不透明实心落点。语义是「一条留痕的线，末端一个实心落点」：审计日志向下追加，最新事件在底部，实心大点即「最新」。**不透明度梯度被废弃**——24 viewBox 缩到 12px 时 r1.1 的点不足 0.6 像素，透明度差异在真实使用尺寸不可读；改用「大小 + 亮度」双梯度后，栅格化验证（`.impeccable/verify-mark.mjs`，12–32px 逐尺寸量测）确认落点在每个尺寸均可见且末端最宽。远端点刻意做得比竖线还细（r1 < 1.5px 线宽），视觉上融进线里读作「线的远端」而非独立落点，故不参与栅格化分段断言。时间方向由标称几何断言（落点 y=17/24=71%，须在下半部）保证，不用栅格化反推——小尺寸下像素行数过粗，比例阈值会因取整误判。同一几何同步到 `icons/icon.png`（`scripts/gen-icon.mjs`，512px，24 viewBox ×512/24 归一）与 favicon data-URI，三处不得漂移。

### Do's and Don'ts（介绍页增量）

#### Do:

- **Do** 用台账式行与整宽发丝线组织区块，行与区块靠"线 + 一致节奏"，不靠卡片。
- **Do** 动效限制在 0.12s（状态）/ 0.15s（chevron）/ 0.18s（浮层与 JSON 展开）/ 0.28s（事件入场）/ 0.55–0.8s（一次性入场、落位与计数落定）的 ease-out，脉冲只给 run/wait 状态点与 trail-settle，`prefers-reduced-motion` 下全部关闭。
- **Do** 让演示会话保持"机制先于文案"：审批闸门必须真的可批准/拒绝，演示数据必须带"演示"标注。

#### Don't:

- **Don't** 给用户气泡上彩色或非石墨底（finish review 落地的修正；钢蓝只留在焦点/链接/激活）。
- **Don't** 把 999px 全圆用于标签或按钮——它只属于"回到底部"浮层控件。
- **Don't** 在 token 表外引入新颜色；一次性内联值（noscript 回退、导出报告内嵌样式）除外，它们是自包含产物，不进入系统。
- **Don't** 用 kicker/眉题、区块编号（01/02/03）或同尺寸图标卡片海组织页面。

### v2 交互层（留痕背景 · 浏览留痕 · 导航辅助）

- **留痕背景画布**（`#traceCanvas`：fixed 全视口、z-index -1、pointer-events none，纯 Canvas 2D；**v3 精简**）：静态层为 4–8 条**垂直台账细线** + 落点（品牌 mark 母题的放大笔迹；墨色 alpha 0.05/0.10，指针 220px 内显影至约 0.17/0.22），其中一条为工具青「执行中」轨迹（头部点 12s 缓移 + 脉动）。v3 按用户要求**移除鼠标尾迹与全部涟漪**（点击/进区块只计数不画圈）。**无 shadowBlur、无渐变**；`prefers-reduced-motion` 与粗指针环境仅静态单帧，细指针持续渲染（显影 + 青点脉动），`document.hidden` 暂停，DPR 上限 2，固定种子伪随机保证同视口图样稳定。
- **浏览留痕计数**（页脚 mono 行）：本次浏览的点击 / 浏览分项计数（应用户要求不计鼠标移动），仅存本页内存不上传；DOM 写入并入 rAF（每帧至多一次）。
- **阅读进度发丝线**：导航底部 1px `ink-3` 线随阅读推进（rAF 节流）。
- **导航滚动定位**：当前节链接染钢蓝（激活态语义）+ `aria-current`；无对应链接的节（快速开始）清空高亮；演示锚点 `#demo-window` 直落演示窗。
- **区块发丝线落位**：JS 下节顶 1px 线由伪元素 scaleX 0→1 绘入（0.8s ease-out）；无 JS 与 reduced-motion 直通为常态边框。
- **首屏入场**：hero 六个子元素一次性 0.55s rise 级联（60ms 步进，CSS 原生，reduced-motion 关闭）。
- **事件留痕脉冲**：演示时间线新事件行播放 1s trail-settle（钢蓝弱化底 → 透明），与应用签名动效同源。
- **JSON 展开平滑化**：事件详情 grid-rows 0fr→1fr + 透明度（0.18s ease-out）。
- **复制按钮**：终端（复制 clone→cd→install→dev 四行完整序列）与代码卡（data-copy 承载 5 行纯 JSONL，不带注释行）；clipboard API + execCommand 回退，成功换 check 图标、copied 态染 ok 绿边 + toast。
- **数字落定**：「24」「8」滚入视口后 0.8s 计数到位（reduced-motion 直出）。
- **回到顶部药丸**：999px 全圆 + 浮层-低阴影，滚动超过 720px 出现（世界既有浮层形制）。
- **页脚**：GitHub 仓库 / 问题反馈（Issues）/ 邮箱（mailto）链接 + 锚点（演示 / 审批门 / 快速开始）+ 版权行（v0.1.0 · MIT · © youxi，与 package.json 同步）与浏览留痕计数行（`.foot-links` `ink-2` 字、hover 提亮；外部链接带 `noopener noreferrer`）。
- **仓库露出（v3）**：导航右侧「GitHub」边框芯片 + 首屏动作区 ghost 按钮「GitHub 仓库」+ 页脚链接组，三处同指 git remote 实址。
- **去 AI 味标点（v3）**：正文破折号清零（改冒号/逗号/括号/间隔号），仅审计日志行（mono 数据格式）与 builder 注释保留；展示排版 h1/h2 启用 'Segoe UI Variable Display' 光学字号（`--font-display`）。

### Provenance / evidence note

本部分记录的是介绍页（`index.html`，单文件：head 内全部 CSS + SVG symbol 图标表 + 两个 IIFE 脚本）定稿后的实际系统，finish review（verdict: ship）的三条物料修复已落地并体现于上文数值：`--teal` 已定义、用户气泡改石墨、步骤计数器用 `ink-3`。v2 交互层评审：ship（六条修复 resolved）。v3 评审（fresh reviewer）：初判 fix 四条（title 间隔号、演示串 5 处破折号、页脚双署名统一为 youxi、版本徽标经 package.json 核实保持 v0.1.0），闭单轮全部 resolved，无回归，终判 **ship**。滚动条灰 #2c2f36/#3a3e46、999px 药丸、焦点 2px 圆角、导出报告内嵌 20px 为文档内豁免特例。

截图栅格溯源——`.impeccable/review/` 下的整页截图渲染自 puppeteer-core 驱动的项目自带 Electron（Chromium），宽度为视口宽度减 15px 滚动条（desktop.png 像素宽 1425 ≡ 声明视口 1440；mobile.png 像素宽 750 ≡ 声明视口 390 @DPR2）。本页无其他 shipping raster：页面全部视觉由 CSS/SVG 代码绘制，无位图资产。

---

## v5 · deck 化重构（2026-09-28）

用户要求：渐变解禁（不要 AI 味）、页面改为竖向卡片堆、滚轮/↓ 一次跳一块、首屏极简。本节记录该版本实际落地的系统与被打破的规则。

### 打破的规则（显式记录，避免默默破坏）

| 原规则 | 处置 | 理由 |
|---|---|---|
| 「无渐变」世界禁令 | **打破**，换成受控清单（6 个令牌） | 渐变承担体积/光线/状态职责时有效；AI 味来自多色标与装饰性堆砌，不是来自渐变本身 |
| 通栏台账行为主要版式 | **打破**，8 块各用独立版式 | 5/6 同构是"单调"的根因；同构率已降至 4/8 |
| 连续长文档 | **打破**，8 块各占一屏 | 用户明确要求；代价是打印与整页保存变差、首屏可爬取文字变少 |
| 阅读进度发丝线 | **废除**，换成 `NN / 08` 计数 + 右侧刻度轨 | 发丝线在 deck 里读不出"第几块" |
| 标题闪烁（曾短暂存在） | **已整体移除** | 桌面 App 的"任务栏请求注意"搬到网页等于劫持标签页 |

保留不变：石墨色阶、墨白文字、钢蓝只做强调、零 emoji、1.5px 图标、6–8px 圆角、`prefers-reduced-motion` 全关。

### 受控渐变清单（清单外一律不用）

硬约束：**≤3 色标** · 相邻色相 · 紫/品红色相禁用（HSE 265–330° 且饱和度 ≥25% 判违规）。

| 令牌 | 值 | 职责 |
|---|---|---|
| `--g-page` | `180deg #101218 → #0d0e11 45% → #0a0b0d` | 页面基调：给纯黑"光从顶部来"的体积感 |
| `--g-focus` | `radial 120% 68% at 50% 0%, ink .045 → 0` | 焦点暗角：块顶微亮，视线收拢 |
| `--g-type` | `180deg #f6f7f9 → #c8cdd6 55% → #9aa0aa` | 金属亮度差（备用） |
| `--g-rail` | `90deg accent → accent 0` | 刻度轨：当前块点亮并向右淡出 = "你在这里" |
| `--g-run` | `radial 70% 100% at 50% 100%, teal .10 → 0` | 执行态：演示窗"执行中"时叠加 |
| `--g-hero` | `180deg #f7f8fa → #e6e9ee 78% → #0d0e11` | 首屏白黑渐变（用户指定） |

禁止项：紫→蓝→粉多色渐变、网格渐变（aurora）、霓虹光晕、多色标彩虹、标题以外的渐变文字、按钮/边框上的高饱和渐变、模糊色块玻璃拟态、彩虹进度条。判据：**渐变要么在造体积/光线，要么在表达状态，两者都不成立就是装饰，删掉。**

### 首屏渐变的对比度（实测，非目测）

`--g-hero` 分界点定在 **78%** 而非中点：首屏内容重心落在视口 30%–70%，若在中点分界，正文会落进中灰死区（深墨与亮墨都只有 2.3:1）。分界推后使全部文字落在亮区，用近黑即可达 AA。实测对比度（`.impeccable/verify-deck.mjs` 按 WCAG 判定，大字 ≥3:1、正文 ≥4.5:1）：

- `.hero-name` 30px @31% → **16.83:1**
- `.hero-thesis` 82px @46% → **18.24:1**
- `.hero-tail` 17px @59% → **8.34:1**
- `.hero-hint` 12px @70% → **5.71:1**

78%–100% 的暗区是刻意留的"落地区"，不承载任何文字，只作视觉收束。

### deck 骨架

- **8 块**：`intro / demo / gate / timeline / ability / start / edge / outro`，每块 `min-height: 100svh` + `scroll-snap-align: start` + `scroll-snap-stop: always`。
- **滚轮翻块用原生 `scroll-snap`，不劫持 `wheel` 事件**：浏览器原生就是"滚一格跳一块"，惯性、手势、键盘、辅助技术全部保留，滚轮不写一行代码。
- **键盘翻块**：`↓/PageDown` 下一块、`↑/PageUp` 上一块、`Space/Shift+Space`、`Home/End` 首尾；输入态与带修饰键时不劫持。
- **超高兜底**：任一块 `scrollHeight > 视口` 时打上 `.overflowing`（`overflow-y: auto` + `overscroll-behavior-y: auto`），块内可滚且滚到底后交还页面，`mandatory` 吸附因此不会困住用户。900px 视口下超高块为 `gate / timeline / start`；1280×720 下同样无横向溢出。
- **演示窗不可内部滚动**（`html.deck .pane { overflow-y: hidden }`，对话流保留最近 7 条、时间线保留最近若干条）：若面板还能内部滚，鼠标悬停时滚轮会被面板吃掉，与"滚轮翻块"直接冲突。这是滚轮翻块能成立的前提。
- **刻度轨**：右侧 8 格，当前块点亮（`--g-rail`）；`≤900px` 隐藏。
- **页脚并入 08 块**（不再独立占一屏，否则 deck 变成 9 屏）。

### 版式减重（本次"单调"问题的实际解法）

- `ability` 的 6 行台账 → 3 行差异点，细节交给 24 格工具网格；8 行模板表移入 `start` 块（"上手"语境下模板表天然属于它）。
- `edge` 的 6 行台账 → 整块删除（与 4 行边界矩阵完全重复），仅保留矩阵 + 一段补充声明。
- 实测：总字数 4207 → 3366，平均字/千 px 552 → **434**，版式同构率 5/6 → **4/8**，首屏字数密度 0、收尾块 74。

### 验收

`.impeccable/verify-deck.mjs` 断言：8 块与块高、键盘翻块落点误差（≤2px）、演示窗不可内部滚动、刻度轨 8 格、渐变色标数 ≤3 且无紫/品红色相、首屏对比度达 WCAG AA、矮屏（1280×720）无横向溢出、超高块全部被 `.overflowing` 兜底。全部通过。

### v5.1 · 受控滚动与极简化（2026-09-28，同日迭代）

用户反馈四点：滚轮不流畅、部分效果不好、有内容超出、删除第二页以外的演示截图。本节记录处置。

**滚轮翻块：原生 snap → 受控整块滚动。** 鼠标滚轮下原生 `scroll-snap` 的手感是"滚一点被拽回"，且 `mandatory + snap-stop` 会在动画经过中间块时把滚动截停——不流畅的两个根源。v5.1 起翻块由 JS 统一接管：滚轮 / 键盘 / 站内锚点 / 刻度轨全部走同一条 `animateTo`（640ms easeInOutCubic），一次滚动精确落在块边界。动画期间滚轮事件被吞掉并把锁顺延 160ms（动量吸收），触控板惯性不会连环翻块；`Ctrl+滚轮` 缩放与触屏滚动不劫持；块内还有内容可滚时（`.overflowing`）滚轮让路给原生滚动，到边缘才继续翻块。`scroll-behavior` 必须为 `auto`：rAF 内每帧 `scrollTo` 若被浏览器再平滑一次会叠加失速。**修掉的真 bug**：首块 `offsetTop` 含 sticky 导航的 61px 文档偏移，`Home` 会把首屏顶部藏到导航下——首块目标特判为 0。

**截图全部移除。** 应用实录轨道（3 张 PNG，约 250KB）从 04 块删除，`docs/shots/` 一并清空；页面位图归零，功能说明由 02 块的活体演示窗承担（演示窗本身是 CSS/HTML 绘制，非截图）。

**全部 8 块装进一屏。** 03 审批门删除与分档条重复的 3 行台账（其中 confirm 行还引用着已删除的"标题闪烁"行为，文案已过时）；06 上手的 8 行模板表压成标签组；04 留痕随截图轨道移除而变轻。实测 900px 与 1280×720 视口下均零超高块，`.overflowing` 兜底保留为矮屏安全网。

**性能。** 背景画布 DPR 上限 2 → 1.5（1px 线条肉眼无差，像素量 -44%），渲染 60fps → 30fps（画面只有极缓脉动）；移除截图预取与 `<img>` 加载。`--g-page` 正式应用于 `body`（此前是死令牌）。

**极简清理。** 阅读进度发丝线与"回到顶部"药丸删除（deck 里刻度轨 + Home 键已覆盖其职责）；块间加 1px 发丝线（`--line`）维持台账身份；站内锚点与刻度轨点击统一走缓动曲线；翻块后焦点移交目标块（`tabindex="-1"` + `focus({ preventScroll: true })`），读屏可感知位置变化。

**实测指标**（`.impeccable/analyze-density.mjs` + `verify-deck.mjs`）：总字数 3366 → 2911，平均字/千 px 434 → 404，总高 7200px（恰为 8×900），位图 0，台账行版式占比 3/8。滚轮验收：单次滚动落点 Δ=0；连滚 5 次（模拟惯性）仍停在第 1 块。

### v5.2 · 逐块适配 · 块切换动效 · 排版松紧 · 洗光点缀（2026-09-28）

用户四点：每页适配窗口尺寸、块切换滑入滑出、文字不要堆一块、空白处渐变点缀。`adapt` / `animate` / `layout` 三个 playbook 合并执行。

**块切换动效（全站署名动效）。** 翻块时目标块整块内容沿滚动方向滑入（30px、680ms `cubic-bezier(.16,1,.3,1)`、直接子层 60ms 级联），离场块反向轻移并快速淡出（420ms，离场快于入场）；`--dir`（+1 下翻 / −1 上翻）由 `playTransition` 注入，900ms 后清理。目标块的逐元素 `.rise` 由 JS 直接打上 `.drawn + .seen` 让位——CSS 同特异性对抗被实测击穿（`html.js .block.entering .rise` 压不住 `.rise.drawn` 同名通道），改为 JS 侧让位而非样式侧压制。行级发丝线绘入保留。`prefers-reduced-motion` 下进出动画为 none，翻块本身照常（实测 scrollY 仍到达目标）。

**洗光点缀（G6/G7/G8）。** 三个新令牌：`--g-wash-steel`（右上，钢蓝 .055）、`--g-wash-teal`（左下，工具青 .05）、`--g-wash-out`（居中，钢蓝 .07）。承载于既有 `::before` 暗角层之上（`background: var(--g-wash), var(--g-focus)`），单块至多一层、方向交替：demo/timeline/ability/start 交替钢蓝与青，outro 用居中收束光，gate/edge（自带色点与矩阵纹理）不洗。全部 ≤3 色标、单一色相、alpha ≤ .07——读作"光的衰减"而非霓虹。令牌总数 6 → 9。

**逐块适配（7 视口实测）。** 1920×1080 / 1440×900 / 1280×720 / 1024×768 / 768×1024 / 390×844 / 360×740 全部零横向溢出；超高块（平板与手机的 demo/ability/start 等）全部被 `.overflowing` 正确兜底——修掉一个真 bug：首次测量早于分档事件行填充与字体就位，`load` + 450ms 复测后标记吻合。窄视口（≤980）演示窗单栏堆叠且放开块内 46svh 定高（否则两面板被压扁）；≤640 隐藏导航 GitHub 芯片、动作按钮全宽；触屏（`pointer: coarse`）恢复原生 `scroll-snap: y proximity`（滚轮劫持不作用于触屏，"一块一屏"由原生接近吸附承担）。

**排版松紧。** 06 块三行挤段的 start-note 改为结构化注记行（mono 标签列 + 说明列，行间发丝线，≤640 折单列）；sec-head 下方节奏加大（clamp 22–48px）且 lead 行高 1.8；demo-cap 限宽 76ch；分档卡 acts 行高 1.65。

**结构修正。** 页脚移入 08 收尾块贴底（`margin-top: auto`）——此前 End 键后页脚仍在视口外，deck 总高恰为 8 屏。

**验收**（`.impeccable/verify-adapt.mjs`，新增）：7 视口扫描（溢出/兜底/导航显隐/演示窗分栏）、切换中途抓拍（entering 类 + --dir + blk-in/blk-out 播放中）、切换后类清理、reduced-motion 关闭、洗光层数与色标数。verify-deck 令牌清单同步为 9。全绿。

---

## v6 · 黑匣子 / 光轨——介绍页换世界（2026-09-28）

用户裁决：界面"没有特点、文字堆叠、切换看不见、留白刻意"，**明确放开文档既有设计规则**，指定多用白黑渐变、不用杂志风。本次按 frontend-design 方法重新立世界，工程石墨世界对介绍页的约束自 v6 起由本节取代（应用本体不受影响）。

### 世界定义：黑匣子 / 光轨

产品是一台审计仪器，界面就做成一台单色记录仪器：**全部表达只动亮度，不动色相**。白↔黑亮度渐变是唯一的"材料"——渐变发丝线、渐变幽灵编号、渐变金属字、白黑书挡；色相只保留功能语义（审批三档的绿/黄/红、执行中的工具青、焦点环）。

- **展示字体**：内嵌 JetBrains Mono 800（latin 子集，base64 28KB，单文件无外链、离线可用、国内可达）。数字/编号/字标用它；中文回落系统黑体，靠字重（800）与字号立层级。选择理由：产品本体是日志，等宽展示字是它的声音，不是装饰。
- **幽灵编号**：每块右上角 130–300px 的 JBM 800 编号（02–07 + 收尾块的 `EOF`），白→透明渐变填充，既是位置感也是记忆点，取代原 `NN / 08` 小计数。首屏不用编号——它是招牌而非一页。
- **渐变发丝线**：块与块的地平线（`--g-hair`，自左向右衰减）替代平面灰边；事实卡顶部同款。
- **颗粒**：SVG feTurbulence 数据 URI 平铺，opacity .05——给大面积渐变加"材料"，消塑料感，纯静态零开销。
- **首屏**：4 段白→黑坡（`#fff → #e2e6ee 30% → #3a4049 58% → #050608`），内容锚定低位，品牌行钉左上（对角张力）；118px 级白色金属渐变字；实测对比度 name 18:1 / thesis 6.0:1 / tail 9.8:1 / hint 6.0:1。
- **收尾书挡**：08 块黑→白渐变（`--g-outro`），页脚落在亮区整体翻成深墨，标题白色渐变字——deck 以"曝光成相"收束。
- **块切换（看得见）**：进场 96px + 全程淡入（780ms），子层 70ms 级联，幽灵编号 150px/1.05s 视差慢半拍；离场 80px 淡到 0（500ms）。

### 被打破的规则（相对 v5 及更早，显式记录）

| 原规则 | 处置 |
|---|---|
| 展示字体限系统（Segoe/雅黑） | 打破：内嵌 JBM 800 |
| 渐变文字禁令（craft-floor/受控清单） | 打破：标题与幽灵编号用单色亮度渐变字；仍禁多色相渐变字 |
| 色标 ≤3 | 放宽到 ≤4（单色亮度坡允许；**多色相仍禁**，紫/品红判定不变） |
| 钢蓝为唯一强调 | 收缩：钢蓝仅剩刻度轨/洗光；强调改由白色反差承担 |
| 界面"零装饰" | 打破：幽灵编号、颗粒、书挡是有作者性的装饰，但全部单色亮度材料 |

保留：零 emoji、SVG 线性图标、`prefers-reduced-motion` 全关、WCAG AA 实测、零位图、单文件无外链。

### 修掉的真 bug

`.block > .wrap` 的 `position: relative` 使其成为子元素绝对定位的包含块，首屏品牌行（absolute）掉进内容流中央——flex 子项的 z-index 本就不需要 relative，移除后品牌行归位左上（实测 @6% 高度、18:1）。

### 验收

verify-adapt：7 视口零溢出、超高兜底吻合、切换中途 blk-in/blk-out 播放、reduced-motion 关闭、洗光层数、渐变字以最暗色标保守测对比度。verify-deck：12 令牌、键盘落点 Δ0、滚轮单次/惯性、白黑渐变契约。verify-features：facts=3、证据行=1、幽灵编号=7、零位图。verify-motion：24/24 入场。全部通过；总字数 2911→2808，字/千px 404→390，总高恰 8×900。

### v6.1 · 排版节奏与切换隐患修复（2026-09-28）

用户确认背景方向，要求内容文字重新排版。

**排版系统：铭牌 → 金属标题 → 导语 → 内容。** 每块新增 mono 结构铭牌（`审批门 / gate` 式，前置 26px 渐变刻线），延续"仪器面板"的口吻；块标题从 26–36px 放大到 32–58px / 800 字重，与幽灵编号同用白色金属渐变填充（最暗色标 #9aa0aa 对石墨底实测 6.6:1）；导语限宽 42ch。02 块标题与实时状态条并为一行（`#demo .sec-head` flex，≤1100px 折列）；05 块删除与标题重复的"二十四件工具"h3（并入一行 mono 说明）；首屏副句加重（600 / 19px / #e8e9ec）；04 能力清单行距放宽。

**切换的真隐患（实测抓出）。** `.leaving`/`.entering` 给 `.wrap` 加 transform 后，**transform 容器成为绝对定位后代的包含块**——首屏品牌行（曾 absolute）在每次切换开始瞬间跳位约 282px，deck 的对比度采样也曾恰好落在这个被移位的状态（thesis 2.3:1 的假阴性）。修法：首屏改为**全流内两段式**（品牌行钉顶、hero-main 以 `margin-top:auto` 贴底，`flex:1` 撑满——百分比 height 对 min-height 父级无效），切换时整块统一滑动，零跳变。配套：白黑坡提速为 4 段（`#fff → #f0f2f6 18% → #171a1f 40% → #050608`），暗区从 40% 开始，118px 大标题完整落入暗区（thesis 9.9:1 / tail 15.8:1 / hint 6.6:1），渐变光束留在上方留白带。清理计时器改为 **animationend 驱动**（epoch 守卫 + 2.2s 兜底）——实测 1450ms 定时器会被动画帧批量延迟到 1.7s+，是切换类残留的根因。

**验收**：deck（对比度 name 17.8 / thesis 9.9 / tail 15.8 / hint 6.6，落点 Δ0，渐变 12 令牌）与 adapt（7 视口、切换中途/清理/reduced-motion、洗光层）全部通过；features / motion / fixes 回归全绿。

### v6.2 · 去盒化——内容长在黑底上（2026-09-28）

用户指出分档卡等组件"与背景不搭"：描边卡片、底色填充是旧世界（工程石墨）的组件语言，浮动在新的渐变黑底上像贴片。**本次把内容组件全部去盒化**，同一手法贯穿：

- **分档栏（03）**：三列无框栏目，每列顶部一根**档位语义色的渐变刻线**（绿/黄/红，自左向右衰减），档名 `safe / confirm / dangerous` 用 JBM 800 放大到 20–28px 并染语义色，中文释义白字 700，说明句灰字。选中态只用亮度（选中 100% / 未选 45% / hover 78%），不再有描边与底色。
- **事件井**：去掉四边围框，只留顶部一根**跟随所选档位变色**的渐变刻线（JS 切档时同步 `--evc`）+ 档位色圆点，代码井底不变。
- **边界矩阵（07）**：外框、键列底色、竖分隔全部移除，每行一根白→透明渐变刻线，键列直接排。
- **工具网格（05）**：去外框，保留 1px 发丝网格。
- **块尾注记**：灰段落改为带渐变刻线的单行注记（`.sec-note`）。

### 验收环境的真发现：遮挡节流

deck 验收一度整批失败（键盘/滚轮全部不动或中途冻结），逐帧监视 scrollTo 后确认**页面逻辑完好**——根因是验收用 Electron 窗口被遮挡时 Chromium 将 rAF/定时器节流至冻结，动画不推进、1450ms 清理计时器拖到 1.7s+。所有验收脚本的 Electron 启动参数补上 `--disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding` 三件套后全部稳定通过。此问题只影响验收环境，真实用户页面可见时不受影响。

### v6.3 · 去盒化扫平（2026-09-28）

用户确认分档栏方向后，要求其余各块（除首尾）同一手法扫平。本次移除的"盒子"与替代：

| 组件 | 原 | 现 |
|---|---|---|
| 代码井（04 audit.jsonl） | line-strong 描边 + 8px 圆角 | 无框井底 + 顶部 `--g-hair` 渐变刻线 |
| 终端（06） | 同上 | 同上 |
| 演示窗（02） | 硬描边 | 去描边留圆角与窗 chrome——它是应用实体的描画，非文字卡片 |
| 能力清单（04）/ 步骤（06）/ 注记行分隔 | 平面灰 `border-bottom` | `--g-hair-dim`（新增第 13 令牌，.26 衰减）暗档渐变刻线 |
| 模板 chips（06） | 描边小药丸 | 无框 mono 目录行，间隔点分隔 |

渐变令牌 12 → 13；五套验收全绿（deck 键盘/滚轮 Δ0、adapt 7 视口、features、motion 24/24、fixes），零位图、零控制台报错。至此 02–07 全部内容组件与背景同一语言：**线、字、亮度，无盒**。

### v6.4 · 首尾镜像（2026-09-28）

用户要求首屏渐变"像尾页一样的效果,只不过反着来"。`--g-hero` 改为与 `--g-outro` 互为镜像的收束结构:**亮区延续到 62%(全部主文字住这里),62→92% 缓缓沉入暗色,底部 8% 暗色收束**——与尾页"暗区延续,88% 起显影成亮"首尾互为镜像。首屏文字整体翻回深墨(thesis 深色金属渐变字 18:1、tail 5.2:1),唯底部提示行落在暗色收束带里、翻成亮色——它本就是"继续进入暗色 deck"的引路符(5.2:1)。五套验收全绿。

首尾结构对照:

| | 首屏(01) | 尾页(08) |
|---|---|---|
| 内容区 | 亮(0–62%),深墨文字 | 暗(0–88%),亮墨文字 |
| 收束带 | 暗(92–100%),亮色提示行 | 亮(88–100%),深墨页脚 |
| 流向 | 亮 → 暗,流入 deck | 暗 → 亮,流出页面 |

### v6.5 · 第二页轨迹条 · 导航首页 · 可见度提亮（2026-09-28）

四点：顶部导航加首页、首屏黑渐变加量、第二页优化、其余页去盒化"不明显"。

- **导航**:`nav-links` 首位新增「首页」(→ `#intro`,锚点拦截器映射 gotoBlock(0),滚动定位经 linkBySection 自动高亮)。
- **首屏渐变加量**:`--g-hero` 亮区 62% → 58%,深暗起点 92% → 88%;副句墨色加深至 #101114。实测 name 18.7 / thesis 17.9 / tail 5.0 / hint 8.0。
- **第二页:实时轨迹条。** 原小状态条(竖线 + 箭头链)升级为**全宽轨迹条**:一条暗档渐变轨道 + 四个操作节点(轨道线由节点底色遮出),演示推进时青色填充线自左向右生长(`__pulse` 同步 `fill.style.width`,approval.wait 节点为琥珀)。图注改带刻线注记;窗 chrome 底边换渐变刻线。
- **可见度**:去盒化不明显的根因是替换刻线太淡——`--g-hair-dim` .26 → .34;04 能力清单的绿对勾换成 mono 序号(01/02/03,仪器口吻);两处井头文件名(audit.jsonl / Windows PowerShell)改 JBM 700 白。顺带修掉一个潜伏 bug:轨迹条的 steps 误用单元素选择器 `$`,点亮节点时抛 TypeError。

五套验收全绿;渐变令牌 13。
