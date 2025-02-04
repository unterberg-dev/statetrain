import SequencerControls from "#components/Sequencer/SequencerControls"
import StepButtonMap from "#components/Sequencer/StepButtonMap"
import { chunkArray } from "#components/Sequencer/utils"
import useTone from "#tone/useTone"
import { useMemo } from "react"
import useSequencer from "#tone/useSequencer"
import StepButtonHighlight from "#components/Sequencer/StepButtonHighlight"
import SequencerKnobs from "#components/Sequencer/Knobs"
import ElementContainer from "#components/common/ElementContainer"

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
    <ElementContainer>
      <div className="flex justify-between items-center mb-5">
        <SequencerControls />
        <SequencerKnobs />
      </div>
      <div className="relative">
        <StepButtonMap measureChunks={measureChunks} />
        <StepButtonHighlight measureChunks={measureChunks} />
      </div>
    </ElementContainer>
  )
}

export default SequencerLayout
