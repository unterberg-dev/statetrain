import { useEffect, type ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import ToneContextProvider from "#tone/ToneContextProvider"
import useTone from "#tone/useTone"
import Header from "#layout/Header"
import { usePageContext } from "vike-react/usePageContext"
import useMetronome from "#tone/useMetronome"

const AppLayout = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    {children}
    {/* <Footer /> */}
  </>
)

const App = ({ children }: { children: ReactNode }) => {
  const { isInitialized, handlePlay, isPlaying } = useTone()
  const { handleMetronomeInit } = useMetronome()

  const { ...context } = usePageContext()

  // if (context.abortReason) {
  //   return <AppLayout>{context.abortReason}</AppLayout>
  // }

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
