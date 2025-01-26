import { H4Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import InlinePlayButton from "#components/InlinePlayButton"

const StartPage = () => (
  <LayoutComponent className="mt-10">
    <H4Headline className="mb-5">🏡 This is the start page layout :)</H4Headline>
    <p>
      For a side project I needed a routable typescript react application with access to a shared tone.js
      context. To test my code I build a small metronome implementation which needs kind of a communication
      layer to and from tone.js
    </p>
    <p className="mb-3">We can control tone JS from here</p>
    <InlinePlayButton className="mb-3" />
    <p>
      or after transitioning to a <LinkComponent href="/second-page/">alternative page</LinkComponent> of the
      application
    </p>
  </LayoutComponent>
)
export default StartPage
