/* 本地假模型服务:按剧本返回工具调用,用于端到端验收 UI 闭环(不发往任何外部服务)
 * 用法:node tests/fake-llm.mjs  (监听 127.0.0.1:11499)
 * 剧本:第 1 轮 → 调用 fs_read_file(安全,自动执行)+ run_command(需审批);
 *       第 2 轮(出现 tool 结果后)→ 输出收尾文本。 */
import http from 'node:http'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function sse(res, events) {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' })
  let i = 0
  const tick = async () => {
    for (const ev of events) {
      await sleep(ev.delay ?? 120)
      res.write(`data: ${JSON.stringify(ev.data)}\n\n`)
    }
    res.write('data: [DONE]\n\n')
    res.end()
  }
  void tick()
}

function toolCallChunks(index, id, name, args) {
  // 按 OpenAI 流式协议拆成 3 块:名字 → 参数前半 → 参数后半
  const half = Math.ceil(args.length / 2)
  return [
    { delay: 150, data: { choices: [{ delta: { tool_calls: [{ index, id, type: 'function', function: { name, arguments: '' } }] } }] } },
    { delay: 350, data: { choices: [{ delta: { tool_calls: [{ index, function: { arguments: args.slice(0, half) } }] } }] } },
    { delay: 350, data: { choices: [{ delta: { tool_calls: [{ index, function: { arguments: args.slice(half) } }] } }] } },
    { delay: 100, data: { choices: [{ delta: {}, finish_reason: 'tool_calls' }] } }
  ]
}

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
    const hasToolResult = msgs.some((m) => m.role === 'tool')
    if (!hasToolResult) {
      // 第 1 轮:读一个真实文件(安全)+ 跑一条需要审批的命令
      const events = [
        { delay: 200, data: { choices: [{ delta: { content: '' } }] } },
        ...toolCallChunks(0, 'demo-read', 'fs_read_file', JSON.stringify({ path: 'E:\\ai-project\\ZCode\\trace-agent\\package.json' })),
        ...toolCallChunks(1, 'demo-cmd', 'run_command', JSON.stringify({ command: 'Write-Output "留痕 Agent 端到端演示"', timeout_sec: 10 }))
      ]
      sse(res, events)
    } else {
      // 第 2 轮:收尾文本
      sse(res, [
        { delay: 200, data: { choices: [{ delta: { content: '演示完成。' } }] } },
        { delay: 150, data: { choices: [{ delta: { content: '两项工具调用的参数与结果都已写入右侧审计时间线,点击任意一条可展开原始 JSON。' } }] } },
        { delay: 100, data: { choices: [{ delta: {}, finish_reason: 'stop' }] } }
      ])
    }
  })
})

server.listen(11499, '127.0.0.1', () => console.log('fake-llm on 127.0.0.1:11499'))
