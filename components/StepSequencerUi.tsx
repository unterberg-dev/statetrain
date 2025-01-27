import { useCallback, useEffect, useMemo, useState } from "react"
import rc from "react-classmate"

import { StepSequencer } from "#tone/StepSequencer"
import ToneManager from "#tone/ToneManager"
import useTone from "#tone/useTone"
import { Shuffle, Smile } from "lucide-react"
import Button from "#components/common/Button"

// the styling variant
const SequencerButtonBg = rc.div.variants<{
  $state: "current" | "inactive" | "fourths" | "eigths"
  $armed?: boolean
}>({
  base: "inset-0 absolute transition-colors", // sample styling
  variants: {
    $state: {
      current: (p) => (p.$armed ? "bg-warningLight scale-105 z-10" : "bg-light"),
      inactive: (p) => (p.$armed ? "bg-warning/70" : "bg-gray/50"),
      fourths: (p) => (p.$armed ? "bg-warning" : "bg-grayContrast"),
      eigths: (p) => (p.$armed ? "bg-warning/80" : "bg-grayContrast"),
    },
  },
})

// The chunk helper
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize))
  }
  return chunks
}

/** Generate a unique ID for measure+step, or any other approach. */
function getUniqueStepId(measureIndex: number, stepIndex: number) {
  return `m${measureIndex}-s${stepIndex}`
}

export function StepSequencerUI() {
  const [sequencer, setSequencer] = useState<StepSequencer | null>(null)
  const { timeSignature, loopLength, isPlaying, isInitialized } = useTone()
  const [activeStep, setActiveStep] = useState(0)
  const [steps, setSteps] = useState<boolean[]>([])

  // total steps across all measures (assuming 16th note resolution).
  const totalSteps = useMemo(() => timeSignature * loopLength * 4, [timeSignature, loopLength])

  // create step objects 0..(totalSteps-1)
  const stepObjects = useMemo(
    () => Array.from({ length: totalSteps }, (_, i) => ({ originalIndex: i })),
    [totalSteps],
  )

  // chunk by measure size (e.g. 4/4 => 16 steps per measure)
  const measureSize = useMemo(() => timeSignature * 4, [timeSignature])
  const measureChunks = useMemo(() => chunkArray(stepObjects, measureSize), [stepObjects, measureSize])

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

  // initialize the sequencer once
  useEffect(() => {
    if (isInitialized && !sequencer) {
      const s = new StepSequencer()
      setSequencer(s)
    }
  }, [isInitialized, sequencer])

  // reset highlight if user toggles global play
  useEffect(() => {
    if (isPlaying) {
      setActiveStep(0)
    }
  }, [isPlaying])

  // cleanup the sequencer on unmount
  useEffect(() => {
    if (!sequencer) return
    return () => {
      sequencer.dispose()
    }
  }, [sequencer])

  /** Toggles a step in the sequencer + updates local state copy of steps */
  const handleToggleStep = useCallback(
    (stepIndex: number) => {
      if (!sequencer) return
      sequencer.toggleStep(stepIndex)
      setSteps(sequencer.getSteps())
    },
    [sequencer],
  )

  const handleRandomPattern = useCallback(() => {
    if (!sequencer) return

    // Generate random booleans for each step
    const newRandomSteps = Array.from({ length: totalSteps }, () => Math.random() < 0.5)

    // Set them in the sequencer
    sequencer.setAllSteps(newRandomSteps)

    // Update our local `steps` state so the UI reflects the new pattern
    setSteps(sequencer.getSteps())
  }, [sequencer, totalSteps])

  if (!sequencer) {
    return <div>Sequencer not created yet...</div>
  }

  return (
    <>
      <div className="mb-2">
        <Button onClick={handleRandomPattern}>
          <Shuffle className="inline-block w-4 h-4 mr-2" />
          Randomize
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {/* map over each measure */}
        {measureChunks.map((measureSteps, measureIndex) => (
          <div
            key={getUniqueStepId(measureIndex, 0)} // measure-level key
            className="lg:flex lg:mb-0 mb-3 gap-1 min-h-20 grid grid-cols-8"
          >
            {measureSteps.map((stepObj, localIndex) => {
              const globalStepIdx = stepObj.originalIndex
              const isCurrent = activeStep === globalStepIdx
              const isArmed = steps[globalStepIdx]
              const uniqueKey = getUniqueStepId(measureIndex, localIndex)

              // Determine if it’s a quarter note step (4ths) or an eighth note step
              const isQuarter = globalStepIdx % 4 === 0
              const isEighth = globalStepIdx % 2 === 0

              let computedState: "current" | "inactive" | "fourths" | "eigths"
              if (isCurrent) {
                // if it’s the active step, highlight with "current"
                computedState = "current"
              } else if (isQuarter) {
                // highlight quarter steps
                computedState = "fourths"
              } else if (isEighth) {
                // highlight eighth steps
                computedState = "eigths"
              } else {
                // everything else
                computedState = "inactive"
              }

              return (
                <div className="relative flex-1" key={uniqueKey}>
                  <div className="flex absolute inset-0 z-50 pointer-events-none">
                    <Smile className={`w-6 h-6 ${computedState === "current" ? "block" : "hidden"}`} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleStep(globalStepIdx)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <SequencerButtonBg $state={computedState} $armed={isArmed} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}
