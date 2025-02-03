import { CircleDashed, CircleX, Smile } from "lucide-react"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

import useTone from "#tone/useTone"
import useTransportTick from "#tone/useTransportTick"

const TransportVisualizer = memo(() => {
  const [tickCount, setTickCount] = useState(0)

  const { isPlaying, loopLength, transport, timeSignature, registerQuarterTick, unregisterQuarterTick } =
    useTone()

  // We'll often need total quarter steps in a loop
  const totalQuarterSteps = loopLength * timeSignature

  // 2) Our stable handleTick callback
  const handleTick = useCallback(() => {
    if (!transport) return

    const quarterIndex = Math.floor(transport.ticks / transport.PPQ)
    const step = quarterIndex % totalQuarterSteps

    setTickCount(step)
  }, [totalQuarterSteps, transport])

  useTransportTick({
    onTick: handleTick,
    registerFn: registerQuarterTick,
    unregisterFn: unregisterQuarterTick,
    syncOnVisibility: true,
  })

  useEffect(() => {
    if (!isPlaying) {
      setTickCount(0)
    }
  }, [isPlaying])

  // 5) Which step do we highlight?
  const currentStep = isPlaying ? tickCount : undefined

  // Render your measures & ticks
  const measures = useMemo(() => Array.from({ length: loopLength }, (_, i) => i), [loopLength])

  const ticks = useMemo(() => Array.from({ length: timeSignature }, (_, i) => i), [timeSignature])

  return (
    <div className="flex flex-col items-stretch justify-between">
      {measures.map((measure) => (
        <div key={measure} className="flex gap-1">
          {ticks.map((tick) => {
            const isFirstTick = measure === 0 && tick === 0
            const stepIndex = measure * timeSignature + tick
            const isActive = currentStep === stepIndex
            const isMeasure = tick === 0

            return (
              <div key={tick} className="w-3 h-3 flex items-center justify-center">
                {isPlaying && (
                  <>
                    <CircleDashed
                      strokeWidth={3}
                      className={`text-warningDark ${isActive ? "hidden" : "block"}`}
                    />
                    <CircleX
                      strokeWidth={3}
                      className={`text-warningLight ${isActive && !isMeasure ? "block" : "hidden"}`}
                    />
                    {isMeasure && isActive && <Smile strokeWidth={3} className="text-white" />}
                  </>
                )}
                {!isPlaying && isFirstTick && <Smile strokeWidth={3} className="text-white" />}
                {!isPlaying && !isFirstTick && <CircleDashed strokeWidth={3} className="text-warningDark" />}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
})

export default TransportVisualizer
