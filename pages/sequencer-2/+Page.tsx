import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Sequencer2 from "#components/sequencer/Sequencer2"
import SequencerNav from "#components/SequencerNav"

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer1Page = () => (
  <LayoutComponent className="mt-10">
    <SequencerNav />
    <H1Headline className="mb-5">💫 Sequencer 2</H1Headline>
    <Sequencer2 />
  </LayoutComponent>
)
export default Sequencer1Page
