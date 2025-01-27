import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import StepSequencer3Ui from "#components/sequencer/StepSequencer3Ui"
import SequencerNav from "#components/SequencerNav"

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer3Page = () => (
  <LayoutComponent className="mt-10">
    <SequencerNav />
    <H1Headline className="mb-5">💫 Sequencer 3</H1Headline>
    <StepSequencer3Ui />
  </LayoutComponent>
)
export default Sequencer3Page
