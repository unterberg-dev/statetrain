import { useEffect, type ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "#components/style.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import ToneContextProvider from "#tone/ToneContextProvider"
import Header from "#layout/Header"
import Footer from "#layout/Footer"
import SequencerLayout from "#components/sequencer/SequencerLayout"
import { usePageContext } from "vike-react/usePageContext"
import useTone from "#tone/useTone"
import useMetronome from "#tone/useMetronome"

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
