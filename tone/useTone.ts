import useInternalTransportStore from "#tone/useInternalTransportStore"
import { ToneContext } from "#tone/ToneContextProvider"
import ToneManager from "#tone/ToneManager"
import { useCallback, useContext, useMemo } from "react"

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
    ToneManager.startTransport()
    setIsPlaying(true)
  }, [setIsPlaying])

  const handleStop = useCallback(() => {
    ToneManager.stopTransport()
    setIsPlaying(false)
  }, [setIsPlaying])

  const handleChangeBpm = useCallback(
    (value: number) => {
      setBpm(value)
      ToneManager.setBpm(value)
    },
    [setBpm],
  )

  const handleChangeTimeSignature = useCallback(
    (value: number) => {
      setTimeSignature(value)
      ToneManager.setTimeSignature(value)
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
  } as const
}

export default useTone
