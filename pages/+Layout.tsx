import { useEffect, useRef, type ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "#components/style.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import ToneContextProvider from "#tone/ToneContextProvider"
import Header from "#layout/Header"
import Footer from "#layout/Footer"
import SequencerLayout from "#components/Sequencer"
import { usePageContext } from "vike-react/usePageContext"
import useTone from "#tone/useTone"
import useMetronome from "#tone/useMetronome"
import useSequencer from "#tone/useSequencer"
import { SequencerKey } from "#lib/constants"
import { internalLinks } from "#lib/links"

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { urlParsed } = usePageContext()
  const { setActiveSequencer } = useSequencer()

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
        setActiveSequencer(SequencerKey.Mono)
        break
    }
  }, [urlParsed.pathnameOriginal, setActiveSequencer])

  const isStartPage = urlParsed.href === "/"
  return (
    <>
      <Header />
      {children}
      {!isStartPage && <SequencerLayout />}
      <Footer />
    </>
  )
}

const App = ({ children }: { children: ReactNode }) => {
  const { isInitialized, handlePlay } = useTone()
  const { handleMetronomeInit } = useMetronome()

  useEffect(() => {
    if (isInitialized) {
      handleMetronomeInit()
      handlePlay()
    }
  }, [handlePlay, handleMetronomeInit, isInitialized])

  return isInitialized ? <AppLayout>{children}</AppLayout> : <TonePortalContent />
}

const AppContext = ({ children }: { children: ReactNode }) => (
  <ToneContextProvider>
    <App>{children}</App>
  </ToneContextProvider>
)

export default AppContext
