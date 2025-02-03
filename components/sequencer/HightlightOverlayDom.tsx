// HighlightOverlayDOM.tsx
import React, { useEffect, useRef } from "react"
import type { MeasureChunks } from "#types/ui"
import { getUniqueStepId, parseTransportPosition } from "#components/sequencer/utils"
import { StepRow } from "#components/sequencer/styled"
import useTone from "#tone/useTone"
import ToneManager from "#tone/class/ToneManager"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import { useGlobalActiveStepRef } from "#tone/ActiveStepProvider"

interface HighlightOverlayDOMProps {
  measureChunks: MeasureChunks
  registerSixteenthTick: (fn: () => void) => void
  unregisterSixteenthTick: (fn: () => void) => void
  measureCount: SequencerMeasuresValue
}

function HighlightOverlayDOM({
  measureChunks,
  registerSixteenthTick,
  unregisterSixteenthTick,
  measureCount,
}: HighlightOverlayDOMProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentStepRef = useGlobalActiveStepRef()
  const prevStepRef = useRef<number>(0)
  const { isPlaying, timeSignature, loopLength, bpm } = useTone()

  // Calculate total steps from measureChunks, if necessary:
  // e.g. sum up all stepObj across each chunk, or if they’re uniform, just measureChunks[0].length * measureChunks.length
  const totalSteps = measureChunks.reduce((acc, chunk) => acc + chunk.length, 0)

  // 1) Tone.js subscription for updating the ref on each 16th note
  useEffect(() => {
    function handleTick() {
      currentStepRef.current = (currentStepRef.current + 1) % totalSteps
    }
    registerSixteenthTick(handleTick)
    return () => unregisterSixteenthTick(handleTick)
  }, [currentStepRef, totalSteps, registerSixteenthTick, unregisterSixteenthTick])

  // reset highlight if user toggles global play
  useEffect(() => {
    if (isPlaying) {
      currentStepRef.current = 0
    }
  }, [currentStepRef, isPlaying])

  useEffect(() => {
    if (measureCount) {
      // Adjust active step based on Tone.Transport position
      const posString = ToneManager.toneTransport?.position as string
      if (posString) {
        const totalSixteenthCount = parseTransportPosition(posString, timeSignature)

        // Calculate new total steps based on updated measures
        const newTotalSteps = measureCount * timeSignature * loopLength

        // Determine the new active step
        const currentStep = totalSixteenthCount % newTotalSteps
        currentStepRef.current = Math.floor(currentStep)
      } else {
        currentStepRef.current = 0
      }
    }
  }, [currentStepRef, measureCount, loopLength, timeSignature])

  // 2) requestAnimationFrame loop to do the highlighting
  useEffect(() => {
    let frameId: number

    function animate() {
      const container = containerRef.current
      if (container) {
        // Remove highlight from prev cell
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

        // Update prev step
        prevStepRef.current = currentStepRef.current
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [currentStepRef])

  // 3) Render multi‐row layout.
  // Each row = one element from measureChunks; each cell has data-step-index = stepObj.originalIndex
  // Make sure it matches EXACTLY the layout you want.

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none flex flex-col gap-1 z-3">
      {measureChunks.map((rowSteps, rowIndex) => (
        // Use rowIndex as key or some unique measure ID
        <StepRow key={getUniqueStepId(rowIndex, 0)} className="grid grid-cols-12 gap-1">
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

export default HighlightOverlayDOM
