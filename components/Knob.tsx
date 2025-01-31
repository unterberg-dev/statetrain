import Skeleton from "#components/common/Skeleton"
import { useCallback, useEffect, useState } from "react"
import type { KnobProps } from "react-rotary-knob"
import { clientOnly } from "vike-react/clientOnly"
import knob from "react-rotary-knob"

const RotaryKnob = import.meta.env.DEV
  ? clientOnly(async () => (await import("react-rotary-knob")).Knob)
  : knob.Knob

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

  // Ensure the local state updates when the external value changes
  useEffect(() => {
    setRealTimeValue(value)
  }, [value])

  const handleChange = useCallback(
    (newValue: number) => {
      // Constrain the value within the range
      const clampedValue = Math.min(100, Math.max(0, newValue))

      setRealTimeValue(clampedValue) // Update local state
      onChange(clampedValue) // Call external handler
    },
    [onChange],
  )

  return (
    <div className="flex flex-col items-center gap-2">
      <RotaryKnob
        rotateDegrees={-180}
        fallback={<Skeleton style={{ width, height }} />}
        style={{ width, height }}
        className="knob cursor-move"
        value={realTimeValue} // Ensure it's synced
        onChange={handleChange}
        {...props}
        {...defaultProps}
      />
      <span className="text-xs text-grayLight">{label}</span>
    </div>
  )
}

export default Knob
