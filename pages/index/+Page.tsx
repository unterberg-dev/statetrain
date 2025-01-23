// src/components/IndexPage.jsx
import React, { useCallback, useEffect, useState } from "react"
import Button from "#components/common/Button"
import { consola } from "consola/browser"

import type * as Tone from "tone"
import { useToneContext } from "#tone/ToneContextProvider"
import MetronomeControls from "#pages/index/MetronomeControls"

const IndexPage = () => {
  const { startTransport, stopTransport, getTransportState, createSynth } = useToneContext()
  const [isTransportStarted, setIsTransportStarted] = useState(false)
  const [synth, setSynth] = useState<Tone.Synth | null>(null)

  const handleSetMetronome = useCallback(() => {
    consola.info("Setting metronome...")
    if (synth) {
      // Example: Play a metronome tick
      synth.triggerAttackRelease("C5", "64n")
    }
  }, [synth])

  const handleStartStop = useCallback(() => {
    const currentState = getTransportState()

    if (currentState === "started") {
      stopTransport()
      setIsTransportStarted(false)
    } else {
      startTransport()
      setIsTransportStarted(true)
    }
  }, [getTransportState, startTransport, stopTransport])

  // Example: Create a Synth on component mount
  useEffect(() => {
    const newSynth = createSynth()
    setSynth(newSynth)

    // Cleanup on unmount
    return () => {
      newSynth.dispose()
      consola.info("Synth disposed.")
    }
  }, [createSynth])

  // Example: Cleanup Transport on component unmount
  useEffect(() => {
    return () => {
      stopTransport()
      consola.info("Transport stopped on unmount.")
    }
  }, [stopTransport])

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Welcome to the Tone.js App</h1>
      <div className="space-x-4">
        <Button type="button" onClick={handleSetMetronome}>
          Play Metronome Tick
        </Button>
        <Button type="button" onClick={handleStartStop}>
          {isTransportStarted ? "Stop Tone" : "Start Tone"}
        </Button>
        <MetronomeControls />
      </div>
    </div>
  )
}

export default IndexPage
