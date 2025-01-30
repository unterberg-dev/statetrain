import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import MetalSynthSequencer from "#components/sequencer/templates/MetalSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MetalSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Metal Synth</H1Headline>
    <MetalSynthSequencer />
  </LayoutComponent>
)
export default MetalSynthPage
