import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Sequencer1 from "#components/sequencer/Sequencer1"
import Sequencer2 from "#components/sequencer/Sequencer2"
import Sequencer3 from "#components/sequencer/Sequencer3"
import Sequencer4 from "#components/sequencer/Sequencer4"
import SequencerNav from "#components/SequencerNav"

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer1Page = () => {
  return (
    <LayoutComponent className="mt-10">
      <SequencerNav />
      <H1Headline className="mb-5">💫 All Sequencers</H1Headline>
      <div className="flex flex-col gap-10">
        <Sequencer1 />
        <Sequencer2 />
        <Sequencer3 />
        <Sequencer4 />
      </div>
    </LayoutComponent>
  )
}
export default Sequencer1Page
