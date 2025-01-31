import LayoutComponent from "#components/common/LayoutComponent"
import InstrumentNav from "#components/InstrumentNav"
import TransportControls from "#components/TransportControls"
import useTone from "#tone/useTone"
import { Smile } from "lucide-react"

const Header = () => {
  return (
    <>
      <TransportControls />
      <LayoutComponent className="items-center z-30 mb-10">
        <Smile size={50} className="absolute top-3 z-10" />
        <div className="mt-8">
          <InstrumentNav />
        </div>
      </LayoutComponent>
    </>
  )
}

export default Header
