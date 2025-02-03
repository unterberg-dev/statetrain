import { useEffect, useRef } from "react"

interface UseTransportTickProps {
  onTick: () => void
  registerFn: (cb: () => void) => void
  unregisterFn: (cb: () => void) => void
  syncOnVisibility?: boolean
}

/**
 * A hook that subscribes to a Tone.js tick event (quarter, sixteenth, etc.)
 * and optionally handles visibility-based unregister/register & re-sync.
 *
 * @param onTick - Callback run on each tick
 * @param registerFn - e.g. `registerQuarterTick`, `registerSixteenthTick`
 * @param unregisterFn - e.g. `unregisterQuarterTick`, `unregisterSixteenthTick`
 * @param syncOnVisibility - Whether to unregister when hidden, re-register on show
 */
const useTransportTick = ({
  onTick,
  registerFn,
  unregisterFn,
  syncOnVisibility = false,
}: UseTransportTickProps) => {
  const callbackRef = useRef(onTick)
  useEffect(() => {
    callbackRef.current = onTick
  }, [onTick])

  useEffect(() => {
    function handleTick() {
      callbackRef.current()
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        unregisterFn(handleTick)
      } else {
        handleTick()
        registerFn(handleTick)
      }
    }

    if (syncOnVisibility) {
      document.addEventListener("visibilitychange", handleVisibilityChange)
    }

    if (!syncOnVisibility || !document.hidden) {
      handleTick()
      registerFn(handleTick)
    }

    // Cleanup
    return () => {
      if (syncOnVisibility) {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
      unregisterFn(handleTick)
    }
  }, [registerFn, unregisterFn, syncOnVisibility])
}

export default useTransportTick
