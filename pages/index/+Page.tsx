import { Blend } from "lucide-react"

import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"

// todo: the current implementation must be oursourced to a separate file out of the page context
const StartPage = () => {
  return (
    <LayoutComponent className="mt-10">
      <H2Headline as="h1" className="gap-3 flex items-center">
        <Blend size={28} /> Mixer
      </H2Headline>
    </LayoutComponent>
  )
}
export default StartPage
