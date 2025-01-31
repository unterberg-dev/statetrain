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
    sequencer3ReverbMix,
    setSequencer3ReverbMix,
    sequencer3DelayMix,
    setSequencer3DelayMix,
  } = useSequencer()

  return (
    <SequencerLayout
      delay={sequencer3DelayMix}
      setDelay={setSequencer3DelayMix}
      reverb={sequencer3ReverbMix}
      setReverb={setSequencer3ReverbMix}
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
