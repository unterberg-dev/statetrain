// StepSequencerUi.tsx
import useTone from "#tone/useTone"
import useSequencer from "#components/sequencer/useSequencer"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import ToneManager from "#tone/ToneManager"
import SequencerControls from "#components/sequencer/SequencerControls"

function StepSequencer2Ui() {
  const { sequencer2Steps, sequencer2Measures, setSequencer2Steps, setSequencer2Measures } = useTone()

  const { setActiveStep, activeStep } = useSequencer({
    measures: sequencer2Measures,
    setSequencerSteps: setSequencer2Steps,
  })

  const sequencer = ToneManager.getSequencer2()

  return (
    <>
      <SequencerControls
        measures={sequencer2Measures}
        setSequencerMeasures={setSequencer2Measures}
        setSequencerSteps={setSequencer2Steps}
        setActiveStep={setActiveStep}
        sequencer={sequencer}
      />
      <StepButtonMap
        sequencer={sequencer}
        setSequencerSteps={setSequencer2Steps}
        activeStep={activeStep}
        steps={sequencer2Steps}
      />
    </>
  )
}

export default StepSequencer2Ui
