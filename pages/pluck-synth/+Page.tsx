/** WIP: Currently bugging synth */
import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import PluckSynthSequencer from "#components/sequencer/templates/PluckSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const PluckSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H2Headline className="mb-5">💫 Pluck Synth</H2Headline>
    <PluckSynthSequencer />
  </LayoutComponent>
)
export default PluckSynthPage
