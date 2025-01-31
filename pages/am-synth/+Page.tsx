import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import useSequencer, { Sequencer } from "#tone/useSequencer"
import { useEffect } from "react"

// todo: the current implementation must be oursourced to a separate file out of the page context
const AmSynthPage = () => {
  const { setActiveSequencer } = useSequencer()

  useEffect(() => {
    setActiveSequencer(Sequencer.AM)
  }, [setActiveSequencer])

  return (
    <LayoutComponent className="mt-10">
      <H2Headline className="mb-5">💫 AM Synth</H2Headline>
    </LayoutComponent>
  )
}
export default AmSynthPage
