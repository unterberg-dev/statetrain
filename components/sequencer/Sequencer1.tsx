import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"

function Sequencer1() {
  const {
    sequencer1,
    sequencer1Steps,
    sequencer1Measures,
    setSequencer1Steps,
    setSequencer1Measures,
    setSequencer1Volume,
    sequencer1Volume,
  } = useSequencer()

  return (
    <SequencerLayout
      measures={sequencer1Measures}
      sequencer={sequencer1}
      setSequencerMeasures={setSequencer1Measures}
      setSequencerSteps={setSequencer1Steps}
      steps={sequencer1Steps}
      volume={sequencer1Volume}
      setVolume={setSequencer1Volume}
    />
  )
}

export default Sequencer1
