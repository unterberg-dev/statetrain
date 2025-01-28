import ToneManager from "#tone/class/ToneManager"
import { consola } from "consola/browser"
import { type ReactNode, useState, useCallback, createContext } from "react"

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
      consola.warn("Tone.js is already initialized.")
      return
    }

    if (isInitializing) {
      consola.warn("Tone.js initialization is already in progress.")
      return
    }

    setIsInitializing(true)
    try {
      await ToneManager.init()
      setIsInitialized(true)
    } catch (error) {
      consola.error("Failed to initialize Tone.js:", error)
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
