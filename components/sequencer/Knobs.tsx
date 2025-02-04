import rc from "react-classmate"
import { useCallback, useEffect } from "react"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"
import useSequencer from "#tone/useSequencer"
import { ruleOfThree } from "#utils/index"
import RotaryKnob from "#components/form/RotaryKnob"
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

  const onChangeReverbMix = useCallback(
    (value: number) => {
      setReverb(value)
      if (sequencer && synth) {
        const interpolatedValue = ruleOfThree(value, 0, 1)
        EffectBus.updateSynthReverbMix(synth, interpolatedValue)
      }
    },
    [sequencer, synth, setReverb],
  )

  const onChangeDelayMix = useCallback(
    (value: number) => {
      setDelay(value)
      if (sequencer && synth) {
        const interpolatedValue = ruleOfThree(value, 0, 1)
        EffectBus.updateSynthDelayMix(synth, interpolatedValue)
      }
    },
    [sequencer, synth, setDelay],
  )

  const onChangeVolume = useCallback(
    (value: number) => {
      setVolume(Math.floor(value))
      if (sequencer) {
        const interpolatedValue = ruleOfThree(value, VOLUME_MIN, VOLUME_MAX)
        sequencer.setVolume(interpolatedValue)
      }
    },
    [sequencer, setVolume],
  )

  useEffect(() => {
    if (bpm) {
      EffectBus.updateDelayTime()
    }
  }, [bpm])

  return (
    <StyledKnobOuter>
      <StyledKnobGroup>
        <RotaryKnob label="Volume" onChange={onChangeVolume} value={volume || 0} />
        <RotaryKnob label="Reverb" onChange={onChangeReverbMix} value={reverb ?? 0} />
        <RotaryKnob label="Delay" onChange={onChangeDelayMix} value={delay ?? 0} />
      </StyledKnobGroup>
    </StyledKnobOuter>
  )
}

export default SequencerKnobs
