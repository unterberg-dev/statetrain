import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Sequencer3 from "#components/sequencer/Sequencer3"
import SequencerNav from "#components/SequencerNav"

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer3Page = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Sequencer 3</H1Headline>
    <Sequencer3 />
  </LayoutComponent>
)
export default Sequencer3Page
