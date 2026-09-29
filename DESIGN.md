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

### v6.6 · 标本与光场——中间块的高级感两轮（2026-09-28）

用户两轮裁决：(1)「除首尾外中间块没有高级感」，方向拍板为**每块一件大尺度标本**；(2)「背景加黑白渐变的动态效果，能和鼠标交互更好，要有视觉冲击的高级感」；期间点明本页用于 **GitHub Pages 静态部署**——全部改动保持单文件内联、零外链、零构建。

**标本（02–07 各一件大尺度主角，接续 v6.3 去盒化）**

| 块 | 标本 | 关键值 |
|---|---|---|
| 03 审批门 | 档名 `safe / confirm / dangerous` 放大成主角 | JBM 800，`clamp(34px, 3.9vw, 56px)`，档位语义色；亮度阶梯只作用于档名+释义（选中 100% / hover 85% / 未选 58%，大字 3:1 达标），**说明文字退出透明度混合**，始终 ink-3/ink-2 保底对比度 |
| 04 时间线 | audit.jsonl 台账加长加宽 | split 5/7 → 4.5/7.5；pre 13px/1.95；事件样例 5 → 7 行（补 screen.capture、fs.verify；长路径改短，行内全显、横向滚动条清零）；feats 恢复 14px 行距与右侧等高 |
| 05 能力 | 24 格工具网格升为版面主角 | auto-fill → 固定列数 **6/8/4/3/2**（24 任何断点整除）；单元格 13×14px、zh 14.5px；**修掉末行空缺格漏底**（`gap:1px + background:var(--line)` 在缺格处漏出浅块） |
| 06 快速开始 | 终端放大 + 补真实命令 | pre 13 → 14.5px；补 `npm run dist`、`ollama pull qwen3:8b` 两组（README 真命令，data-copy 同步），左栏死区填掉；steps 行距 13px |
| 07 边界 | 矩阵整体放大 | 键列 16.5px、chip 13.5px、行距 16px、键列 210px |
| 02 演示 | 轨迹条放大 + **修时间线空列表 bug** | 轨迹条 13.5px/节点 8px；原 `nth-child(-n+4)` 按位置硬隐藏前 4 条，演示前段"计数在涨、列表全空"读作没加载完——改为 JS `trimEvView()` 保留最近 8 条打 `.old` 类 |

通用：幽灵编号 `top` 下限 4px → 64px（不再被 61px sticky 导航吞掉上缘）；`--g-ghost` 顶 alpha .14 → .19；中间块背景平黑 bg0 → **透明**，让 body `--g-page`（自上而下极轻亮度差）整幅透上来——六块共享同一束"从顶部来的光"。

**光场（动态黑白渐变三层，z=-1，纯内联）**

- **L1 `.bg-drift`**：双团白光 34s 缓慢对流（radial alpha .085/.06，transform 驱动）。
- **L1.5 `.bg-sweep`**：对角软边扫光带 20s 往返（alpha 峰 .07；**transform 驱动**，不用 background-position——那是逐帧整屏重绘）。读作展厅顶灯扫过展台。
- **L2 `.bg-cursor`**：880px 指针光池（alpha 峰 .155，双色标 radial）；rAF lerp 追赶目标点，静止 260ms 睡眠（零开销驻留），pointermove 即醒，标签页隐藏停表；首帧藏在视口外，指针未动不抢戏。
- **层叠语义**：三层均 z=-1——hero/outro 的不透明书挡天然盖住光场，**光只活在暗段**；组件不透明井底（代码井、工具格、演示窗）保持锐利，光只在开放黑区成池；颗粒 `body::after`(z80) 压在光上，消渐变带状条纹。
- **守卫**：`prefers-reduced-motion` 三层 `display:none`；`pointer:coarse` 不启用指针光；全部 CSS/JS 内联，GitHub Pages 单文件直出。
- **像素取证**：指针停留点周围背景 (22,23,26) vs 远处 (16,17,19)；A/B 对照证实工具格不被光穿透（不透明井底在光之上，变亮的单元格是 hover 态 rgb(26,28,33)）。

**验收**：五套 verify 全绿——adapt 7 视口零横向溢出、900px 下零超高（demo=907 恰在兜底线内）、deck 键盘/滚轮落点 Δ0、首屏对比度 AA、motion 24/24、fixes、console 零报错。`detect.mjs`（降级 regex 模式）跑过：新增 advisory 均为本节登记值（档名 clamp 34–56、光场 rgba 240/247），两处 `transition: width` 为既有 1px 刻度轨/轨迹条。逐块截图工具沉淀为 `.impeccable/shot-blocks.mjs`（含落点探针与拍摄瞬间水印）。

