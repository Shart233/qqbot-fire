import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useCommandHistory(storageKey: string = 'cmdHistory', maxItems: number = 50) {
  const [history, setHistory] = useLocalStorage<string[]>(storageKey, [])
  const [index, setIndex] = useState(-1)

  const push = useCallback((cmd: string) => {
    setHistory(prev => {
      const next = [cmd, ...prev.filter(c => c !== cmd)]
      return next.slice(0, maxItems)
    })
    setIndex(-1)
  }, [setHistory, maxItems])

  const navigateUp = useCallback((): string | null => {
    if (history.length === 0) return null
    const next = Math.min(index + 1, history.length - 1)
    setIndex(next)
    return history[next]
  }, [history, index])

  const navigateDown = useCallback((): string | null => {
    if (index <= 0) {
      setIndex(-1)
      return ''
    }
    const next = index - 1
    setIndex(next)
    return history[next]
  }, [history, index])

  const reset = useCallback(() => setIndex(-1), [])

  return { history, push, navigateUp, navigateDown, reset }
}
