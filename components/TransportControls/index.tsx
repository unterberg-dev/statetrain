import { Play, Square } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import consola from "consola"

import Button from "#components/common/Button"
import ElementContainer from "#components/common/ElementContainer"
import Layout from "#components/common/LayoutComponent"
import TransportSettings from "#components/TransportControls/TransportSettings"
import TransportVisualizer from "#components/TransportControls/TransportVisualizer"
import useTone from "#tone/useTone"
import { APP_CONFIG } from "#lib/config"
import Metronome from "#tone/Metronome"

const TransportControls = () => {
  const { isPlaying, isInitialized, handlePlay, handleStop } = useTone()
  const [isMetronomeStarted, setIsMetronomeStarted] = useState(false)
  const [isMetronomeInit, setIsMetronomeInit] = useState(false)

  const handleToggleMetronome = useCallback(() => {
    if (!isMetronomeInit) {
      consola.warn("[TransportControls] Metronomenome not ready to start.")
      return
    }

    if (isMetronomeStarted) {
      Metronome.unregister()
      setIsMetronomeStarted(false)
    } else {
      Metronome.register()
      setIsMetronomeStarted(true)
    }
  }, [isMetronomeStarted, isMetronomeInit])

  const handlePlayButtonClick = useCallback(
    () => (isPlaying ? handleStop() : handlePlay()),
    [handlePlay, handleStop, isPlaying],
  )

  useEffect(() => {
    if (isInitialized) {
      Metronome.init()
      Metronome.register()
      setIsMetronomeInit(true)
      setIsMetronomeStarted(true)
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
          color={isMetronomeStarted ? "warning" : "success"}
          icon={
            <img
              src={`${APP_CONFIG.viteUrl}/icons/metronome-svgrepo-com.svg`}
              alt="Stop"
              className="w-10 h-10"
            />
          }
          onClick={handleToggleMetronome}
        />
        <TransportVisualizer />
      </ElementContainer>
    </Layout>
  )
}
export default TransportControls
