import {
  sequencer1DefaultMeasures,
  sequencer2DefaultMeasures,
  sequencer3DefaultMeasures,
  sequencer4DefaultMeasures,
  sequencer5DefaultMeasures,
  sequencer6DefaultMeasures,
  sequencer7DefaultMeasures,
} from "#lib/defaultSteps"
import ToneManager from "#tone/class/ToneManager"
import useTone from "#tone/useTone"
import type { Steps, StoreReactStateSetter } from "#types/tone"
import { create } from "zustand"

export type SequencerMeasuresValue = 1 | 2 | 3 | 4

// Store Interface
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

// Factory function to create Zustand stores
const createSequencerStore = (defaultMeasures: SequencerMeasuresValue) =>
  create<SequencerStoreValues>()((set) => ({
    steps: [],
    setSteps: (payload) => set({ steps: payload }),
    measures: defaultMeasures,
    setMeasures: (payload) => set({ measures: payload }),
    volume: 0,
    setVolume: (payload) => set({ volume: payload }),
    reverbMix: 0,
    setReverbMix: (payload) => set({ reverbMix: payload }),
    delayMix: 0,
    setDelayMix: (payload) => set({ delayMix: payload }),
  }))

// Create stores with their respective default measures
export const useInternalSequencer1Store = createSequencerStore(sequencer1DefaultMeasures)
export const useInternalSequencer2Store = createSequencerStore(sequencer2DefaultMeasures)
export const useInternalSequencer3Store = createSequencerStore(sequencer3DefaultMeasures)
export const useInternalSequencer4Store = createSequencerStore(sequencer4DefaultMeasures)
export const useInternalSequencer5Store = createSequencerStore(sequencer5DefaultMeasures)
export const useInternalSequencer6Store = createSequencerStore(sequencer6DefaultMeasures)
export const useInternalSequencer7Store = createSequencerStore(sequencer7DefaultMeasures)

// Store for edit step index
interface SequencerStoreConfig {
  editStepIndex: number | undefined
  setEditStepIndex: (setterFn: StoreReactStateSetter<number | undefined>) => void
}

export const useInternalSequencerStoreConfigStore = create<SequencerStoreConfig>()((set) => ({
  editStepIndex: undefined,
  setEditStepIndex: (setterFn) =>
    set(({ editStepIndex }) => ({
      editStepIndex: typeof setterFn === "function" ? setterFn(editStepIndex) : setterFn,
    })),
}))

