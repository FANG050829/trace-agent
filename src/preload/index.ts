import { contextBridge, ipcRenderer } from 'electron'
import type { TraceApi } from '@shared/types'

function subscribe<T>(channel: string, cb: (payload: T) => void): () => void {
  const listener = (_e: unknown, payload: T): void => cb(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

const api: TraceApi = {
  listSessions: () => ipcRenderer.invoke('sessions:list'),
  createSession: (title?: string) => ipcRenderer.invoke('sessions:create', title),
  deleteSession: (id: string) => ipcRenderer.invoke('sessions:delete', id),
  openSession: (id: string) => ipcRenderer.invoke('sessions:open', id),
  renameSession: (id: string, title: string) => ipcRenderer.invoke('sessions:rename', id, title),

  send: (sessionId: string, text: string) => ipcRenderer.invoke('agent:send', sessionId, text),
  cancel: (sessionId: string) => ipcRenderer.invoke('agent:cancel', sessionId),
  respondApproval: (sessionId: string, approvalId: string, approved: boolean) =>
    ipcRenderer.invoke('agent:respond', sessionId, approvalId, approved),

  listTemplates: () => ipcRenderer.invoke('templates:list'),
  instantiateTemplate: (id: string, params: Record<string, string>) => ipcRenderer.invoke('templates:instantiate', id, params),

  listSkills: () => ipcRenderer.invoke('skills:list'),
  saveSkill: (s) => ipcRenderer.invoke('skills:save', s),
  deleteSkill: (id: string) => ipcRenderer.invoke('skills:delete', id),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (s) => ipcRenderer.invoke('settings:save', s),
  testProvider: (p) => ipcRenderer.invoke('settings:testProvider', p),
  listOllamaModels: (baseUrl: string) => ipcRenderer.invoke('settings:testOllama', baseUrl),

  pickDirectory: () => ipcRenderer.invoke('dialog:pickDirectory'),
  pickFile: () => ipcRenderer.invoke('dialog:pickFile'),
  exportSession: (id: string) => ipcRenderer.invoke('export:session', id),
  openExternal: (url: string) => ipcRenderer.invoke('app:openExternal', url),
  openDataDir: () => ipcRenderer.invoke('app:openDataDir'),

  onAgentEvent: (cb) => subscribe('agent:event', cb),
  onAgentDelta: (cb) => subscribe('agent:delta', cb),
  onAgentState: (cb) => subscribe('agent:state', cb)
}

contextBridge.exposeInMainWorld('trace', api)
