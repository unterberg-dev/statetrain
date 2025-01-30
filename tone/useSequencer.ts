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

interface SequencerStoreConfig {
  editStepIndex: number | undefined
  setEditStepIndex: (setterFn: StoreReactStateSetter<number | undefined>) => void
}

export const useInternalSequencerStoreConfigStore = create<SequencerStoreConfig>()((set) => ({
  editStepIndex: undefined,
  setEditStepIndex: (setterFn) => {
    set(({ editStepIndex }) => {
      const setter = setterFn
      return {
        editStepIndex: typeof setter === "function" ? setter(editStepIndex) : setter,
      }
    })
  },
}))

export interface SequencerStoreValues {
  steps: Steps
  setSteps: (payload: Steps) => void
  measures: SequencerMeasuresValue
  setMeasures: (payload: SequencerMeasuresValue) => void
  volume: number
  setVolume: (payload: number) => void
}

export const useInternalSequencer1Store = create<SequencerStoreValues>()((set) => ({
  steps: [], // sequencer1DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer1DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
}))

export const useInternalSequencer2Store = create<SequencerStoreValues>()((set) => ({
  steps: [], //sequencer2DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer2DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
}))

export const useInternalSequencer3Store = create<SequencerStoreValues>()((set) => ({
  steps: [], // sequencer3DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer3DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
}))

export const useInternalSequencer4Store = create<SequencerStoreValues>()((set) => ({
  steps: [], // sequencer4DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer4DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
}))

export const useInternalSequencer5Store = create<SequencerStoreValues>()((set) => ({
  steps: [], // sequencer4DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer5DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
}))

export const useInternalSequencer6Store = create<SequencerStoreValues>()((set) => ({
  steps: [], // sequencer4DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer6DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
}))

export const useInternalSequencer7Store = create<SequencerStoreValues>()((set) => ({
  steps: [], // sequencer4DefaultSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: sequencer7DefaultMeasures,
  setMeasures: (payload) => set(() => ({ measures: payload })),
  volume: 0,
  setVolume: (payload) => set(() => ({ volume: payload })),
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

  // sequencer 2
  const sequencer2Steps = useInternalSequencer2Store((state) => state.steps)
  const setSequencer2Steps = useInternalSequencer2Store((state) => state.setSteps)
  const sequencer2Measures = useInternalSequencer2Store((state) => state.measures)
  const setSequencer2Measures = useInternalSequencer2Store((state) => state.setMeasures)
  const sequencer2Volume = useInternalSequencer2Store((state) => state.volume)
  const setSequencer2Volume = useInternalSequencer2Store((state) => state.setVolume)

  // sequencer 3
  const sequencer3Steps = useInternalSequencer3Store((state) => state.steps)
  const setSequencer3Steps = useInternalSequencer3Store((state) => state.setSteps)
  const sequencer3Measures = useInternalSequencer3Store((state) => state.measures)
  const setSequencer3Measures = useInternalSequencer3Store((state) => state.setMeasures)
  const sequencer3Volume = useInternalSequencer3Store((state) => state.volume)
  const setSequencer3Volume = useInternalSequencer3Store((state) => state.setVolume)

  // sequencer 4
  const sequencer4Steps = useInternalSequencer4Store((state) => state.steps)
  const setSequencer4Steps = useInternalSequencer4Store((state) => state.setSteps)
  const sequencer4Measures = useInternalSequencer4Store((state) => state.measures)
  const setSequencer4Measures = useInternalSequencer4Store((state) => state.setMeasures)
  const sequencer4Volume = useInternalSequencer4Store((state) => state.volume)
  const setSequencer4Volume = useInternalSequencer4Store((state) => state.setVolume)

  // sequencer 5
  const sequencer5Steps = useInternalSequencer5Store((state) => state.steps)
  const setSequencer5Steps = useInternalSequencer5Store((state) => state.setSteps)
  const sequencer5Measures = useInternalSequencer5Store((state) => state.measures)
  const setSequencer5Measures = useInternalSequencer5Store((state) => state.setMeasures)
  const sequencer5Volume = useInternalSequencer5Store((state) => state.volume)
  const setSequencer5Volume = useInternalSequencer5Store((state) => state.setVolume)

  // sequencer 6
  const sequencer6Steps = useInternalSequencer6Store((state) => state.steps)
  const setSequencer6Steps = useInternalSequencer6Store((state) => state.setSteps)
  const sequencer6Measures = useInternalSequencer6Store((state) => state.measures)
  const setSequencer6Measures = useInternalSequencer6Store((state) => state.setMeasures)
  const sequencer6Volume = useInternalSequencer6Store((state) => state.volume)
  const setSequencer6Volume = useInternalSequencer6Store((state) => state.setVolume)

  // sequencer 7
  const sequencer7Steps = useInternalSequencer7Store((state) => state.steps)
  const setSequencer7Steps = useInternalSequencer7Store((state) => state.setSteps)
  const sequencer7Measures = useInternalSequencer7Store((state) => state.measures)
  const setSequencer7Measures = useInternalSequencer7Store((state) => state.setMeasures)
  const sequencer7Volume = useInternalSequencer7Store((state) => state.volume)
  const setSequencer7Volume = useInternalSequencer7Store((state) => state.setVolume)

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

    // sequencer 2
    sequencer2,
    sequencer2Steps,
    setSequencer2Steps,
    sequencer2Measures,
    setSequencer2Measures,
    sequencer2Volume,
    setSequencer2Volume,

    // sequencer 3
    sequencer3,
    sequencer3Steps,
    setSequencer3Steps,
    sequencer3Measures,
    setSequencer3Measures,
    sequencer3Volume,
    setSequencer3Volume,

    // sequencer 4
    sequencer4,
    sequencer4Steps,
    setSequencer4Steps,
    sequencer4Measures,
    setSequencer4Measures,
    sequencer4Volume,
    setSequencer4Volume,

    // sequencer 5
    sequencer5,
    sequencer5Steps,
    setSequencer5Steps,
    sequencer5Measures,
    setSequencer5Measures,
    sequencer5Volume,
    setSequencer5Volume,

    // sequencer 6
    sequencer6,
    sequencer6Steps,
    setSequencer6Steps,
    sequencer6Measures,
    setSequencer6Measures,
    sequencer6Volume,
    setSequencer6Volume,

    // sequencer 7
    sequencer7,
    sequencer7Steps,
    setSequencer7Steps,
    sequencer7Measures,
    setSequencer7Measures,
    sequencer7Volume,
    setSequencer7Volume,
  }
}

export default useSequencer
