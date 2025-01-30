import Skeleton from "#components/common/Skeleton"
import { useCallback, useState } from "react"
import type { KnobProps } from "react-rotary-knob"
import { clientOnly } from "vike-react/clientOnly"

const RotaryKnob = clientOnly(async () => (await import("react-rotary-knob")).Knob)

const defaultProps = {
  unlockDistance: 60,
}

interface ExtendedKnobProps extends KnobProps {
  label: string
  width?: number
  height?: number
}

const Knob = ({ width = 52, height = 52, value, onChange, label, ...props }: ExtendedKnobProps) => {
  const [realTimeValue, setRealTimeValue] = useState(value)

  const handleChange = useCallback(
    (newValue: number) => {
      const maxDistance = 70
      const clampedValue = Math.min(100, Math.max(0, newValue))

      const increasing = realTimeValue < maxDistance && clampedValue > maxDistance
      const decreasing = realTimeValue > maxDistance && clampedValue < maxDistance

      if ((increasing || decreasing) && Math.abs(clampedValue - realTimeValue) > maxDistance) {
        return
      }

      setRealTimeValue(clampedValue)
      onChange(clampedValue)
    },
    [realTimeValue, onChange],
  )

  return (
    <div className="flex flex-col items-center gap-2">
      <RotaryKnob
        fallback={<Skeleton style={{ width, height }} $circle />}
        style={{ width, height }}
        className="knob"
        value={realTimeValue}
        onChange={handleChange}
        {...props}
        {...defaultProps}
      />
      <span className="text-xs text-grayLight">{label}</span>
    </div>
  )
}

export default Knob
