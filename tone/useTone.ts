import { ToneContext } from "#tone/ToneContextProvider"
import ToneManager from "#tone/class/ToneManager"
import { useCallback, useContext, useMemo } from "react"
import { TRANSPORT_CONFIG } from "#lib/config"
import { create } from "zustand"
import { consola } from "consola/browser"

interface TransportStoreGetter {
  bpm: number
  timeSignature: number
  isPlaying: boolean
}

interface TransportStoreSetter {
  setBpm: (payload: number | undefined) => void
  setTimeSignature: (payload: number | undefined) => void
  setIsPlaying: (payload: boolean | undefined) => void
}

export type TransportStoreValues = TransportStoreGetter & TransportStoreSetter

const useInternalTransportStore = create<TransportStoreValues>()((set) => ({
  bpm: TRANSPORT_CONFIG.bpm.default,
  setBpm: (payload) => set(() => ({ bpm: payload })),
  timeSignature: TRANSPORT_CONFIG.timeSignature.default,
  setTimeSignature: (payload) => set(() => ({ timeSignature: payload })),
  isPlaying: TRANSPORT_CONFIG.isPlaying,
  setIsPlaying: (payload) => set(() => ({ isPlaying: payload })),
}))

/** the tone controller */
const useTone = () => {
  const context = useContext(ToneContext)

  // transport
  const setIsPlaying = useInternalTransportStore((state) => state.setIsPlaying)
  const isPlaying = useInternalTransportStore((state) => state.isPlaying)
  const bpm = useInternalTransportStore((state) => state.bpm)
  const setBpm = useInternalTransportStore((state) => state.setBpm)
  const timeSignature = useInternalTransportStore((state) => state.timeSignature)
  const setTimeSignature = useInternalTransportStore((state) => state.setTimeSignature)

  const initTone = useCallback(() => {
    if (context?.initTone) {
      context.initTone()
    }
  }, [context])

  const isInitialized = useMemo(() => context?.isInitialized, [context])
  const transport = useMemo(() => isInitialized && ToneManager.toneTransport, [isInitialized])
  const tone = useMemo(() => isInitialized && ToneManager.getTone(), [isInitialized])

  const handlePlay = useCallback(() => {
    ToneManager.register()
    ToneManager.start()
    setIsPlaying(true)
  }, [setIsPlaying])

  const handleStop = useCallback(() => {
    ToneManager.stop()
    setIsPlaying(false)
  }, [setIsPlaying])

  const handleChangeBpm = useCallback(
    (value: number) => {
      if (value <= TRANSPORT_CONFIG.bpm.max && value >= TRANSPORT_CONFIG.bpm.min) {
        setBpm(value)
        ToneManager.updateBpm(value)
      }
    },
    [setBpm],
  )

  const handleChangeTimeSignature = useCallback(
    (value: number) => {
      if (value <= TRANSPORT_CONFIG.timeSignature.max && value >= TRANSPORT_CONFIG.timeSignature.min) {
        ToneManager.updateTimeSignature(value)
        setTimeSignature(value)
      }
    },
    [setTimeSignature],
  )

  const registerQuarterTick = useCallback((event: () => void) => {
    ToneManager.emitter.on("quarterTick", event)
    return () => {
      ToneManager.emitter.off("quarterTick", event)
    }
  }, [])

  const unregisterQuarterTick = useCallback((event: () => void) => {
    ToneManager.emitter.off("quarterTick", event)
  }, [])

  const registerSixteenthTick = useCallback((event: () => void) => {
    ToneManager.emitter.on("sixteenthTick", event)
    return () => {
      consola.log("unregistering sixteenth tick")
      ToneManager.emitter.off("sixteenthTick", event)
    }
  }, [])

  const unregisterSixteenthTick = useCallback((event: () => void) => {
    ToneManager.emitter.off("sixteenthTick", event)
  }, [])

  if (!context) {
    throw new Error("useTone must be used within a ToneContextProvider")
  }

  return {
    tone,
    transport,
    isPlaying,
    handlePlay,
    handleStop,
    bpm,
    handleChangeBpm,
    timeSignature,
    handleChangeTimeSignature,
    initTone,
    isInitialized,
    loopLength: TRANSPORT_CONFIG.loopLength.default,
    registerQuarterTick,
    unregisterQuarterTick,
    registerSixteenthTick,
    unregisterSixteenthTick,
  } as const
}

export default useTone
