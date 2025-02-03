import NumberInput from "#components/form/NumberInput"
import { SCALES } from "#lib/constants"
import useTone from "#tone/useTone"
import { type Dispatch, type SetStateAction, useCallback } from "react"

interface PianoRollControlsProps {
  currentOctave: number
  setCurrentOctave: (val: number) => void
  displayedOctaves: number
  setDisplayedOctaves: Dispatch<SetStateAction<number>>
}

const PianoRollControls = ({
  currentOctave,
  displayedOctaves,
  setCurrentOctave,
  setDisplayedOctaves,
}: PianoRollControlsProps) => {
  const { scale, setScale } = useTone()
  const handleSetCurrentOctave = useCallback(
    (val: number) => {
      if (val < 0 || val > 10) return
      setCurrentOctave(val)
    },
    [setCurrentOctave],
  )

  const handleSetDisplayedOctaves = useCallback(
    (val: number) => {
      setDisplayedOctaves((prev) => {
        const maxAllowed = 10 - prev
        const clamped = Math.max(1, Math.min(val, maxAllowed, 3))
        return clamped
      })
    },
    [setDisplayedOctaves],
  )

  return (
    <div className="flex flex-wrap gap-5 items-center">
      <NumberInput
        id="current-octave"
        label="Current Octave"
        value={currentOctave}
        onDecrease={() => handleSetCurrentOctave(currentOctave - 1)}
        onIncrease={() => handleSetCurrentOctave(currentOctave + 1)}
      />
      <NumberInput
        id="displayed-octaves"
        label="Number of Octaves"
        value={displayedOctaves}
        onDecrease={() => handleSetDisplayedOctaves(displayedOctaves - 1)}
        onIncrease={() => handleSetDisplayedOctaves(displayedOctaves + 1)}
      />
      <div className="flex gap-1 items-center">
        <label htmlFor="apply-scale" className="select-none">
          Apply scale:{" "}
        </label>
        <select
          value={Object.keys(SCALES).find((k) => SCALES[k as keyof typeof SCALES] === scale) || "none"}
          id="apply-scale"
          onChange={(e) => setScale(SCALES[e.target.value as keyof typeof SCALES])}
          className="p-1 rounded bg-grayDark text-white"
        >
          {Object.keys(SCALES).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default PianoRollControls
