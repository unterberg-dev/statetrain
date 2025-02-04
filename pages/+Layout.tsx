import { useEffect, type ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "#components/style.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import Header from "#layout/Header"
import Footer from "#layout/Footer"
import SequencerLayout from "#components/Sequencer"
import { usePageContext } from "vike-react/usePageContext"
import useTone from "#tone/useTone"
import useMetronome from "#tone/useMetronome"
import useSequencer from "#tone/useSequencer"
import ToneContextProvider from "#tone/ToneContextProvider"
import PianoRoll from "#components/PianoRoll"
import { ActiveStepProvider } from "#tone/ActiveStepProvider"
import LayoutComponent from "#components/common/LayoutComponent"
import KnobPanel from "#components/KnobPanel"

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { isInitialized } = useTone()
  const { activeSequencer } = useSequencer()

  return (
    <>
      <Header />
      <LayoutComponent className="mt-10 min-h-70dvh">
        {isInitialized && activeSequencer && (
          <div className="flex-col gap-4 flex">
            <KnobPanel />
            <SequencerLayout />
            <PianoRoll />
          </div>
        )}
        {children}
      </LayoutComponent>
      <Footer />
    </>
  )
}

const routesWithoutPortal = ["/tone-crashed/"]

const AppInContext = ({ children }: { children: ReactNode }) => {
  const { isInitialized, handlePlay } = useTone()
  const { handleMetronomeInit } = useMetronome()
  const context = usePageContext()

  const is404 = context.is404
  const isWithoutPortal = is404 || routesWithoutPortal.includes(context.urlParsed.href)

  useEffect(() => {
    if (isInitialized) {
      handleMetronomeInit()
      handlePlay()
    }
  }, [handlePlay, handleMetronomeInit, isInitialized])

  return isInitialized || isWithoutPortal ? <AppLayout>{children}</AppLayout> : <TonePortalContent />
}

const App = ({ children }: { children: ReactNode }) => (
  <ToneContextProvider>
    <ActiveStepProvider>
      <AppInContext>{children}</AppInContext>
    </ActiveStepProvider>
  </ToneContextProvider>
)

export default App
