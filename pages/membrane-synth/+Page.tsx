import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import MembraneSynthSequencer from "#components/sequencer/templates/MembraneSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MetalSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H2Headline className="mb-5">💫 Membrane Synth</H2Headline>
    <MembraneSynthSequencer />
  </LayoutComponent>
)
export default MetalSynthPage
