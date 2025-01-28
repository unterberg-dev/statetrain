import Metronome from "#tone/class/Metronome"
import useTone from "#tone/useTone"
import { consola } from "consola/browser"
import { useCallback } from "react"
import { create } from "zustand"

export interface MetronomeStoreValues {
  isMetronomeStarted: boolean
  setIsMetronomeStarted: (payload: boolean | undefined) => void
  isMetronomeInit: boolean
  setIsMetronomeInit: (payload: boolean | undefined) => void
}

const useInternalMetronomeStore = create<MetronomeStoreValues>()((set) => ({
  isMetronomeStarted: true,
  setIsMetronomeStarted: (payload) => set(() => ({ isMetronomeStarted: payload })),
  isMetronomeInit: false,
  setIsMetronomeInit: (payload) => set(() => ({ isMetronomeInit: payload })),
}))

const useMetronome = () => {
  const { isInitialized } = useTone()
  const isMetronomeStarted = useInternalMetronomeStore((state) => state.isMetronomeStarted)
  const setIsMetronomeStarted = useInternalMetronomeStore((state) => state.setIsMetronomeStarted)
  const isMetronomeInit = useInternalMetronomeStore((state) => state.isMetronomeInit)
  const setIsMetronomeInit = useInternalMetronomeStore((state) => state.setIsMetronomeInit)

  const handleToggleMetronome = useCallback(() => {
    if (!isMetronomeInit) {
      consola.warn("[TransportControls] Metronomenome not ready to start.")
      return
    }

    if (isMetronomeStarted) {
      Metronome.stop()
      setIsMetronomeStarted(false)
    } else {
      Metronome.start()
      setIsMetronomeStarted(true)
    }
  }, [isMetronomeStarted, isMetronomeInit, setIsMetronomeStarted])

  const handleMetronomeInit = useCallback(() => {
    if (isInitialized) {
      Metronome.stop()
      Metronome.initialize()
      Metronome.start()
      setIsMetronomeInit(true)
      setIsMetronomeStarted(true)
    }
  }, [setIsMetronomeInit, setIsMetronomeStarted, isInitialized])

  return {
    handleToggleMetronome,
    isMetronomeStarted,
    setIsMetronomeStarted,
    handleMetronomeInit,
  }
}

export default useMetronome
