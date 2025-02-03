import { memo, useCallback, useEffect, useMemo } from "react"

import MissingStepButtonMap from "#components/sequencer/MissingStepsMap"
import { SequencerButton, StepRow, StepsOuter } from "#components/sequencer/styled"
import { getUniqueStepId } from "#components/sequencer/utils"
import type { Sequencer } from "#tone/class/Sequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"
import type { MeasureChunks } from "#types/ui"

const MemoizedStepRow = memo(StepRow)
const MemoizedSequencerButton = memo(SequencerButton)

interface HollowGridOverlayProps {
  measureChunks: MeasureChunks
  activeStep: number | undefined
  bpm: number
}

// This component expects the same chunking data as your button map.
export const HollowGridOverlay = memo(({ measureChunks, activeStep, bpm }: HollowGridOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col gap-1 z-3">
      {measureChunks.map((measureSteps, measureIndex) => (
        <MemoizedStepRow
          key={`overlay-row-${getUniqueStepId(measureIndex, 0)}`}
          // Use the same grid layout as your button row.
          className="grid grid-cols-12" // Adjust columns to match measureSize
        >
          {measureSteps.map((stepObj) => {
            const globalStepIdx = stepObj.originalIndex
            const isActive = stepObj.originalIndex === activeStep
            return (
              <div className="relative flex-1" key={`${globalStepIdx}`}>
                <div
                  className="bg-primaryLight absolute inset-0 rounded"
                  style={{
                    transition: `opacity ${20 / bpm}s ease-out`,
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </div>
            )
          })}
        </MemoizedStepRow>
      ))}
    </div>
  )
})

interface StepButtonMapProps {
  measureChunks: MeasureChunks
  steps: Steps
  sequencer: Sequencer | null
  setSequencerSteps: (steps: Steps) => void
}

const ActiveOverlay = memo(({ isActive, bpm }: { isActive: boolean; bpm: number }) => {
  return (
    <div
      style={{
        opacity: isActive ? 1 : 0,
        transition: `opacity ${20 / bpm}s ease-out`,
      }}
      className="absolute top-0 left-0 w-full h-full bg-primaryLight bg-opacity-100 z-100 pointer-events-none"
    />
  )
})

const StepButtonMap = ({ measureChunks, steps, sequencer, setSequencerSteps }: StepButtonMapProps) => {
  const { timeSignature, loopLength, bpm } = useTone()
  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const { editStepIndex, setEditStepIndex } = useSequencer()

  useEffect(() => {
    if (!sequencer || !steps.length) return
    setSequencerSteps(sequencer.getSteps())
  }, [sequencer, steps.length, setSequencerSteps])

  const handleToggleStepEvent = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!sequencer) return
      const stepIndex = Number(e.currentTarget.dataset.stepIndex)

      setEditStepIndex((prev) => (prev === stepIndex ? undefined : stepIndex))
    },
    [setEditStepIndex, sequencer],
  )

  return (
    <StepsOuter>
      {measureChunks.map((measureSteps, measureIndex) => (
        <MemoizedStepRow key={getUniqueStepId(measureIndex, 0)}>
          {measureSteps.map((stepObj, localIndex) => {
            const globalStepIdx = stepObj.originalIndex
            const isArmed = steps[globalStepIdx].notes.length > 0
            const uniqueKey = getUniqueStepId(measureIndex, localIndex)

            // Determine if it’s a quarter note step (4ths) or an eighth note step
            const isHalf = globalStepIdx === 0
            const isQuarter = globalStepIdx % 4 === 0
            const isEighth = globalStepIdx % 2 === 0

            let computedState: "current" | "inactive" | "halfs" | "eigths" | "fourths" | "edit"

            if (isQuarter) {
              computedState = "fourths"
            } else if (isEighth) {
              computedState = "eigths"
            } else if (isHalf) {
              computedState = "halfs"
            } else {
              computedState = "inactive"
            }
            if (editStepIndex === globalStepIdx) {
              computedState = "edit"
            }

            // Convert MIDI notes to readable note names
            const notes = steps[globalStepIdx].notes.length ? steps[globalStepIdx].notes : undefined

            return (
              <div className="relative flex-1" key={uniqueKey}>
                <MemoizedSequencerButton
                  $state={computedState}
                  $armed={isArmed}
                  data-step-index={globalStepIdx}
                  onClick={handleToggleStepEvent}
                >
                  <div className="grid grid-cols-3 gap-1 text-micro p-1 items-baseline">
                    {notes?.map((note) => (
                      <div
                        key={note.value}
                        className="flex-1 flex w-5 h-5 bg-primarySuperLight text-primary text-center items-center justify-center"
                      >
                        {note.value}
                      </div>
                    ))}
                  </div>
                </MemoizedSequencerButton>
                {/* <ActiveOverlay bpm={bpm} isActive={isCurrent} /> */}
              </div>
            )
          })}
        </MemoizedStepRow>
      ))}
      <MissingStepButtonMap steps={steps} measureSize={measureSize} totalLength={steps.length} />
    </StepsOuter>
  )
}

export default StepButtonMap
