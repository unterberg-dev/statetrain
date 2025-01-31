import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import FMSynthSequencer from "#components/sequencer/templates/FmSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const FMSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H2Headline className="mb-5">💫 FM Synth</H2Headline>
    <FMSynthSequencer />
  </LayoutComponent>
)
export default FMSynthPage
