import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Sequencer4 from "#components/sequencer/Sequencer4"
import SequencerNav from "#components/SequencerNav"

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer4Page = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Sequencer 4</H1Headline>
    <Sequencer4 />
  </LayoutComponent>
)
export default Sequencer4Page
