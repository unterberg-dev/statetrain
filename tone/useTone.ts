import useInternalTransportStore from "#root/zustand/useInternalTransportStore"
import { ToneContext } from "#tone/ToneContextProvider"
import ToneManager from "#tone/ToneManager"
import { useCallback, useContext } from "react"

export const useTone = () => {
  const context = useContext(ToneContext)
  const setIsPlaying = useInternalTransportStore((state) => state.setIsPlaying)
  const isPlaying = useInternalTransportStore((state) => state.isPlaying)

  const handlePlay = useCallback(() => {
    ToneManager.startTransport()
    setIsPlaying(true)
  }, [setIsPlaying])

  const handleStop = useCallback(() => {
    ToneManager.stopTransport()
    setIsPlaying(false)
  }, [setIsPlaying])

  const handleChangeTimeSignature = useCallback((value: number) => {
    ToneManager.setTimeSignature(value)
  }, [])

  if (!context) {
    throw new Error("useTone must be used within a ToneContextProvider")
  }

  return {
    isPlaying,
    handlePlay,
    handleStop,
    handleChangeTimeSignature,
    initTone: context.initTone,
    isInitialized: context.isInitialized,
  } as const
}

export default useTone
