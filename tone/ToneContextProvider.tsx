import ToneManager from "#tone/class/ToneManager"
import { ToneContext } from "#tone/ToneContext"
import { consola } from "consola/browser"
import { type ReactNode, useState, useCallback } from "react"
import { navigate } from "vike/client/router"

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
      navigate("")
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
