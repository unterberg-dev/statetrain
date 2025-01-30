import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const MembraneSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer5,
    sequencer5Steps,
    sequencer5Measures,
    setSequencer5Steps,
    setSequencer5Measures,
    setSequencer5Volume,
    sequencer5Volume,
  } = useSequencer()

  return (
    <SequencerLayout
      compact={compact}
      measures={sequencer5Measures}
      sequencer={sequencer5}
      setSequencerMeasures={setSequencer5Measures}
      setSequencerSteps={setSequencer5Steps}
      steps={sequencer5Steps}
      volume={sequencer5Volume}
      setVolume={setSequencer5Volume}
      navTo={internalLinks.synths.membraneSynth}
    />
  )
}

export default MembraneSynthSequencer
