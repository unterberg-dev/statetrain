import { TRANSPORT_CONFIG, transportDefaultSixteenthsSteps } from "#lib/config"
import ToneManager from "#tone/class/ToneManager"
import useTone from "#tone/useTone"
import { create } from "zustand"

export type SequencerMeasuresValue = 1 | 2 | 3 | 4

export interface SequencerStoreValues {
  steps: boolean[]
  setSteps: (payload: boolean[]) => void
  measures: SequencerMeasuresValue
  setMeasures: (payload: SequencerMeasuresValue) => void
}

const useInternalSequencer1Store = create<SequencerStoreValues>()((set) => ({
  steps: transportDefaultSixteenthsSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))

const useInternalSequencer2Store = create<SequencerStoreValues>()((set) => ({
  steps: transportDefaultSixteenthsSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))

const useInternalSequencer3Store = create<SequencerStoreValues>()((set) => ({
  steps: transportDefaultSixteenthsSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))

const useInternalSequencer4Store = create<SequencerStoreValues>()((set) => ({
  steps: transportDefaultSixteenthsSteps,
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))

const useSequencer = () => {
  const { isInitialized } = useTone()

  // sequencer 1
  const sequencer1Steps = useInternalSequencer1Store((state) => state.steps)
  const setSequencer1Steps = useInternalSequencer1Store((state) => state.setSteps)
  const sequencer1Measures = useInternalSequencer1Store((state) => state.measures)
  const setSequencer1Measures = useInternalSequencer1Store((state) => state.setMeasures)

  // sequencer 2
  const sequencer2Steps = useInternalSequencer2Store((state) => state.steps)
  const setSequencer2Steps = useInternalSequencer2Store((state) => state.setSteps)
  const sequencer2Measures = useInternalSequencer2Store((state) => state.measures)
  const setSequencer2Measures = useInternalSequencer2Store((state) => state.setMeasures)

  // sequencer 3
  const sequencer3Steps = useInternalSequencer3Store((state) => state.steps)
  const setSequencer3Steps = useInternalSequencer3Store((state) => state.setSteps)
  const sequencer3Measures = useInternalSequencer3Store((state) => state.measures)
  const setSequencer3Measures = useInternalSequencer3Store((state) => state.setMeasures)

  // sequencer 4
  const sequencer4Steps = useInternalSequencer4Store((state) => state.steps)
  const setSequencer4Steps = useInternalSequencer4Store((state) => state.setSteps)
  const sequencer4Measures = useInternalSequencer4Store((state) => state.measures)
  const setSequencer4Measures = useInternalSequencer4Store((state) => state.setMeasures)

  const sequencer1 = isInitialized ? ToneManager.getSequencer1() : null
  const sequencer2 = isInitialized ? ToneManager.getSequencer2() : null
  const sequencer3 = isInitialized ? ToneManager.getSequencer3() : null
  const sequencer4 = isInitialized ? ToneManager.getSequencer4() : null

  return {
    // sequencer 1
    sequencer1,
    sequencer1Steps,
    setSequencer1Steps,
    sequencer1Measures,
    setSequencer1Measures,

    // sequencer 2
    sequencer2,
    sequencer2Steps,
    setSequencer2Steps,
    sequencer2Measures,
    setSequencer2Measures,

    // sequencer 3
    sequencer3,
    sequencer3Steps,
    setSequencer3Steps,
    sequencer3Measures,
    setSequencer3Measures,

    // sequencer 4
    sequencer4,
    sequencer4Steps,
    setSequencer4Steps,
    sequencer4Measures,
    setSequencer4Measures,
  }
}

export default useSequencer
