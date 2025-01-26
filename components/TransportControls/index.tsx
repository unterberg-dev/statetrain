import { Play, Square } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import consola from "consola"

import Button from "#components/common/Button"
import ElementContainer from "#components/common/ElementContainer"
import Layout from "#components/common/LayoutComponent"
import TransportSettings from "#components/TransportControls/TransportSettings"
import TransportVisualizer from "#components/TransportControls/TransportVisualizer"
import useTone from "#tone/useTone"
import Metronome from "#tone/Metronome"

const TransportControls = () => {
  const { isPlaying, isInitialized, handlePlay, handleStop } = useTone()
  const [isMetroStarted, setIsMetroStarted] = useState(false)
  const [isMetroInit, setIsMetroInit] = useState(false)

  const handleToggleMetro = useCallback(() => {
    if (!isMetroInit) {
      consola.warn("[TransportControls] Metronome not ready to start.")
      return
    }

    if (isMetroStarted) {
      Metronome.unregister()
      setIsMetroStarted(false)
    } else {
      Metronome.register()
      setIsMetroStarted(true)
    }
  }, [isMetroStarted, isMetroInit])

  const handlePlayButtonClick = useCallback(() => {
    if (isPlaying) {
      handleStop()
    } else {
      handlePlay()
    }
  }, [handlePlay, handleStop, isPlaying])

  useEffect(() => {
    if (isInitialized) {
      Metronome.initMetronome()
      Metronome.register()
      setIsMetroInit(true)
      setIsMetroStarted(true)
    }
  }, [isInitialized])

  return (
    <Layout className="mt-10 flex">
      <ElementContainer className="inline-flex gap-2 items-stretch h-20">
        <TransportSettings />
        <Button
          className={`"flex-1 w-14" ${isPlaying ? "" : "animate-pulse"}`}
          color={isPlaying ? "error" : "success"}
          icon={isPlaying ? <Square className="w-10 h-10" /> : <Play className="w-10 h-10" />}
          onClick={handlePlayButtonClick}
        />
        <Button
          className="flex-1 w-14"
          color={isMetroStarted ? "warning" : "success"}
          icon={<img src="./icons/metronome-svgrepo-com.svg" alt="Stop" className="w-10 h-10" />}
          onClick={handleToggleMetro}
        />
        <TransportVisualizer />
      </ElementContainer>
    </Layout>
  )
}
export default TransportControls
