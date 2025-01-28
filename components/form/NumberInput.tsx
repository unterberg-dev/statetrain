import { StyledNumberInput, StyledToggleButton } from "#components/form/styled"
import type { ReactNode } from "react"

interface NumberInputProps {
  onDecrease: () => void
  onIncrease: () => void
  value: number | string
  label: ReactNode
  id: string
}

const NumberInput = ({ onIncrease, onDecrease, value, label, id }: NumberInputProps) => {
  return (
    <div className="flex justify-between items-center gap-2 items-stretch flex-1">
      <div className="whitespace-nowrap text-sm flex flex-col items-center justify-center">{label}</div>
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
