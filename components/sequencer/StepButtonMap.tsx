import { memo, useCallback, useEffect, useMemo } from "react"

import MissingStepButtonMap from "#components/sequencer/MissingStepsMap"
import { SequencerButton, StepRow, StepsOuter } from "#components/sequencer/styled"
import { chunkArray, getUniqueStepId } from "#components/sequencer/utils"
import type { StepSequencer } from "#tone/class/StepSequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"

const MemoizedStepRow = memo(StepRow)
const MemoizedSequencerButton = memo(SequencerButton)

interface StepButtonMapProps {
  activeStep?: number
  steps: Steps
  sequencer: StepSequencer | null
  setSequencerSteps: (steps: Steps) => void
}

const StepButtonMap = ({ activeStep, steps, sequencer, setSequencerSteps }: StepButtonMapProps) => {
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

  const stepObjects = useMemo(
    () => Array.from({ length: steps.length }, (_, i) => ({ originalIndex: i })),
    [steps],
  )

  // 3) Chunk by measure-size for a row-per-measure layout
  const measureChunks = useMemo(() => {
    return chunkArray(stepObjects, measureSize)
  }, [stepObjects, measureSize])

  return (
    <StepsOuter>
      {measureChunks.map((measureSteps, measureIndex) => (
        <MemoizedStepRow key={getUniqueStepId(measureIndex, 0)}>
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
                <div
                  style={{
                    opacity: isCurrent ? 1 : 0,
                    transition: `opacity ${20 / bpm}s ease-out`,
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-primaryLight bg-opacity-100 z-100 pointer-events-none"
                />
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
