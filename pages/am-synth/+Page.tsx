import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import AMSynthSequencer from "#components/sequencer/AMSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const AmSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 AM Synth</H1Headline>
    <AMSynthSequencer />
  </LayoutComponent>
)
export default AmSynthPage
