import { SequencerButton } from "#components/sequencer/styled"
import { chunkArray, getUniqueStepId } from "#components/sequencer/utils"
import type { StepSequencer } from "#tone/class/StepSequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"
import { useCallback, useEffect, useMemo } from "react"
import { navigate } from "vike/client/router"

interface StepButtonMapProps {
  activeStep?: number
  steps: Steps
  sequencer: StepSequencer | null
  setSequencerSteps: (steps: Steps) => void
  navTo?: string
}

const StepButtonMap = ({ activeStep, steps, sequencer, setSequencerSteps, navTo }: StepButtonMapProps) => {
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
      console.log("navTo", navTo)

      if (navTo) {
        const navigateOnButtonClick = navTo ? navigate(navTo) : () => {}
        await navigateOnButtonClick
      }
      setEditStepIndex(stepIndex)
    },
    [setEditStepIndex, sequencer, navTo],
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
    <div className="flex flex-col gap-1">
      {/* map over each measure */}
      {measureChunks.map((measureSteps, measureIndex) => (
        <div
          key={getUniqueStepId(measureIndex, 0)} // measure-level key
          className="lg:flex lg:mb-0 mb-3 gap-1 min-h-20 grid grid-cols-8"
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

            return (
              <div className="relative flex-1" key={uniqueKey}>
                <SequencerButton
                  $state={computedState}
                  $armed={isArmed}
                  data-step-index={globalStepIdx}
                  onClick={handleToggleStepEvent}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default StepButtonMap
