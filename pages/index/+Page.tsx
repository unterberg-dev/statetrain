import { Blend } from "lucide-react"

import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import useSequencer from "#tone/useSequencer"
import { useEffect } from "react"

// todo: the current implementation must be oursourced to a separate file out of the page context
const StartPage = () => {
  const { setActiveSequencer } = useSequencer()

  useEffect(() => {
    setActiveSequencer(undefined)
  }, [setActiveSequencer])

  return (
    <LayoutComponent className="mt-10">
      <H2Headline as="h1" className="gap-3 flex items-center">
        <Blend size={28} /> Mixer
      </H2Headline>
    </LayoutComponent>
  )
}
export default StartPage
