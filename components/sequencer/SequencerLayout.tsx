import SequencerControls from "#components/sequencer/SequencerControls"
import SequencerNoteSelect from "#components/sequencer/SequencerNoteSelect"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import type { StepSequencer } from "#tone/class/StepSequencer"
import { parseTransportPosition } from "#components/sequencer/utils"
import useTone from "#tone/useTone"
import { useState, useMemo, useEffect, useCallback } from "react"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import RangeSlider from "#components/form/RangeSlider"
import PianoRoll from "#components/PianoRoll"

export const ruleOfThree = (value: number, min: number, max: number) => (value / 100) * (max - min) + min

export const getPercent = (value: number, min: number, max: number) =>
  Number((((value - min) / (max - min)) * 100).toFixed(2))

export type PixiConfigMinMax = {
  min: number
  max: number
}

export type PixiConfigSingleValue = {
  value: number
} & PixiConfigMinMax

export const getPercentSingleValue = (item: PixiConfigSingleValue) =>
  getPercent(item.value, item.min, item.max)

interface SequencerLayoutProps {
  compact?: boolean
  volume: number
  setVolume: (value: number) => void
  measures: SequencerMeasuresValue
  setSequencerSteps: (steps: boolean[]) => void
  setSequencerMeasures: (payload: SequencerMeasuresValue) => void
  sequencer: StepSequencer | null
  steps: boolean[]
}

const SequencerLayout = ({
  sequencer,
  compact = false,
  volume,
  setVolume,
  measures,
  setSequencerMeasures,
  setSequencerSteps,
  steps,
}: SequencerLayoutProps) => {
  const { timeSignature, isPlaying, loopLength, transport, registerSixteenthTick, unregisterSixteenthTick } =
    useTone()
  const [activeStep, setActiveStep] = useState<number | undefined>()

  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const totalSteps = useMemo(() => measureSize * measures, [measureSize, measures])

  // track the current step for UI highlight
  useEffect(() => {
    function handleTick() {
      setActiveStep((prev) => (typeof prev === "number" ? (prev + 1) % totalSteps : 0))
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

  const onChangeVolume = useCallback(
    (value: number) => {
      if (sequencer) {
        setVolume(value)
        const interpolatedValue = ruleOfThree(value, -50, 20)
        sequencer.setVolume(interpolatedValue)
      }
    },
    [sequencer, setVolume],
  )

  return (
    <div className="p-4 border-grayDark bg-black border-1">
      <div className="flex justify-between items-center mb-4">
        <SequencerNoteSelect sequencer={sequencer} />
        <div className="flex gap-2 items-center">
          <span className="text-sm pt-1 text-grayLight">Volume</span>
          <RangeSlider
            onChange={onChangeVolume}
            initialValue={
              volume ||
              getPercentSingleValue({
                min: -50,
                max: 20,
                value: 0,
              })
            }
          />
        </div>
      </div>
      <SequencerControls
        measures={measures}
        setSequencerMeasures={setSequencerMeasures}
        setSequencerSteps={setSequencerSteps}
        setActiveStep={setActiveStep}
        sequencer={sequencer}
      />
      <StepButtonMap
        sequencer={sequencer}
        setSequencerSteps={setSequencerSteps}
        activeStep={activeStep}
        steps={steps}
      />
      {!compact && <PianoRoll sequencer={sequencer} />}
    </div>
  )
}

export default SequencerLayout
