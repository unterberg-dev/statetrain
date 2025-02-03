import Skeleton from "#components/common/Skeleton"
import { useCallback, useEffect, useState } from "react"
import type { KnobProps } from "react-rotary-knob"
import { clientOnly } from "vike-react/clientOnly"

// named import of "react-rotary-knob" only works in prod mode
import knob from "react-rotary-knob"
const RotaryKnob = import.meta.env.DEV
  ? clientOnly(async () => (await import("react-rotary-knob")).Knob)
  : knob.Knob

const defaultProps = {
  unlockDistance: 40,
}

interface ExtendedKnobProps extends KnobProps {
  label: string
  width?: number
  height?: number
}

const MAX_DISTANCE = 40 // Prevents sudden jumps beyond this value

const Knob = ({ width = 52, height = 52, value, onChange, label, ...props }: ExtendedKnobProps) => {
  const [realTimeValue, setRealTimeValue] = useState(value)

  useEffect(() => {
    setRealTimeValue(value)
  }, [value])

  const handleChange = useCallback(
    (newValue: number) => {
      const clampedValue = Math.min(100, Math.max(0, newValue))
      const distance = Math.abs(clampedValue - realTimeValue)

      if (distance > MAX_DISTANCE) {
        return
      }

      // Prevent unnecessary re-renders if the value remains unchanged
      if (clampedValue !== realTimeValue) {
        setRealTimeValue(clampedValue)
        onChange(clampedValue)
      }
    },
    [onChange, realTimeValue],
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
      <span className="text-xs text-grayLight pointer-events-none select-none">{label}</span>
    </div>
  )
}

export default Knob
