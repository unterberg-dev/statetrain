import rc from "react-classmate"
import { useCallback, useEffect } from "react"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"
import useSequencer from "#tone/useSequencer"
import { ruleOfThree } from "#utils/index"
import Knob from "#components/Knob"
import useTone from "#tone/useTone"
import { VOLUME_MIN, VOLUME_MAX } from "#lib/constants"

const StyledKnobOuter = rc.div`
  flex
  justify-end gap-10
`

const StyledKnobGroup = rc.div`
  flex
  justify-end gap-4
`

const SequencerKnobs = () => {
  const { bpm } = useTone()
  const { currentSequencer } = useSequencer()

  const {
    sequencer,
    setReverbMix: setReverb,
    setDelayMix: setDelay,
    setVolume,
    volume,
    reverbMix: reverb,
    delayMix: delay,
  } = currentSequencer

  const synth = sequencer?.getSynth()

  const onChangeReverbMix = useThrottledCallback((value: number) => {
    setReverb(value)
    if (sequencer && synth) {
      const interpolatedValue = ruleOfThree(value, 0, 1)
      EffectBus.updateSynthReverbMix(synth, interpolatedValue)
    }
  }, 300)

  const onChangeDelayMix = useThrottledCallback((value: number) => {
    setDelay(value)
    if (sequencer && synth) {
      const interpolatedValue = ruleOfThree(value, 0, 1)
      EffectBus.updateSynthDelayMix(synth, interpolatedValue)
    }
  }, 300)

  const throttledOnChangeVolume = useThrottledCallback((value: number) => {
    setVolume(Math.floor(value))
    if (sequencer) {
      const interpolatedValue = ruleOfThree(value, VOLUME_MIN, VOLUME_MAX)
      sequencer.setVolume(interpolatedValue)
    }
  }, 300)

  const onChangeVolume = useCallback(
    (value: number) => {
      if (sequencer) {
        throttledOnChangeVolume(Math.floor(value))
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
      {/* Render envelope knobs only if envelope settings exist */}
      <StyledKnobGroup>
        <Knob label="Volume" onChange={onChangeVolume} value={volume || 0} />
        <Knob label="Reverb" onChange={onChangeReverbMix} value={reverb ?? 0} />
        <Knob label="Delay" onChange={onChangeDelayMix} value={delay ?? 0} />
      </StyledKnobGroup>
    </StyledKnobOuter>
  )
}

export default SequencerKnobs
