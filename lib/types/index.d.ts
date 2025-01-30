declare module "react-rotary-knob" {
  import type { ComponentType } from "react"

  export interface KnobProps {
    min?: number
    max?: number
    value: number
    onChange: (value: number) => void
    preciseMode?: boolean
    unlockDistance?: number
    rotateDegrees?: number
    style?: React.CSSProperties
    step?: number
    className?: string
  }

  export const Knob: ComponentType<KnobProps>
}
