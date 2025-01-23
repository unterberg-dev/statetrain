// src/components/MetronomeControls.jsx
import { useState, useCallback } from "react"
import ToneManager from "#tone/ToneManager"
import Metronome from "#tone/Metronome"
import Button from "#components/common/Button"
import { consola } from "consola/browser"

const metronome = new Metronome()

const MetronomeControls = () => {
  const [isToneReady, setIsToneReady] = useState(ToneManager.isInitialized)
  const [isMetroInit, setIsMetroInit] = useState(false)
  const [isMetroStarted, setIsMetroStarted] = useState(false)
  const [isTransportStarted, setIsTransportStarted] = useState(false)

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

  const handleInitMetro = useCallback(() => {
    if (!isToneReady) {
      consola.warn("[MetronomeControls] Tone not ready, init first.")
      return
    }
    if (!isMetroInit) {
      metronome.initMetronome()
      setIsMetroInit(true)
    } else {
      consola.warn("[MetronomeControls] Metronome already initialized.")
    }
  }, [isToneReady, isMetroInit])

  const handleStartMetro = useCallback(() => {
    if (!isToneReady || !isMetroInit) {
      consola.warn("[MetronomeControls] Metronome not ready to start.")
      return
    }
    if (!isMetroStarted) {
      metronome.start()
      setIsMetroStarted(true)
    }
  }, [isToneReady, isMetroInit, isMetroStarted])

  const handleStopMetro = useCallback(() => {
    if (isMetroStarted) {
      metronome.stop()
      setIsMetroInit(false)
      setIsMetroStarted(false)
    }
  }, [isMetroStarted])

  const handleToggleTransport = useCallback(() => {
    if (!isToneReady) return
    const state = ToneManager.getTransportState()
    if (state === "started") {
      ToneManager.stopTransport()
      setIsTransportStarted(false)
    } else {
      ToneManager.startTransport()
      setIsTransportStarted(true)
    }
  }, [isToneReady])

  return (
    <div className="flex gap-2">
      <Button onClick={handleInitTone} disabled={isToneReady}>
        {isToneReady ? "Tone Ready" : "Init Tone"}
      </Button>
      <Button onClick={handleInitMetro} disabled={!isToneReady || isMetroInit}>
        {isMetroInit ? "Metronome Init" : "Init Metronome"}
      </Button>
      <Button onClick={handleStartMetro} disabled={!isToneReady || !isMetroInit || isMetroStarted}>
        Start Metronome
      </Button>
      <Button onClick={handleStopMetro} disabled={!isMetroStarted}>
        Stop Metronome
      </Button>
      <Button onClick={handleToggleTransport} disabled={!isToneReady}>
        {isTransportStarted ? "Stop Transport" : "Start Transport"}
      </Button>
    </div>
  )
}

export default MetronomeControls
