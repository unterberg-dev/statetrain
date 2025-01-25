import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"
import { type ReactNode, useState, useCallback, createContext, useContext } from "react"

interface ToneContextType {
  isInitialized: boolean
  initTone: () => void
}

export const ToneContext = createContext<ToneContextType | undefined>(undefined)

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

  return (
    <ToneContext.Provider
      value={{
        isInitialized,
        initTone,
      }}
    >
      {children}
    </ToneContext.Provider>
  )
}

export default ToneContextProvider
