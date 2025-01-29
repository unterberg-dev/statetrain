import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"

const Sequencer2 = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer2,
    sequencer2Steps,
    sequencer2Measures,
    setSequencer2Steps,
    setSequencer2Measures,
    sequencer2Volume,
    setSequencer2Volume,
  } = useSequencer()

  return (
    <SequencerLayout
      compact={compact}
      measures={sequencer2Measures}
      sequencer={sequencer2}
      setSequencerMeasures={setSequencer2Measures}
      setSequencerSteps={setSequencer2Steps}
      steps={sequencer2Steps}
      volume={sequencer2Volume}
      setVolume={setSequencer2Volume}
    />
  )
}

export default Sequencer2
