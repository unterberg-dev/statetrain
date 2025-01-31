import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import MonoSynthSequencer from "#components/sequencer/templates/MonoSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MonoSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H2Headline className="mb-5">💫 Mono Synth</H2Headline>
    <MonoSynthSequencer />
  </LayoutComponent>
)
export default MonoSynthPage
