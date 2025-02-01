import { StyledNumberInput, StyledToggleButton } from "#components/form/styled"
import type { ReactNode } from "react"

interface NumberInputProps {
  onDecrease: () => void
  onIncrease: () => void
  value: number | string
  label: ReactNode
  id: string
  className?: string
}

const NumberInput = ({ onIncrease, onDecrease, value, label, id, className }: NumberInputProps) => {
  return (
    <div className={`flex items-center gap-2 text-sm items-stretch flex-1 ${className || ""}`}>
      <div className="whitespace-nowrap flex flex-col items-center justify-center">{label}</div>
      <div className="relative flex items-center max-w-24">
        <StyledToggleButton $pos="left" type="button" onClick={onDecrease} aria-label="Decrement">
          -
        </StyledToggleButton>
        <StyledNumberInput id={id} type="text" value={value} readOnly />
        <StyledToggleButton $pos="right" type="button" onClick={onIncrease} aria-label="Increment">
          +
        </StyledToggleButton>
      </div>
    </div>
  )
}

export default NumberInput
