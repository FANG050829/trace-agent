/* 假模型服务 v2:一次会话串起 原生键鼠工具 + 局域网审批 + 定时技能 三条新链路
 * 场景:input_screen_size(安全,自动执行)→ mouse_move(需审批 → 走局域网批准)→ 收尾文本 */
import http from 'node:http'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function sse(res, events) {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' })
  void (async () => {
    for (const ev of events) {
      await sleep(ev.delay ?? 120)
      res.write(`data: ${JSON.stringify(ev.data)}\n\n`)
    }
    res.write('data: [DONE]\n\n')
    res.end()
  })()
}

function toolCallChunks(index, id, name, args) {
  const half = Math.ceil(args.length / 2)
  const chunk = (delta, extra) => ({
    delay: extra?.delay ?? 200,
    data: { choices: [{ delta, ...(extra?.finish ? { finish_reason: extra.finish } : {}) }] }
  })
  return [
    chunk({ tool_calls: [{ index, id, type: 'function', function: { name, arguments: '' } }] }),
    chunk({ tool_calls: [{ index, function: { arguments: args.slice(0, half) } }] }),
    chunk({ tool_calls: [{ index, function: { arguments: args.slice(half) } }] }),
    chunk({}, { finish: 'tool_calls' })
  ]
}

const textChunk = (text) => ({ delay: 150, data: { choices: [{ delta: { content: text } }] } })
const stopChunk = { delay: 100, data: { choices: [{ delta: {}, finish_reason: 'stop' }] } }
const emptyToolEnd = { delay: 100, data: { choices: [{ delta: {}, finish_reason: 'tool_calls' }] } }

const server = http.createServer((req, res) => {
  if (!req.url.includes('/chat/completions')) {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ data: [{ id: 'demo-model' }] }))
    return
  }
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    const msgs = JSON.parse(body).messages ?? []
    const toolResults = msgs.filter((m) => m.role === 'tool').length
    if (toolResults === 0) {
      sse(res, [
        ...toolCallChunks(0, 'v2-size', 'input_screen_size', '{}'),
        ...toolCallChunks(1, 'v2-move', 'mouse_move', JSON.stringify({ x: 640, y: 400 }))
      ])
    } else if (toolResults === 2) {
      sse(res, [textChunk('端到端 v2 完成:屏幕尺寸已读取,鼠标移动已获局域网批准并执行。'), stopChunk])
    } else {
      sse(res, [emptyToolEnd])
    }
  })
})

server.listen(11500, '127.0.0.1', () => console.log('fake-llm2 on 127.0.0.1:11500'))
