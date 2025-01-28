// StepSequencerUi.tsx
import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"

function Sequencer4() {
  const { sequencer4, sequencer4Steps, sequencer4Measures, setSequencer4Steps, setSequencer4Measures } =
    useSequencer()

  return (
    <SequencerLayout
      measures={sequencer4Measures}
      sequencer={sequencer4}
      setSequencerMeasures={setSequencer4Measures}
      setSequencerSteps={setSequencer4Steps}
      steps={sequencer4Steps}
    />
  )
}

export default Sequencer4
