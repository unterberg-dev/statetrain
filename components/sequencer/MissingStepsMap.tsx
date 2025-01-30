import { SequencerButton, StepRow } from "#components/sequencer/styled"
import { chunkArray, getUniqueStepId } from "#components/sequencer/utils"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"

interface MissingStepButtonMapProps {
  steps: Steps
  measureSize: number
  compact?: boolean
  totalLength: number
}

const MissingStepButtonMap = ({ steps, measureSize, totalLength, compact }: MissingStepButtonMapProps) => {
  const { timeSignature, loopLength } = useTone()
  const totalMissingSteps = timeSignature * loopLength * 4 - steps.length
  if (totalMissingSteps <= 0) return null

  const missingStepObjects = Array.from({ length: totalMissingSteps }, (_, i) => ({
    originalIndex: steps.length + i, // Just for unique key purposes
  }))

  const missingStepChunks = chunkArray(missingStepObjects, measureSize)

  return missingStepChunks.map((missingSteps, missingMeasureIndex) => (
    <StepRow key={getUniqueStepId(totalLength + missingMeasureIndex, 0)} $compact={compact}>
      {missingSteps.map((_, localIndex) => (
        <div className="relative flex-1" key={getUniqueStepId(totalLength + missingMeasureIndex, localIndex)}>
          <SequencerButton $state="locked" $compact={compact} disabled />
        </div>
      ))}
    </StepRow>
  ))
}

export default MissingStepButtonMap
