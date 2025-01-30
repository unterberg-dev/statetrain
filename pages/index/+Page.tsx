import { H2Headline, H3Headline, H5Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import AMSynthSequencer from "#components/sequencer/templates/AMSynth"
import MonoSynthSequencer from "#components/sequencer/templates/MonoSynth"
import DuoSynthSequencer from "#components/sequencer/templates/DuoSynth"
import MetalSynthSequencer from "#components/sequencer/templates/MetalSynth"
import { internalLinks } from "#lib/links"
import { Blend, List } from "lucide-react"
import rc from "react-classmate"
import MembraneSynthSequencer from "#components/sequencer/templates/MembraneSynth"
import FMSynthSequencer from "#components/sequencer/templates/FmSynth"
import PluckSynthSequencer from "#components/sequencer/templates/PluckSynth"

const Headline = rc.extend(H5Headline)`mb-4 text-center`

const InstrumentOuter = rc.div`
  flex-1
`

// todo: the current implementation must be oursourced to a separate file out of the page context
const Sequencer1Page = () => {
  return (
    <LayoutComponent className="mt-10">
      <H2Headline as="h1" className="mb-8 gap-3 flex items-center">
        <Blend size={28} /> Mixer
      </H2Headline>
      <div className="flex gap-10">
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.amSynth}>AM</LinkComponent>
          </Headline>
          <AMSynthSequencer compact />
        </InstrumentOuter>
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.monoSynth}>Mono</LinkComponent>
          </Headline>
          <MonoSynthSequencer compact />
        </InstrumentOuter>
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.duoSynth}>Duo</LinkComponent>
          </Headline>
          <DuoSynthSequencer compact />
        </InstrumentOuter>
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.metalSynth}>Metal</LinkComponent>
          </Headline>
          <MetalSynthSequencer compact />
        </InstrumentOuter>
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.membraneSynth}>Membrane</LinkComponent>
          </Headline>
          <MembraneSynthSequencer compact />
        </InstrumentOuter>
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.fmSynth}>FM</LinkComponent>
          </Headline>
          <FMSynthSequencer compact />
        </InstrumentOuter>
        <InstrumentOuter>
          <Headline as="h2">
            <LinkComponent href={internalLinks.synths.pluckSynth}>Pluck</LinkComponent>
          </Headline>
          <PluckSynthSequencer compact />
        </InstrumentOuter>
      </div>
    </LayoutComponent>
  )
}
export default Sequencer1Page
