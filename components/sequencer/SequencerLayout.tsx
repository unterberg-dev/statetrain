import SequencerControls from "#components/sequencer/SequencerControls"
import StepButtonMap, { HollowGridOverlay } from "#components/sequencer/StepButtonMap"
import { chunkArray, parseTransportPosition } from "#components/sequencer/utils"
import useTone from "#tone/useTone"
import { useState, useMemo, useEffect, useCallback, createContext, useRef } from "react"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import PianoRoll from "#components/PianoRoll"
import { getPercentSingleValue, ruleOfThree } from "#utils/index"
import ToneManager from "#tone/class/ToneManager"
import Knob from "#components/Knob"
import rc from "react-classmate"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"
import useSequencer from "#tone/useSequencer"
import LayoutComponent from "#components/common/LayoutComponent"
import consola from "consola"
import HighlightOverlayDOM from "#components/sequencer/HightlightOverlayDom"
import { ActiveStepProvider } from "#tone/ActiveStepProvider"

const StyledKnobOuter = rc.div`
  flex
  justify-end gap-4
`

const SequencerLayout = () => {
  const {
    timeSignature,
    isPlaying,
    bpm,
    loopLength,
    transport,
    registerSixteenthTick,
    unregisterSixteenthTick,
  } = useTone()
  // const [activeStep, setActiveStep] = useState<number | undefined>()

  const {
    currentSequencer: {
      measures,
      sequencer,
      setReverbMix: setReverb,
      setDelayMix: setDelay,
      setMeasures: setSequencerMeasures,
      setSteps: setSequencerSteps,
      setVolume,
      volume,
      steps,
      reverbMix: reverb,
      delayMix: delay,
    },
  } = useSequencer()

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
    },
    [setSequencerSteps, setSequencerMeasures, sequencer],
  )

  // @todo: potential bad side effect
  // we need this to update the sequencer when the timeSignature change
  useEffect(() => {
    if (!sequencer || !timeSignature) return
    handleMeasureSelect(measures)
  }, [sequencer, timeSignature, measures, handleMeasureSelect])

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

  // const currentActiveStep = useMemo(() => {
  //   return activeStep ? steps[activeStep] : undefined
  // }, [activeStep, steps])

  const stepObjects = useMemo(
    () => Array.from({ length: steps.length }, (_, i) => ({ originalIndex: i })),
    [steps],
  )

  const measureChunks = useMemo(() => {
    return chunkArray(stepObjects, measureSize)
  }, [stepObjects, measureSize])

  return (
    <LayoutComponent className="p-4 rounded-sm bg-black">
      <div className="flex justify-between items-center mb-5">
        <SequencerControls measures={measures} handleMeasureSelect={handleMeasureSelect} />
        <StyledKnobOuter>
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
      <ActiveStepProvider>
        <div className="relative">
          <StepButtonMap
            sequencer={sequencer}
            setSequencerSteps={setSequencerSteps}
            steps={steps}
            measureChunks={measureChunks}
          />
          {/* <HollowGridOverlay measureChunks={measureChunks} bpm={bpm} activeStep={activeStep}  /> */}
          <HighlightOverlayDOM
            measureChunks={measureChunks}
            registerSixteenthTick={registerSixteenthTick}
            unregisterSixteenthTick={unregisterSixteenthTick}
            measureCount={measures}
          />
        </div>
        <PianoRoll sequencer={sequencer} />
      </ActiveStepProvider>
    </LayoutComponent>
  )
}

export default SequencerLayout
