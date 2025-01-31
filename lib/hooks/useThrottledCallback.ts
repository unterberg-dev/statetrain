import { useRef, useCallback } from "react"

// biome-ignore lint/suspicious/noExplicitAny: generic
function useThrottledCallback<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const lastCallRef = useRef<number>(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        callback(...args)
      }
    },
    [callback, delay],
  )
}

export default useThrottledCallback
