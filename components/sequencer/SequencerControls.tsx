import NumberInput from "#components/form/NumberInput"
import { TRANSPORT_CONFIG } from "#lib/config"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import { useCallback, useEffect } from "react"

const maxMeasures = TRANSPORT_CONFIG.loopLength.default

const SequencerControls = () => {
  const { timeSignature } = useTone()
  const {
    currentSequencer: { measures, sequencer, setMeasures: setSequencerMeasures, setSteps: setSequencerSteps },
  } = useSequencer()

  const handleMeasureSelect = useCallback(
    async (newCount: SequencerMeasuresValue) => {
      if (!sequencer) return

      // Update measures in Tone.js
      setSequencerMeasures(newCount)
      const newSteps = sequencer.setMeasureCount(newCount)

      setSequencerSteps(newSteps)
    },
    [setSequencerSteps, setSequencerMeasures, sequencer],
  )

  // @todo: potential bad side effect
  // we need this to update the sequencer when the timeSignature change
  useEffect(() => {
    if (!sequencer || !timeSignature) return
    handleMeasureSelect(measures)
  }, [sequencer, timeSignature, measures, handleMeasureSelect])

  const handleDecreaseMeasures = useCallback(() => {
    if (measures > 1) {
      handleMeasureSelect((measures - 1) as SequencerMeasuresValue)
    }
  }, [handleMeasureSelect, measures])

  const handleIncreaseMeasures = useCallback(() => {
    if (measures < maxMeasures) handleMeasureSelect((measures + 1) as SequencerMeasuresValue)
  }, [handleMeasureSelect, measures])

  return (
    <div className="w-60">
      <NumberInput
        label="Measures"
        id="measures"
        onDecrease={handleDecreaseMeasures}
        onIncrease={handleIncreaseMeasures}
        value={measures}
      />
    </div>
  )
}

export default SequencerControls
