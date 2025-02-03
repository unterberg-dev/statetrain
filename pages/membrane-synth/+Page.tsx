import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MetalSynthPage = () => {
  return (
    <LayoutComponent className="mt-10">
      <H2Headline className="mb-5">💫 Membrane Synth</H2Headline>
    </LayoutComponent>
  )
}
export default MetalSynthPage
