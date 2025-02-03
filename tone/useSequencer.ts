import { getPercentSingleValue } from "./../lib/utils/index"
import { TRANSPORT_CONFIG } from "#lib/config"
import {
  ATTACK_MAX,
  DECAY_MAX,
  DEFAULT_SYNTH_VOLUME_PERCENT,
  FILTER_ENVELOPE_BASE_FREQUENCY_MAX,
  FILTER_ENVELOPE_BASE_FREQUENCY_MIN,
  RELEASE_MAX,
  SequencerKey,
  SUSTAIN_MAX,
} from "#lib/constants"
import ToneManager from "#tone/class/ToneManager"
import useTone from "#tone/useTone"
import type { Steps, StoreReactStateSetter } from "#types/tone"
import { create } from "zustand"
import { useMemo } from "react"
import { useShallow } from "zustand/react/shallow"
import type { MonoSynthOptions } from "tone"

export type SequencerMeasuresValue = 1 | 2 | 3 | 4

export interface SequencerStoreValues {
  steps: Steps
  setSteps: (payload: Steps) => void
  measures: SequencerMeasuresValue
  setMeasures: (payload: SequencerMeasuresValue) => void
  volume: number
  setVolume: (payload: number) => void
  reverbMix: number
  setReverbMix: (payload: number) => void
  delayMix: number
  setDelayMix: (payload: number) => void
}

export interface Envelope {
  attack: number
  decay: number
  sustain: number
  release: number
}

export interface Filter {
  Q: MonoSynthOptions["filter"]["Q"]
  type: MonoSynthOptions["filter"]["type"]
  rolloff: MonoSynthOptions["filter"]["rolloff"]
}

export interface FilterEnvelope {
  attack: number
  decay: number
  sustain: number
  release: number
  baseFrequency: number
  octaves: number
  exponent: number
}

export const getMonoSynthOptions = (
  currentSequencer: any, // Ideally, this is be a union type of all synth stores.
  activeSequencer: SequencerKey | undefined,
): {
  envelope?: Envelope
  setEnvelope?: (payload: Envelope) => void
  filterEnvelope?: FilterEnvelope
  setFilterEnvelope?: (payload: FilterEnvelope) => void
} => {
  if (activeSequencer === SequencerKey.Mono) {
    return {
      envelope: currentSequencer.envelope,
      setEnvelope: currentSequencer.setEnvelope,
      filterEnvelope: currentSequencer.filterEnvelope,
      setFilterEnvelope: currentSequencer.setFilterEnvelope,
    }
  }
  return {
    envelope: undefined,
    setEnvelope: undefined,
    filterEnvelope: undefined,
    setFilterEnvelope: undefined,
  }
}

export interface MonoSynthStoreValues extends SequencerStoreValues {
  envelope: Envelope
  setEnvelope: (payload: Envelope) => void
  filter: Filter
  setFilter: (payload: Filter) => void
  filterEnvelope: FilterEnvelope
  setFilterEnvelope: (payload: FilterEnvelope) => void
}

export const useMonoSynthStore = create<MonoSynthStoreValues>()((set) => ({
  // Base sequencer properties:
  steps: [],
  setSteps: (payload) => set({ steps: payload }),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set({ measures: payload }),
  volume: DEFAULT_SYNTH_VOLUME_PERCENT,
  setVolume: (payload) => set({ volume: payload }),
  reverbMix: 0,
  setReverbMix: (payload) => set({ reverbMix: payload }),
  delayMix: 0,
  setDelayMix: (payload) => set({ delayMix: payload }),
  envelope: {
    attack: getPercentSingleValue({ value: 0.1, min: 0, max: ATTACK_MAX }),
    decay: getPercentSingleValue({ value: 0.4, min: 0, max: DECAY_MAX }),
    sustain: getPercentSingleValue({ value: 0.4, min: 0, max: SUSTAIN_MAX }),
    release: getPercentSingleValue({ value: 0.5, min: 0, max: RELEASE_MAX }),
  },
  setEnvelope: (payload) => set({ envelope: payload }),
  filter: {
    Q: 0,
    type: "lowpass",
    rolloff: -12,
  },
  setFilter: (payload) => set({ filter: payload }),
  filterEnvelope: {
    attack: getPercentSingleValue({ value: 0.1, min: 0, max: ATTACK_MAX }),
    decay: getPercentSingleValue({ value: 0.4, min: 0, max: DECAY_MAX }),
    sustain: getPercentSingleValue({ value: 0.4, min: 0, max: SUSTAIN_MAX }),
    release: getPercentSingleValue({ value: 0.5, min: 0, max: RELEASE_MAX }),
    baseFrequency: getPercentSingleValue({
      value: 0.5,
      min: FILTER_ENVELOPE_BASE_FREQUENCY_MIN,
      max: FILTER_ENVELOPE_BASE_FREQUENCY_MAX,
    }),
    octaves: 4,
    exponent: 2,
  },
  setFilterEnvelope: (payload) => set({ filterEnvelope: payload }),
}))

