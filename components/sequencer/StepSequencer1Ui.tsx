// StepSequencerUi.tsx
import useTone from "#tone/useTone"
import useSequencer from "#components/sequencer/useSequencer"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import ToneManager from "#tone/ToneManager"
import SequencerControls from "#components/sequencer/SequencerControls"

function StepSequencer1Ui() {
  const { sequencer1Steps, sequencer1Measures, setSequencer1Steps, setSequencer1Measures } = useTone()

  const { setActiveStep, activeStep } = useSequencer({
    measures: sequencer1Measures,
    setSequencerSteps: setSequencer1Steps,
  })

  const sequencer = ToneManager.getSequencer1()

  return (
    <>
      <SequencerControls
        measures={sequencer1Measures}
        setSequencerMeasures={setSequencer1Measures}
        setSequencerSteps={setSequencer1Steps}
        setActiveStep={setActiveStep}
        sequencer={sequencer}
      />
      <StepButtonMap
        sequencer={sequencer}
        setSequencerSteps={setSequencer1Steps}
        activeStep={activeStep}
        steps={sequencer1Steps}
      />
    </>
  )
}

export default StepSequencer1Ui