### v6.7 · 光场重做——去劣质感（2026-09-28）

用户反馈 v6.6 光场"有一种劣质感"。诊断：三样都借了不属于这个世界的语言——**斜向扫光带**是模板式 shine，**漫游光团**是廉价 gradient mesh，**滞后圆形光斑**是伪交互发光（与 v3 用户亲手删掉的鼠标尾迹同族）。处置：全部删除，换成"建筑感"的两种光：

| 层 | v6.6（删） | v6.7（现） |
|---|---|---|
| 环境 | 双团漫游光（34s 对流） | **`.bg-ambient` 顶边锚定呼吸光**：单团 radial 钉在顶边（50% -22%），与 `--g-page` 同向"光从顶上来"，18s 极慢 opacity .45↔1 呼吸——不游走 |
| 交互 | 880px 圆形光斑 + rAF lerp 滞后 | **`.bg-column` 纵贯光柱**：全高软边光带（宽 min(360px,46vw)，峰值 alpha .08），只跟随指针**横轴**，世界缓动 `cubic-bezier(.16, 1, .3, 1)` 0.18s 贴身无滞后——读作台账"读取头"扫页，呼应画布垂直台账线母题；JS 只写 transform，无 rAF 循环、静止零开销 |
| 装饰 | 斜向扫光带（20s 往返） | **删除**（无职责的运动渐变，按"渐变要么造体积要么表达状态"判死） |

守卫不变：reduced-motion 两层全关、触屏不启用列光、hero/outro 书挡天然遮光、纯内联零依赖。五套 verify 复跑全绿；`detect.mjs` 复跑通过。

### v6.8 · 导航页签 · 第四页台账重做 · 删光柱（2026-09-28）

用户四点：优化导航栏、重做第四页、删除跟随鼠标的光柱、中间块背景方案**只出方案先不做**。页面保持单文件 `index.html`（GitHub Pages / 浏览器直开预览）。

**导航栏**：链接改全高（60px）命中区 + 11px 横向内距、`color .15s` 过渡；当前节在钢蓝文字之外增加**1px 下沿指示线**（盖在导航底边上，仪表页签语义）；删掉两条永不可达的 margin 规则（`.nav .btn` / `.nav-links + .btn`——DOM 里没有任何按钮是 nav-links 的紧邻兄弟）。

**第四页重做（时间线与报告）**：`split(4.5/7.5) + feats 列表 + codecard` 整体替换为**台账标本** `.audit-led`：
- 头行：文件图标 + `audit.jsonl` + 「只追加，永不覆盖」+ 右对齐「复制原文」「导出演示报告」（`#exportBtn2` 保留，导出绑定不动）。
- 7 条人读事件行：等宽时间戳（tabular）· 7px 语义色点（消息墨灰 / 工具青 / 待批琥珀 / 通过绿）· 等宽类型列 124px 对齐 · 单行摘要（hover/展开提亮至 ink）· chevron；行间 `--g-hair-dim` 渐变发丝线，行 hover 落 `bg1` 底。
- **点行展开 JSON 原文**（`grid-template-rows 0fr→1fr` + 透明度 0.18s，aria-expanded 同步）——兑现本块自己的文案「点开任意事件，JSON 原文俱在」。实测：展开 54px、再点收起归零。
- 底部三条注记（01/02/03，渐变刻线 + mono 序号）承接原 feats 的三句承诺。
- 旧 `.split/.feats/.codecard` CSS、JS 引用（stageGroups `$$('.feats')`、copy 回退选择器）全部清干净；顺带修掉一处潜伏的 CSS 解析残块（`.codecard-head .fn` 规则后有游离声明与多余右括号，`.term-head .fn` 样式此前靠规则本体侥幸生效，重做后显式补回）。
- 窄屏 ≤760px：隐藏类型列、注记折单列。

**删光柱**：`.bg-column`（HTML/CSS/pointermove JS）整体移除；背景光场只剩 `.bg-ambient` 顶边呼吸光。中间块背景的后续优化**只出方案不实施**（见与用户的当轮对话）。

**验收**：五套 verify 全绿（7 视口、900px 零超高、rise 23/23、line-draw 3、键盘/滚轮 Δ0、console 零报错）；台账行展开/收起交互脚本实测通过；`detect.mjs` 复扫：4 warning 全为既有项（2×1px width 过渡、2×JBM 字体登记滞后），无新增反模式。

### v6.9 · 逐块布光 + 曝光弧线（2026-09-28）

