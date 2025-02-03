import { useRef, useContext, createContext } from "react"

const ActiveStepContext = createContext<React.MutableRefObject<number> | null>(null)

export function ActiveStepProvider({ children }: { children: React.ReactNode }) {
  // The ref that both highlight overlay AND piano roll will read
  const activeStepRef = useRef(0)
  return <ActiveStepContext.Provider value={activeStepRef}>{children}</ActiveStepContext.Provider>
}

export function useGlobalActiveStepRef() {
  const ctx = useContext(ActiveStepContext)
  if (!ctx) throw new Error("Missing ActiveStepProvider in tree")
  return ctx
}
