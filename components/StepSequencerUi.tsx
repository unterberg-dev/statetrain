// StepSequencerUI.tsx
import { StepSequencer } from "#tone/StepSequencer"
import ToneManager from "#tone/ToneManager"
import useTone from "#tone/useTone"
import { useCallback, useEffect, useMemo, useState } from "react"
import rc from "react-classmate"

const SequencerButtonBg = rc.div.variants<{
  $state: "current" | "inactive"
  $armed?: boolean
}>({
  base: "inset-0 transition-colors absolute",
  variants: {
    $state: {
      current: (p) => (p.$armed ? "bg-warningLight" : "bg-light"),
      inactive: (p) => (p.$armed ? "bg-warning" : "bg-gray"),
    },
  },
})

export function StepSequencerUI() {
  const [sequencer, setSequencer] = useState<StepSequencer | null>(null)
  const { timeSignature, isPlaying } = useTone()
  const [activeStep, setActiveStep] = useState(0)
  const [steps, setSteps] = useState<boolean[]>([])

  const stepsMap = useMemo(
    () =>
      Array.from({ length: timeSignature * 4 * 4 }, (_, i) => i).map((i) => ({
        id: i,
      })),
    [timeSignature],
  )

  useEffect(() => {
    function handleTick() {
      setActiveStep((prev) => (prev + 1) % ToneManager.totalSixteenthTicks)
    }
    ToneManager.events.on("sixteenthTick", handleTick)

    return () => {
      ToneManager.events.off("sixteenthTick", handleTick)
    }
  }, [])

  useEffect(() => {
    if (ToneManager.isInitialized && !sequencer) {
      const seq = new StepSequencer()
      setSequencer(seq)
    }
  }, [sequencer])

  useEffect(() => {
    if (isPlaying) {
      setActiveStep(0)
    }
  }, [isPlaying])

  /** Toggle a step in the sequencer */
  const handleToggleStep = useCallback(
    (e: number) => {
      // read from data attribute
      const idx = Number(e)
      if (!sequencer) return
      sequencer.toggleStep(idx)
      setSteps(sequencer.getSteps())
    },
    [sequencer],
  )

  const stepHandlers = useMemo(() => {
    return stepsMap.map((item) => () => handleToggleStep(item.id))
  }, [stepsMap, handleToggleStep])

  if (!sequencer) {
    return <div>Sequencer not created yet...</div>
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="gap-2 grid grid-cols-16">
        {stepsMap.map((item) => {
          const isCurrent = activeStep === item.id
          const isArmed = steps[item.id]

          return (
            <div className="w-12 h-12 relative" key={item.id}>
              {item.id + 1}
              <button
                type="button"
                onClick={stepHandlers[item.id]}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <SequencerButtonBg $state={isCurrent ? "current" : "inactive"} $armed={isArmed} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