用户对「逐块布光 + 曝光弧线」方案拍板"做"。替换 v5.2 的均匀洗光体系（`--g-wash-*` 三令牌 + 方向交替），中间块背景从"六块同一套照明"变成"每块一盏灯 + 整册一条明暗叙事"。**全部静态，零新动画**——冲击力来自跨屏对比，不来自单屏特效。

**逐块布光（`--g-lamp`，单色白 ≤3 色标，定义在各块 id 上）**

| 块 | 灯 | 语义 |
|---|---|---|
| 02 演示 | `72% 48% at 50% 76%` 下腹光 | 光从演示窗背后浮起——仪器通电 |
| 03 审批门 | `84% 42% at 50% 60%` 中腰光 | 从三档刻线下方托起 |
| 04 台账 | `24% 88% at 13% 42%` 左纵光 | 沿时间戳列垂直落下——照亮账页边缘 |
| 05 能力 | `84% 40% at 50% 97%` 底部地平线光 | 网格背光 |
| 06 快速开始 | `46% 64% at 27% 56%` 左柱光 | 终端屏幕光 |
| 07 边界 | **反向灯**：`130% 108%` 四角压暗 vignette | 不给灯，给"禁地" |

**曝光弧线（`--dim`，面纱作 `background-color`，在图像层之下）**：02 = 0 → 03 = .07 → 04 = .12 → 05 = .17 → 06 = .23 → 07 = .30，沿 02→07 **单调加深**；08 爆白收尾（不参与）。

**v6.9 首版教训（用户反馈"看起来没有变化"）**：首版面纱用近黑 `rgba(5,6,8)` 且 α≤.11——底色本身就是 (13,14,17)，两者只差几级灰，按 α 混合后变化不足 1 级，**数学上就不可见**；灯 alpha .07 同样太弱。修正：面纱改**纯黑** `rgba(0,0,0,α)`、α 提到 0→.30（每级 +.05~.07 可感知），灯 alpha 全部提到 .12–.13（灯心比底色亮约 30 级，光池一眼可见），07 四角 vignette .26 → .32。修正后实测右带均值 02→07：**21.0 → 20.4 → 15.8 → 16.1 → 13.4 → 11.9（首尾差 43%）**；左下角 19.5 → 10.5。04/05 的局部回升是 authored 灯的刻意抬亮（账页纵光 / 网格地平线光压过面纱），属设计内。`verify-adapt` 面纱上界同步 .12 → .35。

### v6.10 · 光语言收敛——删六盏灯与呼吸光（2026-09-28）

用户判定 v6.9 强化后的灯光"杂乱，没有达到预期"。诊断：每块位置不同的光斑在六屏连播时读作**随机 blobs**，叠上呼吸光与 +20% 的画布线条，光源太多。收敛为**唯一光系统**：

1. 顶光 `--g-focus`：所有块同一方向（光从顶上来），alpha .045 → .06（呼吸光删除后由它独扛）
2. 曝光弧线 `--dim`：纯黑面纱 0 → .035… 保持 v6.9 强化后的值（0/.07/.12/.17/.23/.30）
3. 07 四角 vignette：唯一保留的"灯位"，它是压暗不是光池
4. 画布台账线 / 颗粒：材料，不是光——+20% 回调到原值（.05/.10/.12）

删除：`--g-lamp` 六盏（02–06 全删、07 vignette 保留）、`.bg-ambient` 呼吸光（HTML/CSS/keyframes/reduced 规则）。收敛后实测**两条采样带完全单调**：右带 20.1 → 18.1 → 15.9 → 15.0 → 13.5 → 12.0；左下角 18.4 → 16.3 → 14.4 → 13.7 → 12.0 → 10.5（v6.9 里被灯抬乱的 04/05 局部回升消失）。`verify-adapt` 布光层断言改为：02–06 与 outro = 1 层（顶光暗角）、edge = 2 层（vignette+暗角）。五套全绿。

### v6.11 · 首屏四角构图——事实铭牌与留痕流（2026-09-28）

用户：首屏只有几行大字太单调，要加"有意义的东西"；方案拍板 A+B 组合，并钉死两条约束——**首屏渐变 `--g-hero` 不动**、**铭牌背景用与首页相反方向的白黑渐变**。

