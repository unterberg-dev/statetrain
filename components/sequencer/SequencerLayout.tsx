import SequencerControls from "#components/sequencer/SequencerControls"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import { chunkArray } from "#components/sequencer/utils"
import useTone from "#tone/useTone"
import { useMemo } from "react"
import PianoRoll from "#components/PianoRoll"
import useSequencer from "#tone/useSequencer"
import LayoutComponent from "#components/common/LayoutComponent"
import StepButtonHighlight from "#components/sequencer/StepButtonHighlight"
import { ActiveStepProvider } from "#tone/ActiveStepProvider"
import SequencerKnobs from "#components/sequencer/Knobs"

const SequencerLayout = () => {
  const { timeSignature, loopLength } = useTone()
  const {
    currentSequencer: { steps },
  } = useSequencer()

  const measureSize = useMemo(() => timeSignature * loopLength, [timeSignature, loopLength])

  const measureChunks = useMemo(() => {
    return chunkArray(
      Array.from({ length: steps.length }, (_, i) => ({ originalIndex: i })),
      measureSize,
    )
  }, [steps, measureSize])

  return (
    <LayoutComponent className="p-4 rounded-sm bg-black">
      <div className="flex justify-between items-center mb-5">
        <SequencerControls />
        <SequencerKnobs />
      </div>
      <ActiveStepProvider>
        <div className="relative">
          <StepButtonMap measureChunks={measureChunks} />
          <StepButtonHighlight measureChunks={measureChunks} />
        </div>
        <PianoRoll />
      </ActiveStepProvider>
    </LayoutComponent>
  )
}

export default SequencerLayout
