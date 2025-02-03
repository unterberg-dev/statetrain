import { CircleDashed, CircleX, Smile } from "lucide-react"
import { memo, useCallback, useEffect, useMemo, useRef } from "react"

import useTone from "#tone/useTone"
import useTransportTick from "#tone/useTransportTick"

const TransportVisualizer = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tickRef = useRef(0)

  const { isPlaying, loopLength, transport, timeSignature, registerQuarterTick, unregisterQuarterTick } =
    useTone()

  // Total quarter steps per loop
  const totalQuarterSteps = loopLength * timeSignature

  // Imperative update: find the tick element with the matching data-step
  // and add an "active-tick" class while removing it from others.
  const updateActiveTick = useCallback(() => {
    if (!containerRef.current) return

    // Get all tick elements that have a data attribute "data-step"
    const tickElements = containerRef.current.querySelectorAll("[data-step]")
    for (const el of tickElements as NodeListOf<HTMLElement>) {
      const step = Number(el.getAttribute("data-step"))
      if (step === tickRef.current) {
        el.classList.add("active-tick")
      } else {
        el.classList.remove("active-tick")
      }
    }
  }, [])

  // Our tick handler (using a ref for the tick value instead of state)
  const handleTick = useCallback(() => {
    if (!transport) return
    const quarterIndex = Math.floor(transport.ticks / transport.PPQ)
    const step = quarterIndex % totalQuarterSteps
    tickRef.current = step
    updateActiveTick()
  }, [transport, totalQuarterSteps, updateActiveTick])

  // Use the transport tick hook to call our imperative tick handler.
  useTransportTick({
    onTick: handleTick,
    registerFn: registerQuarterTick,
    unregisterFn: unregisterQuarterTick,
    syncOnVisibility: true,
  })

  // When playback stops, reset the tick value and update the DOM.
  useEffect(() => {
    if (!isPlaying) {
      tickRef.current = 0
      updateActiveTick()
    }
  }, [isPlaying, updateActiveTick])

  // Prepare arrays for measures and ticks.
  const measures = useMemo(() => Array.from({ length: loopLength }, (_, i) => i), [loopLength])
  const ticks = useMemo(() => Array.from({ length: timeSignature }, (_, i) => i), [timeSignature])

  return (
    // The container is marked with ref so we can update its children directly.
    <div className="flex flex-col items-stretch justify-between" ref={containerRef}>
      {measures.map((measure) => (
        <div key={measure} className="flex gap-1">
          {ticks.map((tick) => {
            const stepIndex = measure * timeSignature + tick
            // You can also add an extra class if this tick is the first tick of a measure.
            const isMeasure = tick === 0

            return (
              <div
                key={tick}
                data-step={stepIndex}
                className={`tick w-3 h-3 flex items-center justify-center ${isMeasure ? "isMeasure" : ""}`}
              >
                {isPlaying ? (
                  <>
                    {/* Always render the same markup. The "active-tick" class controls which icon is shown */}
                    <CircleDashed strokeWidth={3} className="tick-dashed text-warningDark" />
                    <CircleX strokeWidth={3} className="tick-x text-warningLight" />
                    <Smile strokeWidth={3} className="tick-smile text-white" />
                  </>
                ) : // When not playing, show a static indicator:
                stepIndex === 0 ? (
                  <Smile strokeWidth={3} className="text-white" />
                ) : (
                  <CircleDashed strokeWidth={3} className="text-warningDark" />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
})

export default TransportVisualizer

// import { CircleDashed, CircleX, Smile } from "lucide-react"
// import { memo, useCallback, useEffect, useMemo, useState } from "react"

// import useTone from "#tone/useTone"
// import useTransportTick from "#tone/useTransportTick"

// const TransportVisualizer = memo(() => {
//   const [tickCount, setTickCount] = useState(0)

//   const { isPlaying, loopLength, transport, timeSignature, registerQuarterTick, unregisterQuarterTick } =
//     useTone()

//   // We'll often need total quarter steps in a loop
//   const totalQuarterSteps = loopLength * timeSignature

//   // 2) Our stable handleTick callback
//   const handleTick = useCallback(() => {
//     if (!transport) return

//     const quarterIndex = Math.floor(transport.ticks / transport.PPQ)
//     const step = quarterIndex % totalQuarterSteps

//     setTickCount(step)
//   }, [totalQuarterSteps, transport])

//   useTransportTick({
//     onTick: handleTick,
//     registerFn: registerQuarterTick,
//     unregisterFn: unregisterQuarterTick,
//     syncOnVisibility: true,
//   })

//   useEffect(() => {
//     if (!isPlaying) {
//       setTickCount(0)
//     }
//   }, [isPlaying])

//   // 5) Which step do we highlight?
//   const currentStep = isPlaying ? tickCount : undefined

//   // Render your measures & ticks
//   const measures = useMemo(() => Array.from({ length: loopLength }, (_, i) => i), [loopLength])

//   const ticks = useMemo(() => Array.from({ length: timeSignature }, (_, i) => i), [timeSignature])

//   return (
//     <div className="flex flex-col items-stretch justify-between">
//       {measures.map((measure) => (
//         <div key={measure} className="flex gap-1">
//           {ticks.map((tick) => {
//             const isFirstTick = measure === 0 && tick === 0
//             const stepIndex = measure * timeSignature + tick
//             const isActive = currentStep === stepIndex
//             const isMeasure = tick === 0

//             return (
//               <div key={tick} className="w-3 h-3 flex items-center justify-center">
//                 {isPlaying && (
//                   <>
//                     <CircleDashed
//                       strokeWidth={3}
//                       className={`text-warningDark ${isActive ? "hidden" : "block"}`}
//                     />
//                     <CircleX
//                       strokeWidth={3}
//                       className={`text-warningLight ${isActive && !isMeasure ? "block" : "hidden"}`}
//                     />
//                     {isMeasure && isActive && <Smile strokeWidth={3} className="text-white" />}
//                   </>
//                 )}
//                 {!isPlaying && isFirstTick && <Smile strokeWidth={3} className="text-white" />}
//                 {!isPlaying && !isFirstTick && <CircleDashed strokeWidth={3} className="text-warningDark" />}
//               </div>
//             )
//           })}
//         </div>
//       ))}
//     </div>
//   )
// })

// export default TransportVisualizer
