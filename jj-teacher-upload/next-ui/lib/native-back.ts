'use client'

export type NativeBackHandler = () => boolean

interface NativeBackEntry {
  id: number
  priority: number
  handler: NativeBackHandler
}

declare global {
  interface Window {
    zhiyuBackHandlers?: NativeBackEntry[]
    zhiyuBackHandlerId?: number
    zhiyuHandleNativeBack?: () => boolean
  }
}

function ensureNativeBackBridge() {
  if (typeof window === 'undefined') return
  if (!window.zhiyuBackHandlers) window.zhiyuBackHandlers = []
  if (typeof window.zhiyuBackHandlerId !== 'number') window.zhiyuBackHandlerId = 1

  window.zhiyuHandleNativeBack = () => {
    const handlers = [...(window.zhiyuBackHandlers || [])].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return b.id - a.id
    })

    for (const entry of handlers) {
      try {
        if (entry.handler()) return true
      } catch {
        // A broken handler should not block the app-level fallback.
      }
    }

    return false
  }
}

export function registerNativeBackHandler(handler: NativeBackHandler, priority = 0) {
  if (typeof window === 'undefined') return () => {}

  ensureNativeBackBridge()
  const id = window.zhiyuBackHandlerId || 1
  window.zhiyuBackHandlerId = id + 1
  const entry: NativeBackEntry = { id, priority, handler }
  window.zhiyuBackHandlers = [...(window.zhiyuBackHandlers || []), entry]

  return () => {
    window.zhiyuBackHandlers = (window.zhiyuBackHandlers || []).filter((item) => item.id !== id)
  }
}
