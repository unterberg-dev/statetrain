import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Knob from "#components/Knob"
import {
  ATTACK_MAX,
  DECAY_MAX,
  SUSTAIN_MAX,
  RELEASE_MAX,
  FILTER_ENVELOPE_BASE_FREQUENCY_MIN,
  FILTER_ENVELOPE_BASE_FREQUENCY_MAX,
} from "#lib/constants"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import useSequencer, { useMonoSynthStore } from "#tone/useSequencer"
import { ruleOfThree } from "#utils/index"
import rc from "react-classmate"
import { useShallow } from "zustand/react/shallow"

const StyledKnobOuter = rc.div`
  flex
  justify-end gap-10
`

const StyledKnobGroup = rc.div`
  flex
  justify-end gap-4
`

// todo: the current implementation must be oursourced to a separate file out of the page context
const MonoSynthPage = () => {
  const {
    currentSequencer: { sequencer },
  } = useSequencer()
  const synth = sequencer?.getSynth()

  const { envelope, setEnvelope, filterEnvelope, setFilterEnvelope } = useMonoSynthStore(
    useShallow((state) => ({
      envelope: state.envelope,
      setEnvelope: state.setEnvelope,
      filterEnvelope: state.filterEnvelope,
      setFilterEnvelope: state.setFilterEnvelope,
    })),
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

  return (
    <>
      <H2Headline className="mb-5">💫 Mono Synth</H2Headline>

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
    </>
  )
}
export default MonoSynthPage
