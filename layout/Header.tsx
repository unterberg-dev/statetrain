import LayoutComponent from "#components/common/LayoutComponent"
import InstrumentNav from "#components/InstrumentNav"
import TransportControls from "#components/TransportControls"
import { Smile } from "lucide-react"

const Header = () => {
  return (
    <>
      <LayoutComponent className="items-center z-30 mb-10">
        <div className="flex justify-between w-full items-center">
          <Smile size={50} />
          <TransportControls />
        </div>
        <div className="mt-8">
          <InstrumentNav />
        </div>
      </LayoutComponent>
    </>
  )
}

export default Header
