import { getPercent } from "#utils/index"
import { useCallback, useEffect, useRef, useState } from "react"
import rc from "react-classmate"

const StyledSlider = rc.div`
  slider
  relative
  w-[200px]
`

const StyledSliderTrack = rc.div`
  slider__track
  absolute
  rounded-sm
  cursor-pointer
  w-full
  h-[7px]
  bg-grayDark
  hover:bg-gray:50
`

const StyledSliderRange = rc.div`
  slider__range
  absolute
  rounded-sm
  cursor-pointer
  h-[7px]
  bg-primary
  hover:bg-primaryLight/70
`

const StyledThumb = rc.input`
  thumb
  thumb::-webkit-slider-thumb
  -webkit-appearance: none;
  pointer-events: none;
  position: absolute;
  height: 0;
  width: auto;
  outline: none;
`

interface RangeSliderProps {
  initialValue?: number | [number, number] // must be between 1 and 100 (%)
  onChange: (value: number, type?: "min" | "max") => void
  step?: number
  multi?: boolean
}

// this is fixed - we convert always to input percent ( 0 - 100 )
// initialValue.value must be always 1 - 100
const sliderPercentRange = {
  min: 0,
  max: 100,
}
const RangeSlider = ({ multi, step = 1, onChange, initialValue }: RangeSliderProps) => {
  const { min, max } = sliderPercentRange
  const rangeRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Controlled values from props
  const controlledMinVal = multi ? (initialValue as [number, number])[0] : (initialValue as number)
  const controlledMaxVal = multi ? (initialValue as [number, number])[1] : max

  const changeSingleStyle = useCallback(
    (singleVal: number) => {
      const percent = getPercent(singleVal, min, max)
      if (rangeRef.current) {
        rangeRef.current.style.left = "0%"
        rangeRef.current.style.width = `${percent}%`
      }
    },
    [max, min],
  )

  const changeMultiStyle = useCallback(
    (minValue: number, maxValue: number) => {
      const minPercent = getPercent(minValue, min, max)
      const maxPercent = getPercent(maxValue, min, max)
      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`
        rangeRef.current.style.width = `${maxPercent - minPercent}%`
      }
    },
    [max, min],
  )

  useEffect(() => {
    if (multi) {
      changeMultiStyle(controlledMinVal, controlledMaxVal)
    } else {
      changeSingleStyle(controlledMinVal)
    }
  }, [multi, controlledMinVal, controlledMaxVal, changeMultiStyle, changeSingleStyle])

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const clickPosition = event.clientX - rect.left
    const clickValue = Math.round((clickPosition / rect.width) * (max - min) + min)

    if (multi) {
      const minDiff = Math.abs(clickValue - controlledMinVal)
      const maxDiff = Math.abs(clickValue - controlledMaxVal)
      onChange(clickValue, minDiff < maxDiff ? "min" : "max")
    } else {
      onChange(clickValue)
    }
  }

  return (
    <div className="py-3">
      {multi ? (
        <>
          <StyledThumb
            type="range"
            min={min}
            max={max}
            step={step}
            value={controlledMinVal}
            onChange={(event) => onChange(Number(event.target.value), "min")}
            className="thumb thumb--left z-3"
          />
          <StyledThumb
            type="range"
            min={min}
            max={max}
            step={step}
            value={controlledMaxVal}
            onChange={(event) => onChange(Number(event.target.value), "max")}
            className="thumb thumb--right z-4"
          />
        </>
      ) : (
        <StyledThumb
          type="range"
          min={min}
          max={max}
          step={step}
          value={controlledMinVal}
          onChange={(event) => onChange(Number(event.target.value))}
          className="thumb thumb--single z-4"
        />
      )}
      <StyledSlider ref={sliderRef} onClick={handleTrackClick}>
        <StyledSliderTrack />
        <StyledSliderRange ref={rangeRef} />
      </StyledSlider>
    </div>
  )
}

export default RangeSlider
