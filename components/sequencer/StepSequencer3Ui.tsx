// StepSequencerUi.tsx
import useTone from "#tone/useTone"
import useSequencer from "#components/sequencer/useSequencer"
import StepButtonMap from "#components/sequencer/StepButtonMap"
import ToneManager from "#tone/ToneManager"
import SequencerControls from "#components/sequencer/SequencerControls"

function StepSequencer1Ui() {
  const { sequencer3Steps, sequencer3Measures, setSequencer3Steps, setSequencer3Measures } = useTone()

  const { setActiveStep, activeStep } = useSequencer({
    measures: sequencer3Measures,
    setSequencerSteps: setSequencer3Steps,
  })

  const sequencer = ToneManager.getSequencer3()

  return (
    <>
      <SequencerControls
        measures={sequencer3Measures}
        setSequencerMeasures={setSequencer3Measures}
        setSequencerSteps={setSequencer3Steps}
        setActiveStep={setActiveStep}
        sequencer={sequencer}
      />
      <StepButtonMap
        sequencer={sequencer}
        setSequencerSteps={setSequencer3Steps}
        activeStep={activeStep}
        steps={sequencer3Steps}
      />
    </>
  )
}

export default StepSequencer1Ui
