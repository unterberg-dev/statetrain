import SequencerControls from "#components/Sequencer/SequencerControls"
import StepButtonMap from "#components/Sequencer/StepButtonMap"
import { chunkArray } from "#components/Sequencer/utils"
import useTone from "#tone/useTone"
import { useMemo } from "react"
import useSequencer from "#tone/useSequencer"
import LayoutComponent from "#components/common/LayoutComponent"
import StepButtonHighlight from "#components/Sequencer/StepButtonHighlight"
import SequencerKnobs from "#components/Sequencer/Knobs"

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
    <div className="rounded-sm p-4 bg-black">
      <div className="flex justify-between items-center mb-5">
        <SequencerControls />
        <SequencerKnobs />
      </div>
      <div className="relative">
        <StepButtonMap measureChunks={measureChunks} />
        <StepButtonHighlight measureChunks={measureChunks} />
      </div>
    </div>
  )
}

export default SequencerLayout
