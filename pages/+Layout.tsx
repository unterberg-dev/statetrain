import { useEffect, type ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "#components/style.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import ToneContextProvider from "#tone/ToneContextProvider"
import useTone from "#tone/useTone"
import Header from "#layout/Header"
import useMetronome from "#tone/useMetronome"
import Footer from "#layout/Footer"
import SequencerLayout from "#components/sequencer/SequencerLayout"
import useSequencer from "#tone/useSequencer"
import { usePageContext } from "vike-react/usePageContext"

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { urlParsed } = usePageContext()

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
  const { isInitialized, handlePlay, timeSignature } = useTone()
  const { handleMetronomeInit } = useMetronome()
  const { setActiveSequencer } = useSequencer()

  useEffect(() => {
    setActiveSequencer(2)
  }, [setActiveSequencer])

  // @todo - add custom error handling here

  useEffect(() => {
    if (isInitialized) {
      handlePlay()
    }
  }, [handlePlay, isInitialized])

  useEffect(() => {
    if (timeSignature) {
      handleMetronomeInit()
    }
  }, [timeSignature, handleMetronomeInit])

  return isInitialized ? <AppLayout>{children}</AppLayout> : <TonePortalContent />
}

const AppContext = ({ children }: { children: ReactNode }) => (
  <ToneContextProvider>
    <App>{children}</App>
  </ToneContextProvider>
)

export default AppContext
