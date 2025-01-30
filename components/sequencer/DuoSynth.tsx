// StepSequencerUi.tsx
import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const DuoSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer3,
    sequencer3Steps,
    sequencer3Measures,
    setSequencer3Steps,
    setSequencer3Measures,
    sequencer3Volume,
    setSequencer3Volume,
  } = useSequencer()

  return (
    <SequencerLayout
      compact={compact}
      measures={sequencer3Measures}
      sequencer={sequencer3}
      setSequencerMeasures={setSequencer3Measures}
      setSequencerSteps={setSequencer3Steps}
      steps={sequencer3Steps}
      volume={sequencer3Volume}
      setVolume={setSequencer3Volume}
      navTo={internalLinks.synths.duoSynth}
    />
  )
}

export default DuoSynthSequencer
