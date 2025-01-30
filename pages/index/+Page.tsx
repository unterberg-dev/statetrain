import { H2Headline, H3Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import AMSynthSequencer from "#components/sequencer/templates/AMSynth"
import MonoSynthSequencer from "#components/sequencer/templates/MonoSynth"
import DuoSynthSequencer from "#components/sequencer/templates/DuoSynth"
import MetalSynthSequencer from "#components/sequencer/templates/MetalSynth"
import { internalLinks } from "#lib/links"
import { List } from "lucide-react"
import rc from "react-classmate"
import MembraneSynthSequencer from "#components/sequencer/templates/MembraneSynth"
import FMSynthSequencer from "#components/sequencer/templates/FmSynth"

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
            <LinkComponent href={internalLinks.synths.amSynth}>AM Synth</LinkComponent>
          </Headline>
          <AMSynthSequencer compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.monoSynth}>Mono Synth</LinkComponent>
          </Headline>
          <MonoSynthSequencer compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.duoSynth}>Duo Synth</LinkComponent>
          </Headline>
          <DuoSynthSequencer compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.metalSynth}>Metal Synth</LinkComponent>
          </Headline>
          <MetalSynthSequencer compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.membraneSynth}>Membrane Synth</LinkComponent>
          </Headline>
          <MembraneSynthSequencer compact />
        </div>
        <div>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.fmSynth}>FM Synth</LinkComponent>
          </Headline>
          <FMSynthSequencer compact />
        </div>
      </div>
    </LayoutComponent>
  )
}
export default Sequencer1Page
