import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"
import { type ReactNode, useState, useCallback, createContext, useContext } from "react"

interface ToneContextType {
  isInitialized: boolean
  initTone: () => void
  startTransport: () => void
  stopTransport: () => void
  getTransportState: () => string
  createSynth: () => SynthType
}

const ToneContext = createContext<ToneContextType | undefined>(undefined)

export const useToneContext = () => {
  const context = useContext(ToneContext)

  if (!context) {
    throw new Error("useToneContext must be used within a ToneContextProvider")
  }
  return context
}

const ToneContextProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const initTone = useCallback(async () => {
    if (isInitialized) {
      console.warn("Tone.js is already initialized.")
      return
    }

    if (isInitializing) {
      console.warn("Tone.js initialization is already in progress.")
      return
    }

    setIsInitializing(true)
    try {
      await ToneManager.init()
      setIsInitialized(true)
    } catch (error) {
      console.error("Failed to initialize Tone.js:", error)
    } finally {
      setIsInitializing(false)
    }
  }, [isInitialized, isInitializing])

  const startTransport = useCallback(() => {
    ToneManager.startTransport()
  }, [])

  const stopTransport = useCallback(() => {
    ToneManager.stopTransport()
  }, [])

  const getTransportState = useCallback(() => {
    return ToneManager.getTransportState()
  }, [])

  const createSynth = useCallback(() => {
    return ToneManager.createSynth()
  }, [])

  return (
    <ToneContext.Provider
      value={{
        isInitialized,
        initTone,
        startTransport,
        stopTransport,
        getTransportState,
        createSynth,
      }}
    >
      {children}
    </ToneContext.Provider>
  )
}

export default ToneContextProvider
