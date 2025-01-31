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
import Metronome from "#tone/class/Metronome"
import { getPercentSingleValue, ruleOfThree } from "#utils/index"
import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import Knob from "#components/Knob"

const TransportControls = () => {
  const { isPlaying, handlePlay, handleStop } = useTone()
  const { handleToggleMetronome, isMetronomeStarted, volume, setVolume } = useMetronome()

  const handlePlayButtonClick = useCallback(
    () => (isPlaying ? handleStop() : handlePlay()),
    [handlePlay, handleStop, isPlaying],
  )

  const throttledOnChangeVolume = useThrottledCallback((value: number) => {
    if (Metronome) {
      setVolume(Math.floor(value))
      const interpolatedValue = ruleOfThree(value, -50, 20)
      Metronome.setVolume(interpolatedValue)
    }
  }, 300)

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
          color={isMetronomeStarted ? "primary" : "success"}
          icon={
            <img
              src={`${APP_CONFIG.viteUrl}/icons/metronome-svgrepo-com.svg`}
              alt="Stop"
              className="w-10 h-10"
            />
          }
          onClick={handleToggleMetronome}
        />
        <Knob
          width={32}
          height={32}
          label="Metronome"
          onChange={throttledOnChangeVolume}
          value={
            volume ||
            getPercentSingleValue({
              min: -50,
              max: 20,
              value: 0,
            })
          }
        />
      </ElementContainer>
    </LayoutComponent>
  )
}
export default TransportControls
