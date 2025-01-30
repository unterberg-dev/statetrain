import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import PluckSynthSequencer from "#components/sequencer/templates/PluckSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MonoSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Pluck Synth</H1Headline>
    <PluckSynthSequencer />
  </LayoutComponent>
)
export default MonoSynthPage