const useSequencer = () => {
  const { isInitialized } = useTone()

  // sequencer 1
  const sequencer1Steps = useInternalSequencer1Store((state) => state.steps)
  const setSequencer1Steps = useInternalSequencer1Store((state) => state.setSteps)
  const sequencer1Measures = useInternalSequencer1Store((state) => state.measures)
  const setSequencer1Measures = useInternalSequencer1Store((state) => state.setMeasures)
  const sequencer1Volume = useInternalSequencer1Store((state) => state.volume)
  const setSequencer1Volume = useInternalSequencer1Store((state) => state.setVolume)
  const sequencer1ReverbMix = useInternalSequencer1Store((state) => state.reverbMix)
  const setSequencer1ReverbMix = useInternalSequencer1Store((state) => state.setReverbMix)
  const sequencer1DelayMix = useInternalSequencer1Store((state) => state.delayMix)
  const setSequencer1DelayMix = useInternalSequencer1Store((state) => state.setDelayMix)

  // sequencer 2
  const sequencer2Steps = useInternalSequencer2Store((state) => state.steps)
  const setSequencer2Steps = useInternalSequencer2Store((state) => state.setSteps)
  const sequencer2Measures = useInternalSequencer2Store((state) => state.measures)
  const setSequencer2Measures = useInternalSequencer2Store((state) => state.setMeasures)
  const sequencer2Volume = useInternalSequencer2Store((state) => state.volume)
  const setSequencer2Volume = useInternalSequencer2Store((state) => state.setVolume)
  const sequencer2ReverbMix = useInternalSequencer2Store((state) => state.reverbMix)
  const setSequencer2ReverbMix = useInternalSequencer2Store((state) => state.setReverbMix)
  const sequencer2DelayMix = useInternalSequencer2Store((state) => state.delayMix)
  const setSequencer2DelayMix = useInternalSequencer2Store((state) => state.setDelayMix)

  // sequencer 3
  const sequencer3Steps = useInternalSequencer3Store((state) => state.steps)
  const setSequencer3Steps = useInternalSequencer3Store((state) => state.setSteps)
  const sequencer3Measures = useInternalSequencer3Store((state) => state.measures)
  const setSequencer3Measures = useInternalSequencer3Store((state) => state.setMeasures)
  const sequencer3Volume = useInternalSequencer3Store((state) => state.volume)
  const setSequencer3Volume = useInternalSequencer3Store((state) => state.setVolume)
  const sequencer3ReverbMix = useInternalSequencer3Store((state) => state.reverbMix)
  const setSequencer3ReverbMix = useInternalSequencer3Store((state) => state.setReverbMix)
  const sequencer3DelayMix = useInternalSequencer3Store((state) => state.delayMix)
  const setSequencer3DelayMix = useInternalSequencer3Store((state) => state.setDelayMix)

  // sequencer 4
  const sequencer4Steps = useInternalSequencer4Store((state) => state.steps)
  const setSequencer4Steps = useInternalSequencer4Store((state) => state.setSteps)
  const sequencer4Measures = useInternalSequencer4Store((state) => state.measures)
  const setSequencer4Measures = useInternalSequencer4Store((state) => state.setMeasures)
  const sequencer4Volume = useInternalSequencer4Store((state) => state.volume)
  const setSequencer4Volume = useInternalSequencer4Store((state) => state.setVolume)
  const sequencer4ReverbMix = useInternalSequencer4Store((state) => state.reverbMix)
  const setSequencer4ReverbMix = useInternalSequencer4Store((state) => state.setReverbMix)
  const sequencer4DelayMix = useInternalSequencer4Store((state) => state.delayMix)
  const setSequencer4DelayMix = useInternalSequencer4Store((state) => state.setDelayMix)

  // sequencer 5
  const sequencer5Steps = useInternalSequencer5Store((state) => state.steps)
  const setSequencer5Steps = useInternalSequencer5Store((state) => state.setSteps)
  const sequencer5Measures = useInternalSequencer5Store((state) => state.measures)
  const setSequencer5Measures = useInternalSequencer5Store((state) => state.setMeasures)
  const sequencer5Volume = useInternalSequencer5Store((state) => state.volume)
  const setSequencer5Volume = useInternalSequencer5Store((state) => state.setVolume)
  const sequencer5ReverbMix = useInternalSequencer5Store((state) => state.reverbMix)
  const setSequencer5ReverbMix = useInternalSequencer5Store((state) => state.setReverbMix)
  const sequencer5DelayMix = useInternalSequencer5Store((state) => state.delayMix)
  const setSequencer5DelayMix = useInternalSequencer5Store((state) => state.setDelayMix)

  // sequencer 6
  const sequencer6Steps = useInternalSequencer6Store((state) => state.steps)
  const setSequencer6Steps = useInternalSequencer6Store((state) => state.setSteps)
  const sequencer6Measures = useInternalSequencer6Store((state) => state.measures)
  const setSequencer6Measures = useInternalSequencer6Store((state) => state.setMeasures)
  const sequencer6Volume = useInternalSequencer6Store((state) => state.volume)
  const setSequencer6Volume = useInternalSequencer6Store((state) => state.setVolume)
  const sequencer6ReverbMix = useInternalSequencer6Store((state) => state.reverbMix)
  const setSequencer6ReverbMix = useInternalSequencer6Store((state) => state.setReverbMix)
  const sequencer6DelayMix = useInternalSequencer6Store((state) => state.delayMix)
  const setSequencer6DelayMix = useInternalSequencer6Store((state) => state.setDelayMix)

  // sequencer 7
  const sequencer7Steps = useInternalSequencer7Store((state) => state.steps)
  const setSequencer7Steps = useInternalSequencer7Store((state) => state.setSteps)
  const sequencer7Measures = useInternalSequencer7Store((state) => state.measures)
  const setSequencer7Measures = useInternalSequencer7Store((state) => state.setMeasures)
  const sequencer7Volume = useInternalSequencer7Store((state) => state.volume)
  const setSequencer7Volume = useInternalSequencer7Store((state) => state.setVolume)
  const sequencer7ReverbMix = useInternalSequencer7Store((state) => state.reverbMix)
  const setSequencer7ReverbMix = useInternalSequencer7Store((state) => state.setReverbMix)
  const sequencer7DelayMix = useInternalSequencer7Store((state) => state.delayMix)
  const setSequencer7DelayMix = useInternalSequencer7Store((state) => state.setDelayMix)

  const editStepIndex = useInternalSequencerStoreConfigStore((state) => state.editStepIndex)
  const setEditStepIndex = useInternalSequencerStoreConfigStore((state) => state.setEditStepIndex)

  const sequencer1 = isInitialized ? ToneManager.getAmSynth() : null
  const sequencer2 = isInitialized ? ToneManager.getMonoSynth() : null
  const sequencer3 = isInitialized ? ToneManager.getDuoSynth() : null
  const sequencer4 = isInitialized ? ToneManager.getMetalSynth() : null
  const sequencer5 = isInitialized ? ToneManager.getMembraneSynth() : null
  const sequencer6 = isInitialized ? ToneManager.getFmSynth() : null
  const sequencer7 = isInitialized ? ToneManager.getPluckSynth() : null

  return {
    editStepIndex,
    setEditStepIndex,

    // sequencer 1
    sequencer1,
    sequencer1Steps,
    setSequencer1Steps,
    sequencer1Measures,
    setSequencer1Measures,
    sequencer1Volume,
    setSequencer1Volume,
    sequencer1ReverbMix,
    setSequencer1ReverbMix,
    sequencer1DelayMix,
    setSequencer1DelayMix,

    // sequencer 2
    sequencer2,
    sequencer2Steps,
    setSequencer2Steps,
    sequencer2Measures,
    setSequencer2Measures,
    sequencer2Volume,
    setSequencer2Volume,
    sequencer2ReverbMix,
    setSequencer2ReverbMix,
    sequencer2DelayMix,
    setSequencer2DelayMix,

    // sequencer 3
    sequencer3,
    sequencer3Steps,
    setSequencer3Steps,
    sequencer3Measures,
    setSequencer3Measures,
    sequencer3Volume,
    setSequencer3Volume,
    sequencer3ReverbMix,
    setSequencer3ReverbMix,
    sequencer3DelayMix,
    setSequencer3DelayMix,

    // sequencer 4
    sequencer4,
    sequencer4Steps,
    setSequencer4Steps,
    sequencer4Measures,
    setSequencer4Measures,
    sequencer4Volume,
    setSequencer4Volume,
    sequencer4ReverbMix,
    setSequencer4ReverbMix,
    sequencer4DelayMix,
    setSequencer4DelayMix,

    // sequencer 5
    sequencer5,
    sequencer5Steps,
    setSequencer5Steps,
    sequencer5Measures,
    setSequencer5Measures,
    sequencer5Volume,
    setSequencer5Volume,
    sequencer5ReverbMix,
    setSequencer5ReverbMix,
    sequencer5DelayMix,
    setSequencer5DelayMix,

    // sequencer 6
    sequencer6,
    sequencer6Steps,
    setSequencer6Steps,
    sequencer6Measures,
    setSequencer6Measures,
    sequencer6Volume,
    setSequencer6Volume,
    sequencer6ReverbMix,
    setSequencer6ReverbMix,
    sequencer6DelayMix,
    setSequencer6DelayMix,

    // sequencer 7
    sequencer7,
    sequencer7Steps,
    setSequencer7Steps,
    sequencer7Measures,
    setSequencer7Measures,
    sequencer7Volume,
    setSequencer7Volume,
    sequencer7ReverbMix,
    setSequencer7ReverbMix,
    sequencer7DelayMix,
    setSequencer7DelayMix,
  }
}

export default useSequencer
