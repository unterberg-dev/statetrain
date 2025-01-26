import { H4Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import InlinePlayButton from "#components/InlinePlayButton"
import { StepSequencerUI } from "#components/StepSequencerUi"

// todo: the current implementation must be oursourced to a separate file out of the page context
const StartPage = () => (
  <LayoutComponent className="mt-10">
    <H4Headline className="mb-5">💫 This is the alternative page layout :)</H4Headline>
    <p className="mb-3">We can now control tone.js from here</p>
    <InlinePlayButton className="mb-3" />
    <StepSequencerUI />
  </LayoutComponent>
)
export default StartPage
