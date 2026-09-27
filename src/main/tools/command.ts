import { spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import type { ToolImpl } from './index'

const DANGEROUS_RE =
  /(rm\s+-rf|Remove-Item\s+[^|]*-Recurse|del\s+\/[sq]|rmdir\s+\/s|format\s+[a-zA-Z]:|reg(add| delete)|regedit|shutdown|taskkill\s+\/f|diskpart|bcdedit|bcdboot|vssadmin|cipher\s+\/w|Set-ExecutionPolicy|Invoke-Expression|\biex\b|Remove-MpPreference|Set-MpPreference|Clear-Disk|Initialize-Disk|Format-Volume|net\s+user\s|net\s+localgroup|schtasks\s+\/create|powershell(\.exe)?\s+(-enc|-e |-encodedcommand))/i

const MAX_CAPTURE = 64 * 1024

function decode(buf: Buffer): string {
  try {
    return new TextDecoder('utf-8').decode(buf)
  } catch {
    return buf.toString('utf-8')
  }
}

export const runCommand: ToolImpl = {
  name: 'run_command',
  label: '运行命令',
  descForModel:
    '运行一条 PowerShell 命令并返回输出。适合查询系统信息、批量处理、调用 COM 自动化(如 WPS/Word)等。命令有超时限制,输出会被截断。',
  parameters: {
    type: 'object',
    properties: {
      command: { type: 'string', description: '要执行的 PowerShell 命令' },
      cwd: { type: 'string', description: '工作目录,默认用户主目录' },
      timeout_sec: { type: 'number', description: '超时秒数,默认 60,最大 600' }
    },
    required: ['command']
  },
  risk: (a) => (DANGEROUS_RE.test(String(a.command ?? '')) ? 'dangerous' : 'confirm'),
  approvalSummary: (a) => `运行命令:${String(a.command ?? '').slice(0, 120)}`,
  async run(args, ctx) {
    const command = String(args.command ?? '')
    const cwd = String(args.cwd ?? os.homedir())
    const timeout = Math.min(Math.max(Number(args.timeout_sec) || 60, 5), 600) * 1000
    // 让 PowerShell 以 UTF-8 输出,避免中文乱码
    const wrapped = `[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; ${command}`
    return await new Promise((resolve) => {
      const child = spawn(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', wrapped],
        { cwd, windowsHide: true }
      )
      let out = Buffer.alloc(0)
      let err = Buffer.alloc(0)
      let killed = false
      let killedReason = ''
      const kill = (why: string): void => {
        if (killed) return
        killed = true
        killedReason = why
        try {
          child.kill()
        } catch {
          /* ignore */
        }
      }
      const timer = setTimeout(() => kill('超时'), timeout)
      // 用户取消任务时立即中止命令,不再等它跑完
      ctx.signal?.addEventListener('abort', () => kill('用户取消'), { once: true })
      child.stdout.on('data', (d: Buffer) => {
        if (out.length < MAX_CAPTURE) out = Buffer.concat([out, d]).subarray(0, MAX_CAPTURE)
      })
      child.stderr.on('data', (d: Buffer) => {
        if (err.length < MAX_CAPTURE) err = Buffer.concat([err, d]).subarray(0, MAX_CAPTURE)
      })
      child.on('error', (e) => {
        clearTimeout(timer)
        resolve({ textForModel: `命令启动失败:${e.message}`, detail: { error: e.message } })
      })
      child.on('close', (code) => {
        clearTimeout(timer)
        const stdout = decode(out).trim()
        const stderr = decode(err).trim()
        const parts = [`退出码:${code ?? (killed ? `已终止(${killedReason || '未知原因'})` : '未知')}`]
        if (stdout) parts.push(`输出:\n${stdout}`)
        if (stderr) parts.push(`错误:\n${stderr}`)
        if (!stdout && !stderr) parts.push('(无输出)')
        resolve({
          textForModel: parts.join('\n').slice(0, 12000),
          detail: {
            command,
            cwd: path.resolve(cwd),
            exitCode: code,
            stdout: stdout.slice(0, 4000),
            stderr: stderr.slice(0, 2000),
            timedOut: killed && killedReason === '超时',
            cancelled: killed && killedReason === '用户取消'
          }
        })
      })
    })
  }
}
