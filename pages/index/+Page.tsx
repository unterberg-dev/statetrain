// src/components/IndexPage.jsx
import { useCallback, useEffect, useState } from "react"
import Button from "#components/common/Button"
import { consola } from "consola/browser"

import MetronomeControls from "#pages/index/MetronomeControls"
import useTone from "#tone/useTone"

const IndexPage = () => {
  const { handlePlay, handleStop, isPlaying } = useTone()
  const [isTransportStarted, setIsTransportStarted] = useState(false)

  const handleStartStop = useCallback(() => {
    if (isPlaying) {
      handleStop()
      setIsTransportStarted(false)
    } else {
      handlePlay()
      setIsTransportStarted(true)
    }
  }, [isPlaying, handlePlay, handleStop])

  // Example: Cleanup Transport on component unmount
  useEffect(() => {
    return () => {
      handleStop()
      consola.info("Transport stopped on unmount.")
    }
  }, [handleStop])

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Welcome to the Tone.js App</h1>
      <div className="space-x-4">
        <Button type="button" onClick={handleStartStop}>
          {isTransportStarted ? "Stop Tone" : "Start Tone"}
        </Button>
        <MetronomeControls />
      </div>
    </div>
  )
}

export default IndexPage
