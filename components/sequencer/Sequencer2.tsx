import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"

function Sequencer2() {
  const { sequencer2, sequencer2Steps, sequencer2Measures, setSequencer2Steps, setSequencer2Measures } =
    useSequencer()

  return (
    <SequencerLayout
      measures={sequencer2Measures}
      sequencer={sequencer2}
      setSequencerMeasures={setSequencer2Measures}
      setSequencerSteps={setSequencer2Steps}
      steps={sequencer2Steps}
    />
  )
}

export default Sequencer2
