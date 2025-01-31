import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import AMSynthSequencer from "#components/sequencer/templates/AMSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const AmSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H2Headline className="mb-5">💫 AM Synth</H2Headline>
    <AMSynthSequencer />
  </LayoutComponent>
)
export default AmSynthPage
