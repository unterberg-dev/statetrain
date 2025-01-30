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
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const [singleValue, setSingleValue] = useState((min + max) / 2)
  const [isTouched, setIsTouched] = useState(false)
  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const rangeRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

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

  const handleChangeSingleType = useCallback(
    (value: number) => {
      if (!isTouched) {
        setIsTouched(true)
      }
      const roundedValue = Math.max(Number(value), minVal + 1)
      onChange(roundedValue)
      setSingleValue(roundedValue)
      changeSingleStyle(roundedValue)
    },
    [changeSingleStyle, isTouched, minVal, onChange],
  )

  const handleChangeMultiType = useCallback(
    (value: number, type: "min" | "max") => {
      if (!isTouched) {
        setIsTouched(true)
      }

      const offsetPercent = 5

      if (type === "min") {
        if (value >= maxValRef.current - offsetPercent) return
        setMinVal(Math.min(value, maxValRef.current - 1))
        onChange(value, "min")
        changeMultiStyle(value, maxValRef.current)
        minValRef.current = value
      } else {
        if (value <= minValRef.current + offsetPercent) return
        setMaxVal(Math.max(value, minValRef.current + 1))
        onChange(value, "max")
        changeMultiStyle(minValRef.current, value)
        maxValRef.current = value
      }
    },
    [changeMultiStyle, isTouched, onChange],
  )

  useEffect(() => {
    if (multi) {
      changeMultiStyle(minVal, maxVal)

      if (initialValue && !isTouched) {
        const [initMinVal, initMaxVal] = initialValue as [number, number]

        setMinVal(initMinVal)
        setMaxVal(initMaxVal)
        minValRef.current = initMinVal
        maxValRef.current = initMaxVal
      }
    } else {
      changeSingleStyle(singleValue)

      if (initialValue && !isTouched) {
        const initSingleValue = initialValue as number

        // calculation here
        setSingleValue(initSingleValue)
      }
    }
  }, [changeMultiStyle, changeSingleStyle, initialValue, isTouched, maxVal, minVal, multi, singleValue])

  const thumbDefaultProps = {
    type: "range",
    min,
    max,
    step,
  }

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const clickPosition = event.clientX - rect.left
    const clickValue = Math.round((clickPosition / rect.width) * (max - min) + min)

    if (multi) {
      const minDiff = Math.abs(clickValue - minVal)
      const maxDiff = Math.abs(clickValue - maxVal)

      if (minDiff < maxDiff) {
        handleChangeMultiType(clickValue, "min")
      } else {
        handleChangeMultiType(clickValue, "max")
      }
    } else {
      handleChangeSingleType(clickValue)
    }
  }

  return (
    <div className="py-3">
      {multi ? (
        <>
          <StyledThumb
            value={minVal}
            onChange={(event) => handleChangeMultiType(Number(event.target.value), "min")}
            className="thumb thumb--left z-3"
            {...thumbDefaultProps}
          />
          <StyledThumb
            value={maxVal}
            onChange={(event) => handleChangeMultiType(Number(event.target.value), "max")}
            className="thumb thumb--right z-4"
            {...thumbDefaultProps}
          />
        </>
      ) : (
        <StyledThumb
          value={singleValue}
          onChange={(event) => handleChangeSingleType(Number(event.target.value))}
          className="thumb thumb--single z-4"
          {...thumbDefaultProps}
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
