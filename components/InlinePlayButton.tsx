import { Play, Square } from "lucide-react"
import type React from "react"
import { ButtonHTMLAttributes, useCallback } from "react"

import Button, { type ButtonProps } from "#components/common/Button"
import useTone from "#tone/useTone"

interface InlinePlayButtonProps extends ButtonProps {
  className?: string
}

const InlinePlayButton = ({ className, ...props }: InlinePlayButtonProps) => {
  const { isPlaying, handlePlay, handleStop } = useTone()

  const handlePlayButtonClick = useCallback(() => {
    if (isPlaying) {
      handleStop()
    } else {
      handlePlay()
    }
  }, [handlePlay, handleStop, isPlaying])

  return (
    <Button
      color={isPlaying ? "warning" : "success"}
      className={`${isPlaying ? "" : "animate-pulse"} ${className}`}
      onClick={handlePlayButtonClick}
      icon={
        isPlaying ? (
          <Square className="w-3 h-3" strokeWidth={4} />
        ) : (
          <Play className="w-3 h-3" strokeWidth={4} />
        )
      }
      {...props}
    >
      {isPlaying ? "Stop" : "Play"}
    </Button>
  )
}

export default InlinePlayButton
