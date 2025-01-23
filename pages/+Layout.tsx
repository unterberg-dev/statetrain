import type { ReactNode } from "react"

import "@unocss/reset/tailwind.css"
import "virtual:uno.css"

import TonePortalContent from "#components/TonePortalContent"
import ToneContextProvider, { useToneContext } from "#tone/ToneContextProvider"

const App = ({ children }: { children: ReactNode }) => {
  const { isInitialized } = useToneContext()

  return isInitialized ? children : <TonePortalContent />
}

const AppContext = ({ children }: { children: ReactNode }) => (
  <ToneContextProvider>
    <App>{children}</App>
  </ToneContextProvider>
)

export default AppContext
