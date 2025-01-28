// StepSequencerUi.tsx
import ToneManager from "#tone/class/ToneManager"
import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"

function Sequencer3() {
  const { sequencer3, sequencer3Steps, sequencer3Measures, setSequencer3Steps, setSequencer3Measures } =
    useSequencer()

  return (
    <SequencerLayout
      measures={sequencer3Measures}
      sequencer={sequencer3}
      setSequencerMeasures={setSequencer3Measures}
      setSequencerSteps={setSequencer3Steps}
      steps={sequencer3Steps}
    />
  )
}

export default Sequencer3
