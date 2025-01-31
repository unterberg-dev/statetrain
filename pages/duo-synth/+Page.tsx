import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import DuoSynthSequencer from "#components/sequencer/templates/DuoSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const DuoSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H2Headline className="mb-5">💫 Duo Synth</H2Headline>
    <DuoSynthSequencer />
  </LayoutComponent>
)
export default DuoSynthPage
