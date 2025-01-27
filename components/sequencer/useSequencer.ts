import { parseTransportPosition } from "#components/sequencer/utils"
import ToneManager from "#tone/ToneManager"
import type { SequencerMeasuresValue } from "#tone/useInternalSequencerStore"
import useTone from "#tone/useTone"
import { useState, useMemo, useEffect, useCallback } from "react"

interface UseSequencerProps {
  setSequencerSteps: (steps: boolean[]) => void
  measures: SequencerMeasuresValue
}

const useSequencer = ({ measures }: UseSequencerProps) => {
  const { timeSignature, isPlaying, loopLength } = useTone()
  const [activeStep, setActiveStep] = useState(0)

  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])
  const totalSteps = useMemo(() => measureSize * measures, [measureSize, measures])

  // track the current step for UI highlight
  useEffect(() => {
    function handleTick() {
      setActiveStep((prev) => (prev + 1) % totalSteps)
    }
    ToneManager.emitter.on("sixteenthTick", handleTick)
    return () => {
      ToneManager.emitter.off("sixteenthTick", handleTick)
    }
  }, [totalSteps])

  // reset highlight if user toggles global play
  useEffect(() => {
    if (isPlaying) {
      setActiveStep(0)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!ToneManager?.toneTransport) return

    const posString = ToneManager.toneTransport.position as string
    console.log("Transport position on mount:", posString)

    const totalSixteenthCount = parseTransportPosition(posString, timeSignature)

    // Each step in your sequencer UI is effectively one sixteenth note:
    const currentStep = totalSixteenthCount % totalSteps
    console.log("Current step:", currentStep)

    setActiveStep(Math.floor(currentStep))
  }, [timeSignature, totalSteps])

  return {
    activeStep,
    setActiveStep,
  }
}

export default useSequencer
