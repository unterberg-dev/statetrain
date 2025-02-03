import rc from "react-classmate"
import { useCallback, useEffect } from "react"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import EffectBus from "#tone/class/EffectBus"
import useSequencer, { getMonoSynthOptions } from "#tone/useSequencer"
import { ruleOfThree } from "#utils/index"
import Knob from "#components/Knob"
import useTone from "#tone/useTone"
import {
  VOLUME_MIN,
  VOLUME_MAX,
  RELEASE_MAX,
  SUSTAIN_MAX,
  DECAY_MAX,
  ATTACK_MAX,
  FILTER_ENVELOPE_BASE_FREQUENCY_MAX,
  FILTER_ENVELOPE_BASE_FREQUENCY_MIN,
} from "#lib/constants"
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

  const { envelope, setEnvelope, filterEnvelope, setFilterEnvelope } = getMonoSynthOptions(
    currentSequencer,
    activeSequencer,
  )

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

  /*
  filterEnvelope : {
    attack : 0.06 , x
    decay : 0.2 ,x
    sustain : 0.5 ,x
    release : 2 ,
    baseFrequency : 200 ,
  }
  */

  const onChangeFilterEnvelopeAttack = useThrottledCallback((value: number) => {
    if (setFilterEnvelope && filterEnvelope) {
      setFilterEnvelope({ ...filterEnvelope, attack: value })
      synth?.set({
        filterEnvelope: {
          attack: ruleOfThree(value, 0, ATTACK_MAX),
        },
      })
    }
  }, 300)

  const onChangeFilterEnvelopeDecay = useThrottledCallback((value: number) => {
    if (setFilterEnvelope && filterEnvelope) {
      setFilterEnvelope({ ...filterEnvelope, decay: value })
      synth?.set({
        filterEnvelope: {
          decay: ruleOfThree(value, 0, DECAY_MAX),
        },
      })
    }
  }, 300)

  const onChangeFilterEnvelopeSustain = useThrottledCallback((value: number) => {
    if (setFilterEnvelope && filterEnvelope) {
      setFilterEnvelope({ ...filterEnvelope, sustain: value })
      synth?.set({
        filterEnvelope: {
          sustain: ruleOfThree(value, 0, SUSTAIN_MAX),
        },
      })
    }
  }, 300)

  const onChangeFilterEnvelopeRelease = useThrottledCallback((value: number) => {
    if (setFilterEnvelope && filterEnvelope) {
      setFilterEnvelope({ ...filterEnvelope, release: value })
      synth?.set({
        filterEnvelope: {
          release: ruleOfThree(value, 0, RELEASE_MAX),
        },
      })
    }
  }, 300)

  // base frequency
  const onChangeFilterEnvelopeBaseFrequency = useThrottledCallback((value: number) => {
    if (setFilterEnvelope && filterEnvelope) {
      setFilterEnvelope({ ...filterEnvelope, baseFrequency: value })
      synth?.set({
        filterEnvelope: {
          baseFrequency: ruleOfThree(
            value,
            FILTER_ENVELOPE_BASE_FREQUENCY_MIN,
            FILTER_ENVELOPE_BASE_FREQUENCY_MAX,
          ),
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
      {filterEnvelope && (
        <StyledKnobGroup>
          <Knob label="FLTR Attack" onChange={onChangeFilterEnvelopeAttack} value={filterEnvelope.attack} />
          <Knob label="FLTR Decay" onChange={onChangeFilterEnvelopeDecay} value={filterEnvelope.decay} />
          <Knob
            label="FLTR Sustain"
            onChange={onChangeFilterEnvelopeSustain}
            value={filterEnvelope.sustain}
          />
          <Knob
            label="FLTR Release"
            onChange={onChangeFilterEnvelopeRelease}
            value={filterEnvelope.release}
          />
          <Knob
            label="FLTR Base Freq"
            onChange={onChangeFilterEnvelopeBaseFrequency}
            value={filterEnvelope.baseFrequency}
          />
        </StyledKnobGroup>
      )}

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
