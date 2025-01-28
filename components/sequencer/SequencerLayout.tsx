import SequencerControls from "#components/sequencer/SequencerControls"
import SequencerNoteSelect from "#components/sequencer/SequencerNoteSelect"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import type { StepSequencer } from "#tone/class/StepSequencer"
import { parseTransportPosition } from "#components/sequencer/utils"
import ToneManager from "#tone/class/ToneManager"
import useTone from "#tone/useTone"
import { useState, useMemo, useEffect } from "react"
import type { SequencerMeasuresValue } from "#tone/useSequencer"

interface SequencerLayoutProps {
  measures: SequencerMeasuresValue
  setSequencerSteps: (steps: boolean[]) => void
  setSequencerMeasures: (payload: SequencerMeasuresValue) => void
  sequencer: StepSequencer | null
  steps: boolean[]
}

const SequencerLayout = ({ ...props }: SequencerLayoutProps) => {
  const { timeSignature, isPlaying, loopLength, transport, registerSixteenthTick, unregisterSixteenthTick } =
    useTone()
  const [activeStep, setActiveStep] = useState(0)

  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const totalSteps = useMemo(() => measureSize * props.measures, [measureSize, props.measures])

  // track the current step for UI highlight
  useEffect(() => {
    function handleTick() {
      setActiveStep((prev) => (prev + 1) % totalSteps)
    }
    registerSixteenthTick(handleTick)
    return () => {
      unregisterSixteenthTick(handleTick)
    }
  }, [totalSteps, registerSixteenthTick, unregisterSixteenthTick])

  // reset highlight if user toggles global play
  useEffect(() => {
    if (isPlaying) {
      setActiveStep(0)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!transport) return

    const posString = transport.position as string
    const totalSixteenthCount = parseTransportPosition(posString, timeSignature)

    // Each step sequencer UI is effectively one sixteenth note:
    const currentStep = totalSixteenthCount % totalSteps

    setActiveStep(Math.floor(currentStep))
  }, [timeSignature, totalSteps, transport])

  return (
    <div className="p-4 border-grayDark bg-black border-1">
      <SequencerNoteSelect sequencer={props.sequencer} />
      <SequencerControls
        measures={props.measures}
        setSequencerMeasures={props.setSequencerMeasures}
        setSequencerSteps={props.setSequencerSteps}
        setActiveStep={setActiveStep}
        sequencer={props.sequencer}
      />
      <StepButtonMap
        sequencer={props.sequencer}
        setSequencerSteps={props.setSequencerSteps}
        activeStep={activeStep}
        steps={props.steps}
      />
    </div>
  )
}

export default SequencerLayout
