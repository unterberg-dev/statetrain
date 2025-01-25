/**
 * INTERNAL HOOK
 * DO NOT IMPORT DIRECTLY - use useTone()
 */
import { create } from "zustand"

import { TRANSPORT_CONFIG } from "#lib/config"

export interface TransportStoreGetter {
  bpm: number
  timeSignature: number
  isPlaying: boolean
}

export interface TransportStoreSetter {
  setBpm: (payload: number | undefined) => void
  setTimeSignature: (payload: number | undefined) => void
  setIsPlaying: (payload: boolean | undefined) => void
}

export type TransportStoreValues = TransportStoreGetter & TransportStoreSetter

/**
 * @deprecated
 * do not import directly - use useTone.ts
 */
const useInternalTransportStore = create<TransportStoreValues>()((set) => ({
  bpm: TRANSPORT_CONFIG.bpm.default,
  setBpm: (payload) => set(() => ({ bpm: payload })),
  timeSignature: TRANSPORT_CONFIG.timeSignature.default,
  setTimeSignature: (payload) => set(() => ({ timeSignature: payload })),
  isPlaying: TRANSPORT_CONFIG.isPlaying,
  setIsPlaying: (payload) => set(() => ({ isPlaying: payload })),
}))

export default useInternalTransportStore
