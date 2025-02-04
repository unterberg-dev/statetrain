import { useCallback, useEffect, useState } from "react"
import type { KnobProps } from "react-rotary-knob"
import knob from "react-rotary-knob"
import { clientOnly } from "vike-react/clientOnly"
import rc from "react-classmate"

// Named import of "react-rotary-knob" only works in prod mode
const Knob = import.meta.env.DEV
  ? clientOnly(async () => (await import("react-rotary-knob")).Knob)
  : knob.Knob

import useThrottledCallback from "#lib/hooks/useThrottledCallback"
import Skeleton from "#components/common/Skeleton"

// override "react-rotary-knob" styles
import "#components/form/knob.css"

const StyledKnobOuter = rc.div`
  border-2
  border-primary
  rounded-full
  p-1
`

interface ExtendedKnobProps extends KnobProps {
  label: string
  width?: number
  height?: number
  displayMin?: number
  displayMax?: number
  throttleDelay?: number
}

const MAX_DISTANCE = 40

/** Maps the actual value (0–100) to the display value (displayMin–displayMax) */
const mapActualToDisplay = (actual: number, displayMin: number, displayMax: number) =>
  displayMin + (actual / 100) * (displayMax - displayMin)

/** Maps the display value (displayMin–displayMax) back to the actual value (0–100) */
const mapDisplayToActual = (display: number, displayMin: number, displayMax: number) =>
  ((display - displayMin) / (displayMax - displayMin)) * 100

const RotaryKnob = ({
  width = 52,
  height = 52,
  value,
  onChange,
  label,
  displayMin = 10,
  displayMax = 90,
  throttleDelay = 100,
  ...props
}: ExtendedKnobProps) => {
  const [realTimeValue, setRealTimeValue] = useState(value) // 0–100 !

  const defaultProps = {
    unlockDistance: width / 2 + 10,
  }

  useEffect(() => {
    setRealTimeValue(value)
  }, [value])

  // Create a throttled version of onChange using our hook.
  const throttledOnChange = useThrottledCallback((newActualValue: number) => {
    onChange(newActualValue)
  }, throttleDelay)

  const handleChange = useCallback(
    (displayValue: number) => {
      const clampedDisplayValue = Math.min(displayMax, Math.max(displayMin, displayValue))
      const newActualValue = mapDisplayToActual(clampedDisplayValue, displayMin, displayMax)

      // Prevent sudden jumps beyond the maximum allowed distance
      if (Math.abs(newActualValue - realTimeValue) > MAX_DISTANCE) {
        return
      }

      if (newActualValue !== realTimeValue) {
        setRealTimeValue(newActualValue)
        throttledOnChange(newActualValue)
      }
    },
    [realTimeValue, displayMin, displayMax, throttledOnChange],
  )

  const displayValue = mapActualToDisplay(realTimeValue, displayMin, displayMax)

  return (
    <div className="flex flex-col items-center gap-2">
      <StyledKnobOuter>
        <Knob
          step={1}
          rotateDegrees={-180}
          fallback={<Skeleton style={{ width, height }} className="rounded-full" />}
          style={{ width, height }}
          className="knob cursor-move"
          value={displayValue}
          onChange={handleChange}
          {...props}
          {...defaultProps}
        />
      </StyledKnobOuter>
      <span className="text-xs text-grayLight pointer-events-none select-none">{label}</span>
    </div>
  )
}

export default RotaryKnob