- **右上 · 反向事实铭牌 `.hero-facts`**：`linear-gradient(180deg, #050608 → #171a1f 40% → #f0f2f6 64% → #fff)`——与 `--g-hero`（白→黑）镜像的黑→白，亮区里的一枚"黑匣子"芯片。渐变分区即文字分区：上带恒暗承载 `24 工具 · 3 档审批门 · 8 模板 · MIT`（数字 JBM 700 提亮 #f6f7f9，实测 7.9:1），下带恒亮承载 `桌面自动化 · 全程可审计`（#101114，6.5:1）。**分界必须压在 40%/64%**：首版 48%/72% 时下带文字上缘骑在过渡带（背景 147 处只有 ~3.7:1）。
- **右下 · 活体留痕流 `.hero-trail`**：grid 右列（`grid-row: 2/5; align-self:end`，纯流内、零定位风险）；`audit.jsonl` 头 + 示例标签 + 4 条真实机制事件（fs.list / approval.wait / approval.ok / fs.verify，语义色点 teal/warn/ok），入场 `--d:480ms` 跟随首屏级联，reduced-motion 全关。
- **留痕流必须落井底（对比度教训）**：首版裸放在渐变上，实测头部背景亮至 (128–179)，浅字对比度崩到 **1.6–3.2:1**；首屏暗色收束带太短（125px 的流挤不进去），解法是用世界的正规代码井（`bg-code` + `line` 发丝边 + 6px 圆角）把文字与渐变**隔离**——视觉上是"从黑匣子上撕下来的一条"，井内实测 (12,13,15)，全部文字 ≥5.3:1（audit.jsonl 10.0:1）。
- **响应式**：≤980 隐藏留痕流（grid 收单列），≤560 隐藏铭牌——手机首屏保持"首屏极简"原状。
- **验收**：五套全绿（motion 首跑遇 detached Frame 会话抖动，重跑通过）；首屏四项对比度断言 18.69 / 17.89 / 4.95 / 7.97 全过；新元素采样 7.9 / 6.5 / 10.0 / 6.3 / 5.3:1 全达标；`intro` 块高仍恰 900。

**v6.11.1 · 去盒化（用户反馈新增模块"很突兀"）**

诊断：首屏的材质语言是**纯渐变、零描边**，而两个新模块都带 1px 描边 + 平底硬边——"贴上来的卡片"与渐变世界冲突。处置：描边全删，模块退回"渐变本体"：

- **铭牌**：去 `border`（radius 6→8）。上缘靠自身黑压白定义（压印感），下缘白色与页面白底无缝相溶——渐变芯片从页面里显影，不是描边贴片。
- **留痕流**：去描边与平底，改**双向羽化**——顶缘 `alpha 0 → 实底` 同向渐变（实测 56px 平滑曲线 182→118→46→12，从页面色里"沉"出来）；侧缘单层横向 `mask-image` 羽化 7%（不做 composite，兼容性最好，实测 24px 曲线 67→42→11 化掉最后一条硬缝）；内距提到 24px 让文字完全落在羽化带内；列宽 300→310 补偿。底缘本身落在暗区（差 17 级）天然不显。
- 羽化后对比度反而更高：头行 16.0:1、meta 10.1:1、行文 8.5:1（此前井底方案为 10.0/6.3/5.3）。
- 五套 verify 复跑全绿；首屏四项断言不变全过。

### v6.12 · 大字化证据——容器两轮被否后的换法（2026-09-28）

用户对 v6.11/6.11.1（铭牌芯片 + 羽化暗池）两轮否决："还是不行，换一种方式展现"。拍板新方向 **A 大字化证据**。

**诊断**：两个模块的本质是"11px 密集小字的容器"——尺度上接不住 118px 主张（118 : 11 断层无中间层），语法上是 Operate 界面的卡片语言混进 Persuade 海报。描边、去描边、羽化都只是在修饰贴片感本身。

**换法：证据升维成排版，容器归零**

- **右上 · 数字组 `.hero-stats`**：`24 / 3 / 8` 用 JBM 800 `clamp(40px,4vw,56px)` + 与主张同族的金属渐变字填充（`#101114→#3a3f47`），各配 mono 小标签（工具 / 档审批门 / 个模板），下缀微行 `MIT 开源 · 数据只写本机，不上传`。`align-self: flex-end` 右对齐贴 wrap 边——**补上 118px 与 11px 之间的尺度中间层**，纯文字。flex 双 auto 布局：品牌行钉顶、数字组居上右、主张+留痕贴底。
- **右下 · 留痕三行 `.hero-trail`**：容器、底、mask、羽化全部删除——`audit.jsonl · 示例` 头行（g-hair-dim 渐变发丝线）+ 三行决议弧线（approval.wait → approval.ok → fs.verify），**直接印在暗带上**，与滚轮提示同语言；逐行 `hero-reveal` 60ms 级联（460/520/580/640ms），reduced-motion 全关。
- **无容器的对比度预算**（首屏渐变 58%→88% 段实测反推）：内容底对齐 grid 槽底（y≈791），四行顶到 y≈707（背景 ≈93）——头行提亮 `#e8e9ec`/`#dfe2e7`（5.3/4.9:1），行文 `#c9ced6`（行1 5.6:1、行3 9.3:1）；数字组落在纯白区（251,252,253），金属深字天然达标。
- 响应式：≤980 隐藏留痕流（grid 收单列），≤560 隐藏数字组。
- **验收**：五套 verify 全绿；首屏四项断言 18.72 / 17.89 / 4.95 / 7.97 全过；新元素采样 5.3 / 4.9 / 5.6 / 9.3 全达标；像素取证数字组包围盒 x923–1159、留痕流亮字 2501px。

