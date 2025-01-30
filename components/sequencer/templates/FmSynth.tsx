import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const FMSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer6,
    sequencer6Steps,
    sequencer6Measures,
    setSequencer6Steps,
    setSequencer6Measures,
    setSequencer6Volume,
    sequencer6Volume,
  } = useSequencer()

  return (
    <SequencerLayout
      compact={compact}
      measures={sequencer6Measures}
      sequencer={sequencer6}
      setSequencerMeasures={setSequencer6Measures}
      setSequencerSteps={setSequencer6Steps}
      steps={sequencer6Steps}
      volume={sequencer6Volume}
      setVolume={setSequencer6Volume}
      navTo={internalLinks.synths.fmSynth}
    />
  )
}

export default FMSynthSequencer
