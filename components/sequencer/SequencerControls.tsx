import NumberInput from "#components/form/NumberInput"
import { TRANSPORT_CONFIG } from "#lib/config"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import { useCallback } from "react"

interface SequencerControlsProps {
  measures: SequencerMeasuresValue
  handleMeasureSelect: (newCount: SequencerMeasuresValue) => void
}
const maxMeasures = TRANSPORT_CONFIG.loopLength.default

const SequencerControls = ({ measures, handleMeasureSelect }: SequencerControlsProps) => {
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
