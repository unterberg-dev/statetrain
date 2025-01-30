import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const MonoSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
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
      navTo={internalLinks.synths.monoSynth}
    />
  )
}

export default MonoSynthSequencer
