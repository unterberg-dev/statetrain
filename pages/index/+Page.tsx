import { H2Headline, H3Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import Sequencer1 from "#components/sequencer/Sequencer1"
import Sequencer2 from "#components/sequencer/Sequencer2"
import Sequencer3 from "#components/sequencer/Sequencer3"
import Sequencer4 from "#components/sequencer/Sequencer4"
import SequencerNav from "#components/SequencerNav"
import { List } from "lucide-react"
import rc from "react-classmate"

const Headline = rc.extend(H3Headline)`mb-4`

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer1Page = () => {
  return (
    <LayoutComponent className="mt-10">
      <SequencerNav />
      <H2Headline as="h1" className="mb-8 gap-3 flex items-center">
        <List size={28} /> List all Sequencers
      </H2Headline>
      <div className="flex flex-col gap-10">
        <div>
          <Headline as="h2">Sequencer / Synth 1</Headline>
          <Sequencer1 />
        </div>
        <div>
          <Headline as="h2">Sequencer / Synth 2</Headline>
          <Sequencer2 />
        </div>
        <div>
          <Headline as="h2">Sequencer / Synth 3</Headline>
          <Sequencer3 />
        </div>
        <div>
          <Headline as="h2">Sequencer / Synth 4</Headline>
          <Sequencer4 />
        </div>
      </div>
    </LayoutComponent>
  )
}
export default Sequencer1Page
