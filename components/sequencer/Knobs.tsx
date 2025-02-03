import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"
import useSequencer from "#tone/useSequencer"
import { getPercentSingleValue, ruleOfThree } from "#utils/index"
import { useCallback, useEffect } from "react"
import rc from "react-classmate"
import Knob from "#components/Knob"
import useTone from "#tone/useTone"

const StyledKnobOuter = rc.div`
  flex
  justify-end gap-4
`

const SequencerKnobs = () => {
  const { timeSignature, bpm, loopLength } = useTone()
  const {
    currentSequencer: {
      sequencer,
      setReverbMix: setReverb,
      setDelayMix: setDelay,
      setVolume,
      volume,
      reverbMix: reverb,
      delayMix: delay,
    },
  } = useSequencer()

  const synth = sequencer?.getSynth() // Get the sequencer's synth instance

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

  const throttledOnChangeVolume = useThrottledCallback((value: number) => {
    if (sequencer) {
      setVolume(Math.floor(value))
      const interpolatedValue = ruleOfThree(value, -50, 20)
      sequencer.setVolume(interpolatedValue)
    }
  }, 300)

  const onChangeVolume = useCallback(
    (value: number) => {
      if (sequencer) {
        throttledOnChangeVolume(Math.floor(value)) // Delay actual volume update
      }
    },
    [sequencer, throttledOnChangeVolume],
  )

  useEffect(() => {
    if (bpm) {
      EffectBus.updateDelayTime()
    }
  }, [bpm])

  return (
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
  )
}

export default SequencerKnobs
