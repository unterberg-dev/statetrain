import MissingStepButtonMap from "#components/sequencer/MissingStepsMap"
import { SequencerButton, StepRow, StepsOuter } from "#components/sequencer/styled"
import { chunkArray, getUniqueStepId } from "#components/sequencer/utils"
import type { StepSequencer } from "#tone/class/StepSequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"
import midiToNote from "#utils/midiToNote"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { navigate } from "vike/client/router"

const MemoizedStepRow = memo(StepRow)
const MemoizedSequencerButton = memo(SequencerButton)

interface StepButtonMapProps {
  activeStep?: number
  steps: Steps
  sequencer: StepSequencer | null
  setSequencerSteps: (steps: Steps) => void
  navTo?: string
  compact?: boolean
}

const StepButtonMap = ({
  activeStep,
  steps,
  sequencer,
  setSequencerSteps,
  navTo,
  compact,
}: StepButtonMapProps) => {
  const { timeSignature, loopLength } = useTone()
  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const { editStepIndex, setEditStepIndex } = useSequencer()

  // Ensure the UI updates when step count changes
  useEffect(() => {
    if (!sequencer || !steps.length) return
    setSequencerSteps(sequencer.getSteps())
  }, [sequencer, steps.length, setSequencerSteps])

  /** Toggles a step in the sequencer + updates local state copy of steps */
  const handleToggleStepEvent = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!sequencer) return
      const stepIndex = Number(e.currentTarget.dataset.stepIndex)

      if (navTo) {
        navigate(navTo)
      }

      setEditStepIndex((prev) => (prev === stepIndex ? undefined : stepIndex))
    },
    [setEditStepIndex, sequencer, navTo], // Remove `navTo` dependency
  )

  // 2) Create an array [0..(totalSteps-1)]
  const stepObjects = useMemo(
    () => Array.from({ length: steps.length }, (_, i) => ({ originalIndex: i })),
    [steps],
  )

  // 3) Chunk by measure-size for a row-per-measure layout
  const measureChunks = useMemo(() => {
    return chunkArray(stepObjects, measureSize)
  }, [stepObjects, measureSize])

  return (
    <StepsOuter $compact={compact}>
      {/* map over each measure */}
      {measureChunks.map((measureSteps, measureIndex) => (
        <MemoizedStepRow
          key={getUniqueStepId(measureIndex, 0)} // measure-level key
          $compact={compact}
        >
          {measureSteps.map((stepObj, localIndex) => {
            const globalStepIdx = stepObj.originalIndex
            const isCurrent = activeStep === globalStepIdx
            const isArmed = steps[globalStepIdx].notes.length > 0
            const uniqueKey = getUniqueStepId(measureIndex, localIndex)

            // Determine if it’s a quarter note step (4ths) or an eighth note step
            const isHalf = globalStepIdx === 0
            const isQuarter = globalStepIdx % 4 === 0
            const isEighth = globalStepIdx % 2 === 0

            let computedState: "current" | "inactive" | "halfs" | "eigths" | "fourths" | "edit"
            if (isCurrent) {
              // if it’s the active step, highlight with "current"
              computedState = "current"
            } else if (isQuarter) {
              // highlight quarter steps
              computedState = "fourths"
            } else if (isEighth) {
              // highlight eighth steps
              computedState = "eigths"
            } else if (isHalf) {
              // highlight eighth steps
              computedState = "halfs"
            } else {
              // everything else
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
                  $compact={compact}
                  data-step-index={globalStepIdx}
                  onClick={handleToggleStepEvent}
                >
                  {!compact && (
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
                  )}
                </MemoizedSequencerButton>
              </div>
            )
          })}
        </MemoizedStepRow>
      ))}
      <MissingStepButtonMap
        steps={steps}
        measureSize={measureSize}
        totalLength={steps.length}
        compact={compact}
      />
    </StepsOuter>
  )
}

export default StepButtonMap
