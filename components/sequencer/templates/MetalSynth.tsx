// StepSequencerUi.tsx
import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const MetalSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer4,
    sequencer4Steps,
    sequencer4Measures,
    setSequencer4Steps,
    setSequencer4Measures,
    sequencer4Volume,
    setSequencer4Volume,
    sequencer4ReverbMix,
    setSequencer4ReverbMix,
    sequencer4DelayMix,
    setSequencer4DelayMix,
  } = useSequencer()

  return (
    <SequencerLayout
      delay={sequencer4DelayMix}
      setDelay={setSequencer4DelayMix}
      reverb={sequencer4ReverbMix}
      setReverb={setSequencer4ReverbMix}
      compact={compact}
      measures={sequencer4Measures}
      sequencer={sequencer4}
      setSequencerMeasures={setSequencer4Measures}
      setSequencerSteps={setSequencer4Steps}
      steps={sequencer4Steps}
      volume={sequencer4Volume}
      setVolume={setSequencer4Volume}
      navTo={internalLinks.synths.metalSynth}
    />
  )
}

export default MetalSynthSequencer
