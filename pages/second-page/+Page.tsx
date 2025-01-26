import { H4Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import InlinePlayButton from "#components/InlinePlayButton"

// todo: the current implementation must be oursourced to a separate file out of the page context
const StartPage = () => (
  <LayoutComponent className="mt-10">
    <H4Headline className="mb-5">💫 This is the alternative page layout :)</H4Headline>
    <p className="mb-3">We can now control tone.js from here</p>
    <InlinePlayButton className="mb-3" />
    <p>
      or after transitioning to the <LinkComponent href="/">start page</LinkComponent> of the app
    </p>
  </LayoutComponent>
)
export default StartPage