const createSequencerStore = (
  defaultMeasures: SequencerMeasuresValue = TRANSPORT_CONFIG.loopLength.default,
) =>
  create<SequencerStoreValues>()((set) => ({
    steps: [],
    setSteps: (payload) => set({ steps: payload }),
    measures: defaultMeasures,
    setMeasures: (payload) => set({ measures: payload }),
    volume: DEFAULT_SYNTH_VOLUME_PERCENT,
    setVolume: (payload) => set({ volume: payload }),
    reverbMix: 0,
    setReverbMix: (payload) => set({ reverbMix: payload }),
    delayMix: 0,
    setDelayMix: (payload) => set({ delayMix: payload }),
    settings: {},
  }))

// Create separate stores with their respective default measures
export const useAmSynthStore = createSequencerStore()
export const useDuoSynthStore = createSequencerStore()
export const useMetalSynthStore = createSequencerStore()
export const useMembraneSynthStore = createSequencerStore()
export const useFmSynthStore = createSequencerStore()

// Store for edit step index and other sequencer config
interface SequencerStoreConfig {
  editStepIndex: number | undefined
  setEditStepIndex: (setterFn: StoreReactStateSetter<number | undefined>) => void
  activeSequencer: SequencerKey | undefined
  setActiveSequencer: (payload: SequencerKey | undefined) => void
  editStepNotesMap: Record<number, number[]>
  setEditStepNotesMap: (setterFn: StoreReactStateSetter<Record<number, number[]>>) => void
}

export const useInternalSequencerStoreConfigStore = create<SequencerStoreConfig>()((set) => ({
  editStepIndex: undefined,
  setEditStepIndex: (setterFn) =>
    set(({ editStepIndex }) => ({
      editStepIndex: typeof setterFn === "function" ? setterFn(editStepIndex) : setterFn,
    })),
  activeSequencer: undefined,
  setActiveSequencer: (payload) => set({ activeSequencer: payload }),
  editStepNotesMap: {},
  setEditStepNotesMap: (setterFn) =>
    set(({ editStepNotesMap }) => ({
      editStepNotesMap: typeof setterFn === "function" ? setterFn(editStepNotesMap) : setterFn,
    })),
}))

