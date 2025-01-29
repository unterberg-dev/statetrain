import { H2Headline, H3Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import Sequencer1 from "#components/sequencer/Sequencer1"
import Sequencer2 from "#components/sequencer/Sequencer2"
import Sequencer3 from "#components/sequencer/Sequencer3"
import Sequencer4 from "#components/sequencer/Sequencer4"
import { internalLinks } from "#lib/links"
import { List } from "lucide-react"
import rc from "react-classmate"

const Headline = rc.extend(H3Headline)`mb-4`

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer1Page = () => {
  return (
    <LayoutComponent className="mt-10">
      <H2Headline as="h1" className="mb-8 gap-3 flex items-center">
        <List size={28} /> List all Sequencers
      </H2Headline>
      <div className="flex flex-col gap-10">
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.sequencer1}>Sequencer / Synth 1</LinkComponent>
          </Headline>
          <Sequencer1 compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.sequencer2}>Sequencer / Synth 2</LinkComponent>
          </Headline>
          <Sequencer2 compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.sequencer3}>Sequencer / Synth 3</LinkComponent>
          </Headline>
          <Sequencer3 compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.sequencer4}>Sequencer / Synth 4</LinkComponent>
          </Headline>
          <Sequencer4 compact />
        </div>
      </div>
    </LayoutComponent>
  )
}
export default Sequencer1Page