### v6.13 · 中间页颜色点缀（克制版）（2026-09-28）

用户："在中间页面合适的地方加颜色点缀，但不要太多。"原则钉死：**只用世界已有的执行四色与品牌钢蓝，不引入任何新色相；每块至多一两处；全部有语义依据**（状态四色规则从"只标状态"放宽为"语义即可"，装饰仍禁）。

- **铭牌刻线着色（6 枚，每块一枚 26px 渐隐线）**：`.sec-label::before` 从白色 `--g-hair` 改为 `var(--tick-c)` 渐隐——02 机制=工具青、03 审批=琥珀、04 留痕=完成绿、05 能力=品牌钢蓝、06 命令=工具青、07 边界=错误红；outro 未设变量回落白色（收束保持单色）。计算样式实测：`(95,179,163) (217,168,80) (88,179,128) (108,158,230) (95,179,163) (224,122,122)`，outro `rgba(232,233,236,.55)` ✓。
- **07 边界的两处语义延伸**：四行图标染错误红（整个矩阵是"红线/绝不"语义，实测 `(224,122,122)`）；引导句粗体关键词「先经你确认」「失败即停」染琥珀（审批/警示语义，与审批档同色，实测 `(217,168,80)`）。
- **不加的地方**（克制清单）：05 的 facts 顶线、04 的 lock 文字、07 的 chips、步骤序号、幽灵编号、块底地平线——全部保持单色，颜色总面积控制在每屏 1–2 枚微型元素。
- 五套 verify 复跑全绿；detect 无新增反模式。

### v6.14 · 尾页收束句——浏览留痕升格为正文（2026-09-28）

用户对 08 提优化要求并拍板方案 A「浏览留痕收束句」。诊断：尾页只有标题/按钮（左上）+ 页脚（底部），30%→88% 的曝光过渡带整条空着，收束感全靠渐变。

- **收束句**：按钮组下方一行 mono 大字 `本次浏览已留痕 N 条事件（点击 x · 浏览 y）· 仅记录于本页，不上传`——页脚的**真实计数器升格为正文主角**。叙事闭环：全篇说"它做过的每一步都留痕"，末页告诉访客"你刚才的浏览也被留痕了"（纯内存计数，诚实标注不上传）。
- **落位与对比度**：曝光带上部暗区（y≈360–430，背景实测 (53,54,58)→(82,84,88)），`#dfe2e7` 实测 **9.3 → 7.3:1**；数字 `<b>` 加重至 1.22em 纯白。
- **数字落定**：进入 08 块时从 0 缓动到当前真实值（0.8s，与全站数字落定同曲线，IntersectionObserver threshold .6 一次性触发），结束后交还 `renderCount` 实时更新；reduced-motion 直出。
- **页脚瘦身**：中段 foot-audit 行整体移除（ids 迁至收束句，避免重复 id），页脚只留版权 + `audit.jsonl · 只追加`；`.foot-audit` CSS 删除。
- 无容器纯排版（延续首屏 v6.12 语法）。五套 verify 全绿（rise 23→24），detect 4 条既有 warning 无新增。

**画布 +20%**：台账线基线 .05→.06、落点 .10→.12、指针显影 .12→.144（+20%）；青色"执行中"头点不动（语义信号）。洗光三令牌（`--g-wash-steel/teal/out`）删除，:root 渐变令牌 13 → **10**。

