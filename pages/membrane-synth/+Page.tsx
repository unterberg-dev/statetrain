import { H1Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import MembraneSynth from "#components/sequencer/MembraneSynth"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MembraneSynthPage = () => (
  <LayoutComponent className="mt-10">
    <H1Headline className="mb-5">💫 Membrane Synth</H1Headline>
    <MembraneSynth />
  </LayoutComponent>
)
export default MembraneSynthPage
