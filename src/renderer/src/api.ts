import type { TraceApi } from '@shared/types'

declare global {
  interface Window {
    trace: TraceApi
  }
}

export const api = window.trace