**验收同步**：`verify-adapt` 布光层断言改为 demo/timeline/ability/start/**gate/edge = 2 层**（灯+暗角）、outro = 1 层；新增每盏灯 ≤3 色标、`--dim ∈ [0,.12]`、弧线单调性断言。`verify-deck` 令牌清单与计数同步为 10。五套全绿；`detect.mjs` 复扫无新增反模式（advisory 增量均为本节登记的灯值）。

### v6.15 · 地平线日出（逐屏定位）——当日否决，仅存决策（2026-09-29）

用户要求 02–07 背景加白色亮度光晕（太空看太阳从地球边际缓缓升起），拍板：白色亮度 / 逐屏定位 / 居中从底边探头 / 细腻。落地为逐块令牌（`--g-sun`/`--g-sun-rim` + 逐屏 `--sun-y/--sun-a/--sun-b`），过程中踩坑两次并修复，教训留档：

1. **复合令牌冻结**：含 `var()` 的渐变令牌放 `:root`，会在**声明元素**处就被解析——逐屏变量冻结成回落值（alpha 0），六屏全部无光。令牌必须住在使用块上，与使用值同址。
2. **"全绿但不可见"**：修复中途令牌声明一度缺失，而 verify 只断言了原始变量、未断言解析后的渐变——断言必须查到"真的画出来了"。

用户验收时否掉"每页一个"的形态（六个独立光晕读不出"同一天体在移动"），本版全量删除，仅保留本决策记录。

### v6.16 · 日轨弓形辉光——沿大圆弧滑行的彗尾式弧段（2026-09-29）

用户三改口后的现行形态，四点拍板：**辉光收归全局一层**（不是每页一个）、**翻页时肉眼可见辉光滑动**、**弧更大更平（页面至少显示 1/2 弧段）**、**光晕犀利清晰**；并确认：弧只是光晕的轨迹、本身不发光，光晕要能映射出轨迹。首版落成 32vh 圆盘后当日被否——**要的是"太阳划过地平线"的弓形弧段，不是滚动的圆球**；弓形辉光首版（.16 弱亮核 + 170px 大晕光）再被否——**"太糊了，完全没有地平线的感觉"**；定稿 = 锐利亮线当家、晕光只做紧贴的衬。动手前先删除 v6.15 全部残留（逐屏 `--sun-x/--sun-y/--sun-a/--sun-b` 令牌、死令牌引用 `--g-sun/--g-sun-rim`、过时注释、verify 旧断言），过程踩坑两次并修复，教训留档：

1. **含 `var()` 的复合令牌放 `:root` 会在声明元素处就被解析**——逐屏变量冻结成回落值（alpha 0），六屏全部无光。令牌必须住在使用块上（v6.15 教训，本次重建直接住使用块）。
2. **"断言全绿但渲染为零"**：中途令牌声明一度缺失（删了 `:root` 侧、忘了补使用块侧），verify 只断言了令牌值、没断言解析后的渐变——全绿但整页无光。新增"解析后必须真的画出来"断言（解析后的元素背景须含辉光渐变）。

- **全局唯一层**：`<div id="sun-halo">`，`position:fixed; inset:0; z-index:-2`——比台账画布（-1）更深，垫在一切内容之下；01 首屏 / 08 outro 是不透明底（`--g-hero`/`--g-outro`），自然遮住此层，无需开关。
- **弧 = 纯轨迹**：半径 1.8 倍页宽的大圆，圆心 (50%, 屏高 76% + R)；页宽对应弧段仅 ~29°，两端到弧顶只抬 ~9% 屏高（82px@900）——行星级平缓，全弧横贯页面；轨迹本身不画线。
- **弓形地平线（糊版辉光的换法）**：`环形亮带 × 锥角彗尾遮罩` 双层合成——径向剖面定"边际"：亮线 ~4px @ .5/.55 贴轨迹半径（与发丝线 .55 同族），向上紧致晕光 .18@−14px → .05@−46px，向下 30px 内压暗至 0——**线上亮、线下暗的不对称才有边际感**；锥角剖面定彗尾（37° 弧段恒定：头部 34°–36° 全亮、尾部自 .42 起坡渐亮，头亮尾淡指向行进方向）。白色亮度，不动色相，亮线峰值 α .55。首版 .16 弱亮核 + 170px 大晕光被否——晕光当家读作一团雾；换法核心 = 亮线当家、晕光为衬。
- **滚动驱动**：JS 由 scrollY 映射 t∈[#demo 顶, #edge 顶]，`--sun-phi = (2t−1)×±14.5°`，rAF 节流；`--sun-cx/cy/r` 在 resize/load 复测。翻页时整段弓形地平线沿弧滑行，尾迹随翻页生长——到 07 亮头抵达右端、整条地平线铺满，太阳"划过"地平线的轨迹由亮线的弧度完整映射。
- **验收**：`verify-deck` 令牌回 **10**（辉光为全局元素，不占令牌）；新增 ⑤b——#sun-halo 存在 / fixed / z -2、亮线 .55 与大气光 .18 在、锥角遮罩在、`--sun-phi` 逐屏单调（实测 −14.5°→−8.7°→−2.9°→2.9°→8.7°→14.5°）且覆盖 ±14.5°。截图 07 亲验：锐利亮弧横贯页底、线上晕光线下压暗、亮头在右——边际感成立。全部通过 ✓。

### v6.17 · 日出色温——日轨地平线换光（2026-09-29）

用户要求光弧"像太阳刚升起时的地平线"。v6.16 定稿的几何（大圆轨迹、锥角彗尾、锐利亮线当家）全部保留，改三点：

- **暖色温**：径向剖面从墨白单色 `rgba(232,233,236)` 换为日出暖族随距离渐熄——亮线峰值 `rgba(255,238,212)` α.62，线上 12px 琥珀 .26 → 34px .12 → 88px 深橙 .05 → 170px 熄灭；线下 26px 内压暗至 0。日出的"暖"即色温，世界规则"只动亮度"自此为这一层开口：光弧是全页唯一被许可的色温光事件，多色相仍然禁止。
- **方向修正**：v6.16 代码的宽晕实际挂在亮线下方（r− 侧 89px 渐亮），与注释"线上晕、线下暗"相反——几何上圆心在屏下，r− 是地面侧。本版把大气光改到 r+ 侧（天空侧），线下只留 26px 快速压暗，注释与实现首次一致。
- **日核**：同一层叠第二枚 110px 径向渐变（暖白核 .92 → 琥珀辉朵 .17），中心由新增 `--sun-x/--sun-y` 驱动 = 弧线头角的大圆坐标抬离亮线 10px（"刚升起"）；随 `--sun-phi` 同步滑行，头角前方 3° 遮罩衰减使太阳未到的天保持未亮。首版 32vh 圆盘被否的"滚动圆球"不回归：日核直径仅为弧段的 ~2°。

验收：IAB 1440×900 实测 02/04/06/07 四屏（日核沿地平线左→右滑行、暖晕贴线上行、线下压暗）+ 1024/390 两视口（resize 重测几何，手机端保持克制）；运行时诊断确认双层渐变与锥角遮罩均解析渲染、`--sun-phi` 单调覆盖 ±14.5°、正文对比度不受影响。clip 局部截图出现 fixed 层文字重复，为截图工具瓦片拼接伪影，整屏截图无此问题。全部通过 ✓。

### v6.17.1 · 日出深修——细节五处与兄弟层教训（2026-09-29）

用户复验后判定"细节还是没有到位"，深度优化一轮。v6.17 首日出形态保留，细修五处：

1. **日核从柔雾到点光源**：核峰值 .92 → .98、3px 内 .8 热心，辉朵半径 110 → 115px 但 12px 处即衰至 .42——刚升起的太阳是刺目的一点，不是一团等亮雾。
2. **头角晨曦**：锥角遮罩头部原 36°→39° 一刀切黑（3° ≈ 135px 内归零，一眼假）；改为 36°→44° 分级衰减（.6@38.5°、.26@41°、0@44°）——太阳未到的天留着 ~350px 渐熄的晨曦。
3. **热区压在太阳边**：全亮 plateau 从 ±2° 扩到 ±6°（#000 30–36deg），热质量随日核走，亮线"最热处"与太阳重合。
4. **太阳光柱**：日核层叠一枚 26×300px 垂直椭圆（峰值 α.12，自日核升入天空）——太阳刚升至地平线时最具辨识度的大气细节；扫过台账行时在文字后方、α 衰减快，可读性不受影响。
5. **亮线热缘**：峰值 .62 → .74（3px 热缘）、线上 5px 即衰至 .40 再入大气光；线下压暗 26 → 22px、留 9px .10 薄明地缘——"行星边际"更锐。

**兄弟层教训（真 bug，实测抓出）**：日核拆成 `#sun-core`（不受彗尾遮罩）后，`--sun-x/--sun-y` 仍只写 `#sun-halo` 内联样式——**内联自定义属性不随兄弟节点继承**，日核永远吃默认值 50%/76vh 画在画面正中（诊断里 `--sun-phi` 已是 14.48° 而核仍在 x≈720，即此症）。修法：`sunSet()` 把变量同时写到两层。另留验证教训：deck 大跨度 `scrollTo` 走平滑滚动，450ms 截图会拍在半路（日核看似卡在 t=0.5），必须轮询 scrollY 稳定后再成像。

验收：02（日核+光柱于左端升起）/04（sx=590 与诊断一致）/07（sx=1368 抵达右端）/390 手机视口全部实拍核对，日核位置与 `--sun-x` 逐屏吻合；光柱过台账行文字可读。全部通过 ✓。

### v6.17.2 · 日出再深修——天空纵深、光柱成形、太阳爬升（2026-09-29）

用户"继续优化"。三处再加一处分层重排：

1. **天空纵深**：大气光从 180px 归零改为三段分层衰减（5px .40 紧贴 → 40px .12 琥珀带 → 95px .055 → 190px .022 → 340px 熄）——低空被日光照透的纵深有了，末段 α .02 级、贴在锐利亮线上，不回"糊"。
2. **光柱成形**：单一 26×300px 椭圆偏"雾柱"，改为**紧杆 + 柔鞘**双层（10×290px α.16 直杆 + 34×320px α.07 外鞘）——读作一根光轴而非一团竖雾。
3. **太阳爬升（叙事）**：日核抬离亮线的高度由固定改为随滚动进度 6px → 16px（`--sun-y` 含 `6+10t`）——一天随 02→07 翻页推进，太阳缓缓爬离地平线。滚动映射、无动画，不违反禁呼吸光规则。
4. **色阶重排**：中段琥珀带微调（40px .11 → .12、95px .05 → .055），衔接新的长尾。

验收：02（sun-y=760.3，抬 6px）/04（光轴成形、sx=590）/07（sun-y=750.3，抬 16px，光轴沿右缘升入天际）/390 手机视口实拍核对；爬升量由 `--sun-y` 逐屏诊断证实。全部通过 ✓。

### v6.17.3 · 犀利度——锋刃与辉光分离（2026-09-29）

用户"做的可以，但还可不可以提高犀利度"。犀利度 = 热缘与环境亮度的对比斜率，三处同调：

1. **亮线**：热缘 α .74 → .90、收窄到 ~2px，3px 内骤降至 .30 再入大气光——锋刃先于辉光独立成形（"亮核 + 骤降 + 晕"三段），不再从热缘缓缓滑入晕光；线下压暗 22 → 16px、地缘减淡（-7px .07），暗面越实边际越利。
2. **日核**：辉朵半径 115 → 85px（12px 处 .42 → 7px 处 .5、18px 处 .2）——光球更小更"点"，与亮线交叠处的白热更集中。
3. **光柱**：紧杆 10 → 7px、α .16 → .18；柔鞘 34 → 26px、α .07 → .055——轴更细更定义。天空纵深长尾（340px）保留不动。

验收：04/07 实拍——亮线呈贴地平线的金色细刃、辉光与刃分离清晰、日核紧实一点、光柱细直；文字可读性不变。全部通过 ✓。

### v6.17.4 · 点改盘——日核从星芒到太阳（2026-09-29）

用户质疑"光源是一个点，看起来是不是不好看"。成立：v6.17.3 收锋后热核 >50% 亮度的实心区仅 ~7px,读作"星芒/闪光点"——**点是星星的形，太阳要有实体**。改法不是回到被否的 32vh 滚动圆球,而是给日核一枚**~20px 实心软边圆盘**（.98@0 → .96@5px → .82@10px → 16px 处 .42 软边 → 85px 辉朵不变）：近看是刚升起被曝光糊开的白金小硬币,远看仍收得住,与 85px 辉朵、细光轴、金色细刃保持同一犀利度语言。

验收：04/07 实拍——日核读作"太阳"而非闪光点,贴线小硬币的形态成立;其余层不变。全部通过 ✓。

### v6.17.5 · 地平线光效——日锚热斑与彗尾平滑（2026-09-29）

用户"优化地平线的光效"。弧线此前是等厚同色金线、只靠遮罩调 alpha,与真实日出"太阳近旁的地平线被照得发白涨开"不符。两处:

1. **日锚热斑**:`#sun-core` 增一枚贴线扁椭圆(520×68px,α.14 暖白金),太阳近旁的亮线局部变白、变厚,向两侧衰减回金色——单色径向渐变给不了的**沿线色温变化**由此实现,且不受彗尾遮罩(热斑属于太阳,不属于轨迹)。中心 = `--sun-y + --sun-lift`,JS 新暴露 `--sun-lift`(= 6+10t)使其精确贴线——太阳爬升时热斑跟着线走,不跟盘心走。
2. **彗尾平滑**:遮罩尾部 3 个控制点加密到 7 个(.28@5° → .42@9° → .55@14° → .65@19° → .74@23° → .82@27° → 全亮 30–36°),消弧向色阶折痕。

验收:02/04/07 实拍——热斑贴线、太阳近旁白热区随太阳滑行、亮线两侧渐回金色;正文可读性不变。全部通过 ✓。
