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
import { SequencerKey } from "#lib/constants"
import { internalLinks } from "#lib/links"
import ToneContextProvider from "#tone/ToneContextProvider"
import PianoRoll from "#components/PianoRoll"
import { ActiveStepProvider } from "#tone/ActiveStepProvider"
import LayoutComponent from "#components/common/LayoutComponent"

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { urlParsed } = usePageContext()
  const { setActiveSequencer, activeSequencer } = useSequencer()

  useEffect(() => {
    switch (urlParsed.pathnameOriginal) {
      case internalLinks.synths.amSynth.url:
        setActiveSequencer(SequencerKey.AM)
        break
      case internalLinks.synths.duoSynth.url:
        setActiveSequencer(SequencerKey.Duo)
        break
      case internalLinks.synths.fmSynth.url:
        setActiveSequencer(SequencerKey.FM)
        break
      case internalLinks.synths.membraneSynth.url:
        setActiveSequencer(SequencerKey.Membrane)
        break
      case internalLinks.synths.metalSynth.url:
        setActiveSequencer(SequencerKey.Metal)
        break
      case internalLinks.synths.monoSynth.url:
        setActiveSequencer(SequencerKey.Mono)
        break
      default:
        setActiveSequencer(undefined)
        break
    }
  }, [urlParsed.pathnameOriginal, setActiveSequencer])

  const isStartPage = urlParsed.href === "/"

  return (
    <>
      <Header />
      <LayoutComponent className="mt-10 min-h-70dvh">
        {!isStartPage && activeSequencer && <SequencerLayout />}
        {!isStartPage && activeSequencer && <PianoRoll />}
        {children}
      </LayoutComponent>
      <Footer />
    </>
  )
}

const routesWithoutPortal = ["/tone-crashed/"]

const App = ({ children }: { children: ReactNode }) => {
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

const AppContext = ({ children }: { children: ReactNode }) => (
  <ToneContextProvider>
    <ActiveStepProvider>
      <App>{children}</App>
    </ActiveStepProvider>
  </ToneContextProvider>
)

export default AppContext
