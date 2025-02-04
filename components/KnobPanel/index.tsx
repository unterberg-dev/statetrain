import ElementContainer from "#components/common/ElementContainer"
import RotaryKnob from "#components/form/RotaryKnob"
import {
  ATTACK_MAX,
  DECAY_MAX,
  SUSTAIN_MAX,
  RELEASE_MAX,
  FILTER_ENVELOPE_BASE_FREQUENCY_MIN,
  FILTER_ENVELOPE_BASE_FREQUENCY_MAX,
} from "#lib/constants"
import useSequencer, { getMonoSynthOptions } from "#tone/useSequencer"
import { ruleOfThree } from "#utils/index"
import { useCallback, useMemo } from "react"
import rc from "react-classmate"

const StyledKnobGroup = rc.div`
  flex
  justify-end
  gap-4
  border-r-2
  pr-4
  border-gray
`

const KnobPanel = () => {
  const { currentSequencer, activeSequencer } = useSequencer()
  const { envelope, setEnvelope, filterEnvelope, setFilterEnvelope } = getMonoSynthOptions(
    currentSequencer,
    activeSequencer,
  )

  const synth = useMemo(() => currentSequencer?.sequencer?.getSynth(), [currentSequencer])

  const onChangeAttack = useCallback(
    (value: number) => {
      if (setEnvelope && envelope) {
        setEnvelope({ ...envelope, attack: value })
        synth?.set({
          envelope: {
            attack: ruleOfThree(value, 0, ATTACK_MAX),
          },
        })
      }
    },
    [setEnvelope, envelope, synth],
  )

  const onChangeDecay = useCallback(
    (value: number) => {
      if (setEnvelope && envelope) {
        setEnvelope({ ...envelope, decay: value })
        synth?.set({
          envelope: {
            decay: ruleOfThree(value, 0, DECAY_MAX),
          },
        })
      }
    },
    [setEnvelope, envelope, synth],
  )

  const onChangeSustain = useCallback(
    (value: number) => {
      if (setEnvelope && envelope) {
        setEnvelope({ ...envelope, sustain: value })
        synth?.set({
          envelope: {
            sustain: ruleOfThree(value, 0, SUSTAIN_MAX),
          },
        })
      }
    },
    [setEnvelope, envelope, synth],
  )

  const onChangeRelease = useCallback(
    (value: number) => {
      if (setEnvelope && envelope) {
        setEnvelope({ ...envelope, release: value })
        synth?.set({
          envelope: {
            release: ruleOfThree(value, 0, RELEASE_MAX),
          },
        })
      }
    },
    [setEnvelope, envelope, synth],
  )

  const onChangeFilterEnvelopeAttack = useCallback(
    (value: number) => {
      if (setFilterEnvelope && filterEnvelope) {
        setFilterEnvelope({ ...filterEnvelope, attack: value })
        synth?.set({
          filterEnvelope: {
            attack: ruleOfThree(value, 0, ATTACK_MAX),
          },
        })
      }
    },
    [setFilterEnvelope, filterEnvelope, synth],
  )

  const onChangeFilterEnvelopeDecay = useCallback(
    (value: number) => {
      if (setFilterEnvelope && filterEnvelope) {
        setFilterEnvelope({ ...filterEnvelope, decay: value })
        synth?.set({
          filterEnvelope: {
            decay: ruleOfThree(value, 0, DECAY_MAX),
          },
        })
      }
    },
    [setFilterEnvelope, filterEnvelope, synth],
  )

  const onChangeFilterEnvelopeSustain = useCallback(
    (value: number) => {
      if (setFilterEnvelope && filterEnvelope) {
        setFilterEnvelope({ ...filterEnvelope, sustain: value })
        synth?.set({
          filterEnvelope: {
            sustain: ruleOfThree(value, 0, SUSTAIN_MAX),
          },
        })
      }
    },
    [setFilterEnvelope, filterEnvelope, synth],
  )

  const onChangeFilterEnvelopeRelease = useCallback(
    (value: number) => {
      if (setFilterEnvelope && filterEnvelope) {
        setFilterEnvelope({ ...filterEnvelope, release: value })
        synth?.set({
          filterEnvelope: {
            release: ruleOfThree(value, 0, RELEASE_MAX),
          },
        })
      }
    },
    [setFilterEnvelope, filterEnvelope, synth],
  )

  // base frequency
  const onChangeFilterEnvelopeBaseFrequency = useCallback(
    (value: number) => {
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
    },
    [setFilterEnvelope, filterEnvelope, synth],
  )

  return (
    <ElementContainer className="flex flex-row gap-4">
      {filterEnvelope && (
        <StyledKnobGroup>
          <RotaryKnob
            label="Fltr Attack"
            onChange={onChangeFilterEnvelopeAttack}
            value={filterEnvelope.attack}
          />
          <RotaryKnob
            label="Fltr Decay"
            onChange={onChangeFilterEnvelopeDecay}
            value={filterEnvelope.decay}
          />
          <RotaryKnob
            label="Fltr Sustain"
            onChange={onChangeFilterEnvelopeSustain}
            value={filterEnvelope.sustain}
          />
          <RotaryKnob
            label="Fltr Release"
            onChange={onChangeFilterEnvelopeRelease}
            value={filterEnvelope.release}
          />
          <RotaryKnob
            label="Fltr Base Freq"
            onChange={onChangeFilterEnvelopeBaseFrequency}
            value={filterEnvelope.baseFrequency}
          />
        </StyledKnobGroup>
      )}

      {envelope && (
        <StyledKnobGroup>
          <RotaryKnob label="Attack" onChange={onChangeAttack} value={envelope?.attack} />
          <RotaryKnob label="Decay" onChange={onChangeDecay} value={envelope?.decay} />
          <RotaryKnob label="Sustain" onChange={onChangeSustain} value={envelope?.sustain} />
          <RotaryKnob label="Release" onChange={onChangeRelease} value={envelope?.release} />
        </StyledKnobGroup>
      )}
    </ElementContainer>
  )
}

export default KnobPanel
