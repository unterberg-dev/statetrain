import { H2Headline } from "#components/common/Headline"
import LayoutComponent from "#components/common/LayoutComponent"
import { SequencerKey } from "#lib/constants"
import useSequencer from "#tone/useSequencer"
import { useEffect } from "react"

// todo: the current implementation must be oursourced to a separate file out of the page context
const MetalSynthPage = () => {
  const { setActiveSequencer } = useSequencer()

  useEffect(() => {
    setActiveSequencer(SequencerKey.Membrane)
  }, [setActiveSequencer])

  return (
    <LayoutComponent className="mt-10">
      <H2Headline className="mb-5">💫 Membrane Synth</H2Headline>
    </LayoutComponent>
  )
}
export default MetalSynthPage
