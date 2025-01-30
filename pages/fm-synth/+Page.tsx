import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import FMSynthSequencer from "#components/sequencer/templates/FmSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MetalSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 FM Synth</H1Headline>
    <FMSynthSequencer />
  </LayoutComponent>
)
export default MetalSynthPage
