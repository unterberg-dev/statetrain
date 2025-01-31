import SequencerLayout from "#components/sequencer/SequencerLayout"
import { internalLinks } from "#lib/links"
import useSequencer from "#tone/useSequencer"

const AMSynthSequencer = ({ compact = false }: { compact?: boolean }) => {
  const {
    sequencer1,
    sequencer1Steps,
    sequencer1Measures,
    setSequencer1Steps,
    setSequencer1Measures,
    setSequencer1Volume,
    sequencer1Volume,
    sequencer1ReverbMix,
    setSequencer1ReverbMix,
    sequencer1DelayMix,
    setSequencer1DelayMix,
  } = useSequencer()

  return (
    <SequencerLayout
      delay={sequencer1DelayMix}
      setDelay={setSequencer1DelayMix}
      reverb={sequencer1ReverbMix}
      setReverb={setSequencer1ReverbMix}
      compact={compact}
      measures={sequencer1Measures}
      sequencer={sequencer1}
      setSequencerMeasures={setSequencer1Measures}
      setSequencerSteps={setSequencer1Steps}
      steps={sequencer1Steps}
      volume={sequencer1Volume}
      setVolume={setSequencer1Volume}
      navTo={internalLinks.synths.amSynth}
    />
  )
}

export default AMSynthSequencer
