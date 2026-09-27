import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

/** 渲染端兜底:界面崩溃时给出可操作的错误页,而不是白屏 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div className="crash-screen">
          <div className="welcome-mark" style={{ color: "var(--warn)" }}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.8L21 19.5H3z" /><path d="M12 10v4M12 16.6v.01" /></svg></div>
          <h2>界面出了点问题</h2>
          <pre className="tool-pre">{this.state.error.stack?.slice(0, 2000) ?? String(this.state.error)}</pre>
          <button className="primary" onClick={() => location.reload()}>
            重新加载
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
