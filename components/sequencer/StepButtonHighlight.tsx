// HighlightOverlayDOM.tsx
import { useCallback, useEffect, useMemo, useRef } from "react"
import type { MeasureChunks } from "#types/ui"
import { getUniqueStepId, parseTransportPosition } from "#components/sequencer/utils"
import { StepRow } from "#components/sequencer/styled"
import useTone from "#tone/useTone"
import ToneManager from "#tone/class/ToneManager"
import { useGlobalActiveStepRef } from "#tone/ActiveStepProvider"
import useSequencer from "#tone/useSequencer"
import { getCurrentSixteenthStep } from "#utils/getSteps"
import useTransportTick from "#tone/useTransportTick"

interface StepButtonHighlightProps {
  measureChunks: MeasureChunks
}

function StepButtonHighlight({ measureChunks }: StepButtonHighlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentStepRef = useGlobalActiveStepRef()
  const prevStepRef = useRef<number>(0)

  const { isPlaying, timeSignature, loopLength, bpm, registerSixteenthTick, unregisterSixteenthTick } =
    useTone()
  const {
    currentSequencer: { measures },
  } = useSequencer()

  const totalSteps = useMemo(
    () => measureChunks.reduce((acc, chunk) => acc + chunk.length, 0),
    [measureChunks],
  )

  const onSixteenthTick = useCallback(() => {
    currentStepRef.current = getCurrentSixteenthStep(totalSteps)
  }, [currentStepRef, totalSteps])

  useTransportTick({
    onTick: onSixteenthTick,
    registerFn: registerSixteenthTick,
    unregisterFn: unregisterSixteenthTick,
    syncOnVisibility: true,
  })

  // reset highlight if user toggles global play
  useEffect(() => {
    if (isPlaying) {
      currentStepRef.current = 0
    }
  }, [currentStepRef, isPlaying])

  useEffect(() => {
    if (measures) {
      const posString = ToneManager.toneTransport?.position as string
      if (posString) {
        const totalSixteenthCount = parseTransportPosition(posString, timeSignature)
        const newTotalSteps = measures * timeSignature * loopLength

        const currentStep = totalSixteenthCount % newTotalSteps
        currentStepRef.current = Math.floor(currentStep)
      } else {
        currentStepRef.current = 0
      }
    }
  }, [currentStepRef, measures, loopLength, timeSignature])

  // 2) requestAnimationFrame loop to do the highlighting
  useEffect(() => {
    let frameId: number

    function animate() {
      const container = containerRef.current
      if (container) {
        const prevCell = container.querySelector(
          `[data-step-index="${prevStepRef.current}"]`,
        ) as HTMLDivElement | null
        if (prevCell) {
          prevCell.style.opacity = "0"
        }

        // Add highlight to new cell
        const currentCell = container.querySelector(
          `[data-step-index="${currentStepRef.current}"]`,
        ) as HTMLDivElement | null
        if (currentCell) {
          currentCell.style.opacity = "1"
        }
        prevStepRef.current = currentStepRef.current
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [currentStepRef])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none flex flex-col gap-1 z-3">
      {measureChunks.map((rowSteps, rowIndex) => (
        // Use rowIndex as key or some unique measure ID
        <StepRow key={getUniqueStepId(rowIndex, 0)}>
          {rowSteps.map((stepObj) => (
            <div
              key={stepObj.originalIndex}
              data-step-index={stepObj.originalIndex}
              className="relative flex-1 rounded"
              style={{
                // Default highlight style
                background: "var(--color-primaryLight)",
                opacity: 0,
                transition: `opacity ${20 / bpm}s ease-out`,
              }}
            />
          ))}
        </StepRow>
      ))}
    </div>
  )
}

export default StepButtonHighlight
