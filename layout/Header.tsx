import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import SequencerNav from "#components/SequencerNav"
import TransportControls from "#components/TransportControls"
import { internalLinks } from "#lib/links"
import useTone from "#tone/useTone"
import { Smile } from "lucide-react"

const Header = () => {
  const { isPlaying } = useTone()

  return (
    <>
      <TransportControls />
      <LayoutComponent className="flex justify-between items-center z-30 mb-10">
        <Smile size={50} className={`${isPlaying ? "animate-spin" : "animate-pulse"} absolute top-3 z-10`} />
        <div className="mt-8">
          <SequencerNav />
        </div>
      </LayoutComponent>
    </>
  )
}

export default Header
