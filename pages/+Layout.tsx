import type { ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import ToneContextProvider from "#tone/ToneContextProvider"
import useTone from "#tone/useTone"

const App = ({ children }: { children: ReactNode }) => {
  const { isInitialized } = useTone()

  return isInitialized ? children : <TonePortalContent />
}

const AppContext = ({ children }: { children: ReactNode }) => (
  <ToneContextProvider>
    <App>{children}</App>
  </ToneContextProvider>
)

export default AppContext
