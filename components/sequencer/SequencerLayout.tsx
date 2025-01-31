import SequencerControls from "#components/sequencer/SequencerControls"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import type { StepSequencer } from "#tone/class/StepSequencer"
import { parseTransportPosition } from "#components/sequencer/utils"
import useTone from "#tone/useTone"
import { useState, useMemo, useEffect, useCallback } from "react"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import PianoRoll from "#components/PianoRoll"
import type { Steps } from "#types/tone"
import { getPercentSingleValue, ruleOfThree } from "#utils/index"
import ToneManager from "#tone/class/ToneManager"
import Knob from "#components/Knob"
import rc from "react-classmate"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"

const StyledKnobOuter = rc.div<{ $compact: boolean }>`
  flex
  ${(p) => (p.$compact ? "flex-col mb-5 items-center justify-center gap-2" : "justify-end gap-4")}
`

interface SequencerLayoutProps {
  compact?: boolean
  volume: number
  setVolume: (value: number) => void
  measures: SequencerMeasuresValue
  setSequencerMeasures: (payload: SequencerMeasuresValue) => void
  sequencer: StepSequencer | null
  steps: Steps
  setSequencerSteps: (steps: Steps) => void
  navTo?: string
  reverb: number
  setReverb: (value: number) => void
  delay: number
  setDelay: (value: number) => void
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
  navTo,
  reverb,
  setReverb,
  delay,
  setDelay,
}: SequencerLayoutProps) => {
  const {
    timeSignature,
    isPlaying,
    bpm,
    loopLength,
    transport,
    registerSixteenthTick,
    unregisterSixteenthTick,
  } = useTone()
  const [activeStep, setActiveStep] = useState<number | undefined>()

  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const totalSteps = useMemo(() => measureSize * measures, [measureSize, measures])

  const synth = sequencer?.getSynth() // Get the sequencer's synth instance

  useEffect(() => {
    if (bpm) {
      EffectBus.updateDelayTime()
    }
  }, [bpm])

  // Handle FX mix knob change
  const onChangeReverbMix = useThrottledCallback((value: number) => {
    if (setReverb) {
      setReverb(value)
    }
    if (sequencer && synth) {
      const interpolatedValue = ruleOfThree(value, 0, 1) // Convert 0-100% to 0-1
      EffectBus.updateSynthReverbMix(synth, interpolatedValue)
    }
  }, 300)

  const onChangeDelayMix = useThrottledCallback((value: number) => {
    setDelay(value)
    if (sequencer && synth) {
      const interpolatedValue = ruleOfThree(value, 0, 1) // Convert 0-100% to 0-1
      EffectBus.updateSynthDelayMix(synth, interpolatedValue)
    }
  }, 300)

  const handleMeasureSelect = useCallback(
    async (newCount: SequencerMeasuresValue) => {
      if (!sequencer) return

      // Update measures in Tone.js
      setSequencerMeasures(newCount)
      const newSteps = sequencer.setMeasureCount(newCount)

      setSequencerSteps(newSteps)

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
    [setSequencerSteps, setSequencerMeasures, timeSignature, loopLength, sequencer],
  )

  // @todo: potential bad side effect
  // we need this to update the sequencer when the timeSignature change
  useEffect(() => {
    if (!sequencer || !timeSignature) return
    handleMeasureSelect(measures)
  }, [sequencer, timeSignature, measures, handleMeasureSelect])

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
        throttledOnChangeVolume(Math.floor(value)) // Delay actual volume update
      }
    },
    [sequencer],
  )

  const throttledOnChangeVolume = useThrottledCallback((value: number) => {
    if (sequencer) {
      setVolume(Math.floor(value))
      const interpolatedValue = ruleOfThree(value, -50, 20)
      sequencer.setVolume(interpolatedValue)
    }
  }, 300)

  return (
    <div className="p-4 rounded-sm bg-black">
      <div className={`${compact ? "flex flex-col" : "flex justify-between items-center mb-5"}`}>
        {!compact && <SequencerControls measures={measures} handleMeasureSelect={handleMeasureSelect} />}
        <StyledKnobOuter $compact={compact}>
          <Knob
            label="Volume"
            onChange={onChangeVolume}
            value={
              volume ||
              getPercentSingleValue({
                min: -50,
                max: 20,
                value: 0,
              })
            }
          />
          <Knob label="Reverb" onChange={onChangeReverbMix} value={reverb ? reverb : 0} />
          <Knob label="Delay" onChange={onChangeDelayMix} value={delay ? delay : 0} />
        </StyledKnobOuter>
      </div>
      <StepButtonMap
        navTo={compact && navTo ? navTo : undefined}
        sequencer={sequencer}
        setSequencerSteps={setSequencerSteps}
        activeStep={activeStep}
        steps={steps}
        compact={compact}
      />
      {!compact && <PianoRoll steps={steps} activeStep={activeStep} sequencer={sequencer} />}
    </div>
  )
}

export default SequencerLayout
