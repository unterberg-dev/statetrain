import Button from "#components/common/Button"
import type { StepSequencer } from "#tone/class/StepSequencer"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import { useMemo } from "react"

interface SequencerControlsProps {
  measures: SequencerMeasuresValue
  handleMeasureSelect: (newCount: SequencerMeasuresValue) => void
}
const measureOptions = [1, 2, 3, 4] as SequencerMeasuresValue[]

const SequencerControls = ({ measures, handleMeasureSelect }: SequencerControlsProps) => {
  const measureHandlers = useMemo(() => {
    return measureOptions.map((m) => {
      return () => handleMeasureSelect(m)
    })
  }, [handleMeasureSelect])

  return (
    <div className="flex gap-2 justify-between flex-wrap my-4">
      <div className="flex items-center gap-2">
        {measureOptions.map((m, index) => (
          <Button
            key={`m-${m}`}
            color={m === measures ? "success" : "secondary"}
            onClick={measureHandlers[index]} // stable reference
          >
            {m} measure{m > 1 ? "s" : ""}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SequencerControls
