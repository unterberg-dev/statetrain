// src/components/MetronomeControls.jsx
import { useState, useCallback, useEffect } from "react"
import ToneManager from "#tone/ToneManager"
import Metronome from "#tone/Metronome"
import Button from "#components/common/Button"
import { consola } from "consola/browser"
import useTone from "#tone/useTone"

const metronome = new Metronome()

const MetronomeControls = () => {
  const [isToneReady, setIsToneReady] = useState(ToneManager.isInitialized)
  const [isMetroInit, setIsMetroInit] = useState(false)
  const [isMetroStarted, setIsMetroStarted] = useState(false)

  const handleInitTone = useCallback(async () => {
    if (!isToneReady) {
      try {
        await ToneManager.init() // triggers dynamic import if needed
        setIsToneReady(true)
      } catch (err) {
        consola.error("Error initializing Tone:", err)
      }
    } else {
      consola.warn("[MetronomeControls] ToneManager already initialized.")
    }
  }, [isToneReady])

  const handleStartMetro = useCallback(() => {
    if (!isToneReady || !isMetroInit) {
      consola.warn("[MetronomeControls] Metronome not ready to start.")
      return
    }
    if (!isMetroStarted) {
      metronome.register()
      setIsMetroStarted(true)
    }
  }, [isToneReady, isMetroInit, isMetroStarted])

  const handleStopMetro = useCallback(() => {
    if (isMetroStarted) {
      metronome.stop()
      setIsMetroStarted(false)
    }
  }, [isMetroStarted])

  useEffect(() => {
    if (isToneReady) {
      metronome.initMetronome()
      setIsMetroInit(true)
    }
  }, [isToneReady])

  return (
    <div className="flex gap-2">
      <Button onClick={handleInitTone} disabled={isToneReady}>
        {isToneReady ? "Tone Ready" : "Init Tone"}
      </Button>
      <Button onClick={handleStartMetro} disabled={!isToneReady || !isMetroInit || isMetroStarted}>
        Start Metronome
      </Button>
      <Button onClick={handleStopMetro} disabled={!isMetroStarted}>
        Stop Metronome
      </Button>
    </div>
  )
}

export default MetronomeControls
