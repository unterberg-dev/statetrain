import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const PluckSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer7,
    sequencer7Steps,
    sequencer7Measures,
    setSequencer7Steps,
    setSequencer7Measures,
    setSequencer7Volume,
    sequencer7Volume,
    sequencer7ReverbMix,
    setSequencer7ReverbMix,
    sequencer7DelayMix,
    setSequencer7DelayMix,
  } = useSequencer()

  return (
    <SequencerLayout
      delay={sequencer7DelayMix}
      setDelay={setSequencer7DelayMix}
      reverb={sequencer7ReverbMix}
      setReverb={setSequencer7ReverbMix}
      compact={compact}
      measures={sequencer7Measures}
      sequencer={sequencer7}
      setSequencerMeasures={setSequencer7Measures}
      setSequencerSteps={setSequencer7Steps}
      steps={sequencer7Steps}
      volume={sequencer7Volume}
      setVolume={setSequencer7Volume}
      // navTo={internalLinks.synths.pluckSynth} <--- Uncomment this line
    />
  )
}

export default PluckSynthSequencer
