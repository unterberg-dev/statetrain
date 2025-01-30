import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import MembraneSynthSequencer from "#components/sequencer/templates/MembraneSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MetalSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Metal Synth</H1Headline>
    <MembraneSynthSequencer />
  </LayoutComponent>
)
export default MetalSynthPage
