import { createContext } from "react"

export interface ToneContextType {
  isInitialized: boolean
  initTone: () => void
}

export const ToneContext = createContext<ToneContextType | undefined>(undefined)
