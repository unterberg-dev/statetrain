import rc from "react-classmate"
import { useCallback, useEffect } from "react"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"
import useSequencer, { getMonoSynthEnvelope } from "#tone/useSequencer"
import { ruleOfThree } from "#utils/index"
import Knob from "#components/Knob"
import useTone from "#tone/useTone"
import { VOLUME_MIN, VOLUME_MAX, RELEASE_MAX, SUSTAIN_MAX, DECAY_MAX, ATTACK_MAX } from "#lib/constants"
import type { MonoSynth, PolySynth } from "tone"

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
  const { currentSequencer, activeSequencer } = useSequencer()

  const {
    sequencer,
    setReverbMix: setReverb,
    setDelayMix: setDelay,
    setVolume,
    volume,
    reverbMix: reverb,
    delayMix: delay,
  } = currentSequencer

  const { envelope, setEnvelope } = getMonoSynthEnvelope(currentSequencer, activeSequencer)

  const synth = sequencer?.getSynth()

  // --- FX knobs callbacks ---

  const onChangeReverbMix = useThrottledCallback((value: number) => {
    setReverb(value)
    if (sequencer && synth) {
      // Convert 0-100% to 0-1 range:
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

  // --- Envelope knobs callbacks ---
  // We assume envelope values are numbers (e.g. seconds or a unit-less value).
  // Each callback updates the specific envelope parameter by spreading the current envelope.

  const onChangeAttack = useThrottledCallback((value: number) => {
    if (setEnvelope && envelope) {
      setEnvelope({ ...envelope, attack: value })
      synth?.set({
        envelope: {
          attack: ruleOfThree(value, 0, ATTACK_MAX),
        },
      })
    }
  }, 300)

  const onChangeDecay = useThrottledCallback((value: number) => {
    if (setEnvelope && envelope) {
      setEnvelope({ ...envelope, decay: value })
      synth?.set({
        envelope: {
          decay: ruleOfThree(value, 0, DECAY_MAX),
        },
      })
    }
  }, 300)

  const onChangeSustain = useThrottledCallback((value: number) => {
    if (setEnvelope && envelope) {
      setEnvelope({ ...envelope, sustain: value })
      synth?.set({
        envelope: {
          sustain: ruleOfThree(value, 0, SUSTAIN_MAX),
        },
      })
    }
  }, 300)

  const onChangeRelease = useThrottledCallback((value: number) => {
    if (setEnvelope && envelope) {
      setEnvelope({ ...envelope, release: value })
      synth?.set({
        envelope: {
          release: ruleOfThree(value, 0, RELEASE_MAX),
        },
      })
    }
  }, 300)

  useEffect(() => {
    if (bpm) {
      EffectBus.updateDelayTime()
    }
  }, [bpm])

  return (
    <StyledKnobOuter>
      {/* Render envelope knobs only if envelope settings exist */}
      {envelope && (
        <StyledKnobGroup>
          <Knob label="Attack" onChange={onChangeAttack} value={envelope.attack} />
          <Knob label="Decay" onChange={onChangeDecay} value={envelope.decay} />
          <Knob label="Sustain" onChange={onChangeSustain} value={envelope.sustain} />
          <Knob label="Release" onChange={onChangeRelease} value={envelope.release} />
        </StyledKnobGroup>
      )}
      <StyledKnobGroup>
        <Knob label="Volume" onChange={onChangeVolume} value={volume || 0} />
        <Knob label="Reverb" onChange={onChangeReverbMix} value={reverb ?? 0} />
        <Knob label="Delay" onChange={onChangeDelayMix} value={delay ?? 0} />
      </StyledKnobGroup>
    </StyledKnobOuter>
  )
}

export default SequencerKnobs
