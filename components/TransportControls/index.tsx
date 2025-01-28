import { Play, Square } from "lucide-react"
import { useCallback } from "react"

import Button from "#components/common/Button"
import ElementContainer from "#components/common/ElementContainer"
import Layout from "#components/common/LayoutComponent"
import TransportSettings from "#components/TransportControls/TransportSettings"
import TransportVisualizer from "#components/TransportControls/TransportVisualizer"
import useTone from "#tone/useTone"
import { APP_CONFIG } from "#lib/config"
import useMetronome from "#tone/useMetronome"
import LayoutComponent from "#components/common/LayoutComponent"

const TransportControls = () => {
  const { isPlaying, handlePlay, handleStop } = useTone()
  const { handleToggleMetronome, isMetronomeStarted } = useMetronome()

  const handlePlayButtonClick = useCallback(
    () => (isPlaying ? handleStop() : handlePlay()),
    [handlePlay, handleStop, isPlaying],
  )

  return (
    <LayoutComponent className="flex justify-end !sticky !top-0 z-20">
      <ElementContainer className="inline-flex gap-3 items-stretch h-20">
        <TransportVisualizer />
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
      </ElementContainer>
    </LayoutComponent>
  )
}
export default TransportControls
