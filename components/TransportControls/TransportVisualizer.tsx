import { CircleDashed, CircleSlash2, CircleX, Smile } from "lucide-react"
import { memo, useEffect, useMemo, useRef, useState } from "react"

import useTone from "#tone/useTone"
import ToneManager from "#tone/ToneManager"

const TransportVisualizer = memo(() => {
  const [tickCount, setTickCount] = useState(0)
  const { isPlaying, loopLength, timeSignature } = useTone()

  const measures = useMemo(() => Array.from({ length: loopLength }, (_, i) => i), [loopLength])
  const ticks = useMemo(() => Array.from({ length: timeSignature }, (_, i) => i), [timeSignature])

  // Which tick are we on?
  const totalSteps = loopLength * timeSignature
  const currentStep = isPlaying ? tickCount % totalSteps : undefined

  // subscribe to transport ticks
  useEffect(() => {
    function handleTick() {
      setTickCount((prev) => prev + 1)
    }
    ToneManager.events.on("transportTick", handleTick)

    return () => {
      ToneManager.events.off("transportTick", handleTick)
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      setTickCount(0)
    }
  }, [isPlaying])

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
