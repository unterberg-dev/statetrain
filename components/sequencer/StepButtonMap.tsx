import { memo, useCallback, useEffect, useMemo } from "react"

import MissingStepButtonMap from "#components/sequencer/MissingStepsMap"
import { SequencerButton, StepRow, StepsOuter } from "#components/sequencer/styled"
import { getUniqueStepId } from "#components/sequencer/utils"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { MeasureChunks } from "#types/ui"

const MemoizedStepRow = memo(StepRow)
const MemoizedSequencerButton = memo(SequencerButton)

interface StepButtonMapProps {
  measureChunks: MeasureChunks
}

const StepButtonMap = ({ measureChunks }: StepButtonMapProps) => {
  const { timeSignature, loopLength } = useTone()
  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const {
    editStepIndex,
    setEditStepIndex,
    currentSequencer: { steps, sequencer },
  } = useSequencer()

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
