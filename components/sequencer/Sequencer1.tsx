import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"

function Sequencer1() {
  const { sequencer1, sequencer1Steps, sequencer1Measures, setSequencer1Steps, setSequencer1Measures } =
    useSequencer()

  return (
    <SequencerLayout
      measures={sequencer1Measures}
      sequencer={sequencer1}
      setSequencerMeasures={setSequencer1Measures}
      setSequencerSteps={setSequencer1Steps}
      steps={sequencer1Steps}
    />
  )
}

export default Sequencer1
