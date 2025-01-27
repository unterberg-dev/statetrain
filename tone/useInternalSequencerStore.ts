/**
 * INTERNAL HOOK
 * DO NOT IMPORT DIRECTLY - use useTone()
 */
import { TRANSPORT_CONFIG } from "#lib/config"
import { create } from "zustand"

export type SequencerMeasuresValue = 1 | 2 | 3 | 4

export interface SequencerStoreValues {
  steps: boolean[]
  setSteps: (payload: boolean[]) => void
  measures: SequencerMeasuresValue
  setMeasures: (payload: SequencerMeasuresValue) => void
}

/**
 * @deprecated
 * do not import directly - use useTone.ts
 */
export const useInternalSequencer1Store = create<SequencerStoreValues>()((set) => ({
  steps: [],
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))

/**
 * @deprecated
 * do not import directly - use useTone.ts
 */
export const useInternalSequencer2Store = create<SequencerStoreValues>()((set) => ({
  steps: [],
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))

/**
 * @deprecated
 * do not import directly - use useTone.ts
 */
export const useInternalSequencer3Store = create<SequencerStoreValues>()((set) => ({
  steps: [],
  setSteps: (payload) => set(() => ({ steps: payload })),
  measures: TRANSPORT_CONFIG.loopLength.default,
  setMeasures: (payload) => set(() => ({ measures: payload })),
}))
