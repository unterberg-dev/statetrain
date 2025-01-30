import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Sequencer1 from "#components/sequencer/Sequencer1"

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer1Page = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Sequencer 1</H1Headline>
    <Sequencer1 />
  </LayoutComponent>
)
export default Sequencer1Page