const useSequencer = () => {
  const { isInitialized } = useTone()

  // Grouped state for each synth store using useShallow
  const amSynthState = useAmSynthStore(
    useShallow((state) => ({
      steps: state.steps,
      setSteps: state.setSteps,
      measures: state.measures,
      setMeasures: state.setMeasures,
      volume: state.volume,
      setVolume: state.setVolume,
      reverbMix: state.reverbMix,
      setReverbMix: state.setReverbMix,
      delayMix: state.delayMix,
      setDelayMix: state.setDelayMix,
    })),
  )

  const monoSynthState = useMonoSynthStore(
    useShallow((state) => ({
      steps: state.steps,
      setSteps: state.setSteps,
      measures: state.measures,
      setMeasures: state.setMeasures,
      volume: state.volume,
      setVolume: state.setVolume,
      reverbMix: state.reverbMix,
      setReverbMix: state.setReverbMix,
      delayMix: state.delayMix,
      setDelayMix: state.setDelayMix,
      envelope: state.envelope,
      setEnvelope: state.setEnvelope,
      filterEnvelope: state.filterEnvelope,
      setFilterEnvelope: state.setFilterEnvelope,
    })),
  )

  const duoSynthState = useDuoSynthStore(
    useShallow((state) => ({
      steps: state.steps,
      setSteps: state.setSteps,
      measures: state.measures,
      setMeasures: state.setMeasures,
      volume: state.volume,
      setVolume: state.setVolume,
      reverbMix: state.reverbMix,
      setReverbMix: state.setReverbMix,
      delayMix: state.delayMix,
      setDelayMix: state.setDelayMix,
    })),
  )

  const metalSynthState = useMetalSynthStore(
    useShallow((state) => ({
      steps: state.steps,
      setSteps: state.setSteps,
      measures: state.measures,
      setMeasures: state.setMeasures,
      volume: state.volume,
      setVolume: state.setVolume,
      reverbMix: state.reverbMix,
      setReverbMix: state.setReverbMix,
      delayMix: state.delayMix,
      setDelayMix: state.setDelayMix,
    })),
  )

  const membraneSynthState = useMembraneSynthStore(
    useShallow((state) => ({
      steps: state.steps,
      setSteps: state.setSteps,
      measures: state.measures,
      setMeasures: state.setMeasures,
      volume: state.volume,
      setVolume: state.setVolume,
      reverbMix: state.reverbMix,
      setReverbMix: state.setReverbMix,
      delayMix: state.delayMix,
      setDelayMix: state.setDelayMix,
    })),
  )

  const fmSynthState = useFmSynthStore(
    useShallow((state) => ({
      steps: state.steps,
      setSteps: state.setSteps,
      measures: state.measures,
      setMeasures: state.setMeasures,
      volume: state.volume,
      setVolume: state.setVolume,
      reverbMix: state.reverbMix,
      setReverbMix: state.setReverbMix,
      delayMix: state.delayMix,
      setDelayMix: state.setDelayMix,
    })),
  )

  // Group the config store state using useShallow
  const configState = useInternalSequencerStoreConfigStore(
    useShallow((state) => ({
      editStepIndex: state.editStepIndex,
      setEditStepIndex: state.setEditStepIndex,
      activeSequencer: state.activeSequencer,
      setActiveSequencer: state.setActiveSequencer,
      editStepNotesMap: state.editStepNotesMap,
      setEditStepNotesMap: state.setEditStepNotesMap,
    })),
  )

  // Get the synth instances from ToneManager (if initialized)
  const amSynth = isInitialized ? ToneManager.getAmSynth() : null
  const monoSynth = isInitialized ? ToneManager.getMonoSynth() : null
  const duoSynth = isInitialized ? ToneManager.getDuoSynth() : null
  const metalSynth = isInitialized ? ToneManager.getMetalSynth() : null
  const membraneSynth = isInitialized ? ToneManager.getMembraneSynth() : null
  const fmSynth = isInitialized ? ToneManager.getFmSynth() : null

  // Map the active sequencer to the corresponding grouped store and synth
  const currentSequencer = useMemo(() => {
    switch (configState.activeSequencer) {
      case SequencerKey.AM:
        return { sequencer: amSynth, ...amSynthState }
      case SequencerKey.Mono:
        return { sequencer: monoSynth, ...monoSynthState }
      case SequencerKey.Duo:
        return { sequencer: duoSynth, ...duoSynthState }
      case SequencerKey.Metal:
        return { sequencer: metalSynth, ...metalSynthState }
      case SequencerKey.Membrane:
        return { sequencer: membraneSynth, ...membraneSynthState }
      case SequencerKey.FM:
        return { sequencer: fmSynth, ...fmSynthState }
      default:
        return { sequencer: amSynth, ...amSynthState }
    }
  }, [
    configState.activeSequencer,
    amSynth,
    monoSynth,
    duoSynth,
    metalSynth,
    membraneSynth,
    fmSynth,
    amSynthState,
    monoSynthState,
    duoSynthState,
    metalSynthState,
    membraneSynthState,
    fmSynthState,
  ])

  return {
    ...configState,
    currentSequencer,
  }
}

export default useSequencer
