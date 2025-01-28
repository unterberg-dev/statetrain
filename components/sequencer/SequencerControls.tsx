import { Dice1, Shuffle, Trash } from "lucide-react"
import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo } from "react"

import Button from "#components/common/Button"
import { parseTransportPosition } from "#components/sequencer/utils"
import type { StepSequencer } from "#tone/StepSequencer"
import ToneManager from "#tone/ToneManager"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import useTone from "#tone/useTone"

interface SequencerControlsProps {
  measures: SequencerMeasuresValue
  setSequencerSteps: (steps: boolean[]) => void
  setSequencerMeasures: (payload: SequencerMeasuresValue) => void
  setActiveStep: Dispatch<SetStateAction<number>>
  sequencer: StepSequencer | null
}

const measureOptions = [1, 2, 3, 4] as SequencerMeasuresValue[]

const SequencerControls = ({
  measures,
  sequencer,
  setSequencerMeasures,
  setSequencerSteps,
  setActiveStep,
}: SequencerControlsProps) => {
  const { timeSignature, loopLength } = useTone()
  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const totalSteps = useMemo(() => measureSize * measures, [measureSize, measures])

  // @todo: potential bad side effect
  // we need this to update the sequencer when the timeSignature change
  useEffect(() => {
    if (!sequencer || !timeSignature) return
    handleMeasureSelect(measures)
  }, [sequencer, timeSignature, measures])

  const handleMeasureSelect = useCallback(
    (newCount: SequencerMeasuresValue) => {
      if (!sequencer) return

      // Update measures in Tone.js
      setSequencerMeasures(newCount)
      sequencer.setMeasureCount(newCount)
      setSequencerSteps(sequencer.getSteps())

      // Adjust active step based on Tone.Transport position
      const posString = ToneManager.toneTransport?.position as string
      if (posString) {
        const totalSixteenthCount = parseTransportPosition(posString, timeSignature)

        // Calculate new total steps based on updated measures
        const newTotalSteps = newCount * timeSignature * loopLength

        // Determine the new active step
        const currentStep = totalSixteenthCount % newTotalSteps
        setActiveStep(Math.floor(currentStep))
      } else {
        setActiveStep(0) // Fallback if position is unavailable
      }
    },
    [setSequencerSteps, setSequencerMeasures, setActiveStep, timeSignature, loopLength, sequencer],
  )

  const measureHandlers = useMemo(() => {
    return measureOptions.map((m) => {
      return () => handleMeasureSelect(m)
    })
  }, [handleMeasureSelect])

  const handleRandomFillEmpty = useCallback(() => {
    if (!sequencer) return

    const currentSteps = sequencer.getSteps()
    const filledSteps = currentSteps.map((step) => {
      if (step === true) {
        return true
      }
      return Math.random() < 0.25
    })

    sequencer.setAllSteps(filledSteps)
    setSequencerSteps(sequencer.getSteps())
  }, [setSequencerSteps, sequencer])

  const handleRandomPattern = useCallback(() => {
    if (!sequencer) return
    const newRandomSteps = Array.from({ length: totalSteps }, () => Math.random() < 0.5)
    sequencer.setAllSteps(newRandomSteps)
    setSequencerSteps(sequencer.getSteps())
  }, [totalSteps, setSequencerSteps, sequencer])

  const handleClearAll = useCallback(() => {
    if (!sequencer) return

    sequencer.setAllSteps(Array.from({ length: totalSteps }, () => false))
    setSequencerSteps(sequencer.getSteps())
  }, [totalSteps, setSequencerSteps, sequencer])

  return (
    <div className="flex gap-2 justify-between flex-wrap my-4">
      <div className="flex items-center gap-2">
        {measureOptions.map((m, index) => (
          <Button
            key={`m-${m}`}
            color={m === measures ? "warning" : "secondary"}
            onClick={measureHandlers[index]} // stable reference
          >
            {m} measure{m > 1 ? "s" : ""}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button color="success" onClick={handleRandomPattern}>
          <Shuffle className="inline-block w-4 h-4 mr-2" />
          Randomize
        </Button>
        <Button color="success" onClick={handleRandomFillEmpty}>
          <Dice1 className="inline-block w-4 h-4 mr-2" />
          Fill Empty
        </Button>
        <Button color="error" onClick={handleClearAll}>
          <Trash className="inline-block w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  )
}

export default SequencerControls
