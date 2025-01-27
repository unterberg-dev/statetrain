import useInternalTransportStore from "#tone/useInternalTransportStore"
import { ToneContext } from "#tone/ToneContextProvider"
import ToneManager from "#tone/ToneManager"
import { useCallback, useContext, useMemo } from "react"
import { TRANSPORT_CONFIG } from "#lib/config"

/** the tone controller */
export const useTone = () => {
  const context = useContext(ToneContext)

  // the only place we need reference zustand
  const setIsPlaying = useInternalTransportStore((state) => state.setIsPlaying)
  const isPlaying = useInternalTransportStore((state) => state.isPlaying)
  const bpm = useInternalTransportStore((state) => state.bpm)
  const setBpm = useInternalTransportStore((state) => state.setBpm)
  const timeSignature = useInternalTransportStore((state) => state.timeSignature)
  const setTimeSignature = useInternalTransportStore((state) => state.setTimeSignature)

  const isInitialized = useMemo(() => context?.isInitialized, [context])

  const initTone = useCallback(() => {
    if (context?.initTone) {
      context.initTone()
    }
  }, [context])

  const handlePlay = useCallback(() => {
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

  if (!context) {
    throw new Error("useTone must be used within a ToneContextProvider")
  }

  return {
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
  } as const
}

export default useTone
