import { H3Headline } from "#components/common/Headline"
import NumberInput from "#components/form/NumberInput"
import { APP_CONFIG } from "#lib/config"
import type { StepSequencer } from "#tone/class/StepSequencer"
import useTone from "#tone/useTone"
import { useCallback, useRef, useState } from "react"
import rc from "react-classmate"

interface StyledKeyProps {
  $pressed: boolean
}

interface StyledKeyVariants {
  $type: "white" | "black"
}

const StyledKey = rc.button.variants<StyledKeyProps, StyledKeyVariants>({
  base: `h-40 cursor-pointer transition-colors ${APP_CONFIG.transition.twShort}`,
  variants: {
    $type: {
      white: (p) => `
        ${p.$pressed ? "bg-primary" : "bg-white"}
        flex-1
        border-r-3
        border-dark
      `,
      black: (p) => `
        ${p.$pressed ? "bg-primary" : "bg-dark"}
        flex-1
      `,
    },
  },
})

// white - true / black - false
const whiteBlackKeySequence = [true, false, true, false, true, true, false, true, false, true, false, true]

// map all possible keys
// pass isWhite by checkig in the running sequence
// also pass note and index
const keyMap = Array.from({ length: 128 }, (_, i) => ({
  index: i, // = note
  isWhite: whiteBlackKeySequence[i % whiteBlackKeySequence.length],
}))

interface PianoRollProps {
  sequencer: StepSequencer | null
}

/** Piano Roll protype */
// @todo: we need the activeStep + information which note was played.
// means we need a real object containing the current step, note, velocity, etc.
const PianoRoll = ({ sequencer }: PianoRollProps) => {
  const { tone } = useTone()
  const [currentOctave, setCurrentOctave] = useState(3)
  const [notePressed, setNotePressed] = useState<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null) // To store the timeout reference

  const notesInCurrentOctave = keyMap.filter(
    (keyItem) => keyItem.index >= currentOctave * 12 && keyItem.index < (currentOctave + 1) * 12,
  )

  const handlePlayNote = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const synth = sequencer?.getSynth()
      const value = Number(event.currentTarget.dataset.keyIndex)

      setNotePressed(value)

      if (synth && value && tone) {
        synth.triggerAttackRelease(tone.Frequency(value, "midi").toNote(), "16n", tone.now(), 0.5)
      }

      // Clear any existing timeout to prevent conflicting resets
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a new timeout to clear the pressed note after 300ms
      timeoutRef.current = setTimeout(() => {
        setNotePressed(null)
      }, APP_CONFIG.transition.timeShort)
    },
    [sequencer, tone],
  )

  const handleSetCurrentOctave = useCallback((octave: number) => {
    setCurrentOctave(octave)
  }, [])

  return (
    <>
      <H3Headline className="text-white mt-5 mb-3">WIP: Piano Roll</H3Headline>
      <p className="text-lg mb-3">
        This piano roll is currently only connected to the same synth, but does not "know" about the played
        note.
      </p>
      <div className="w-50 mb-5">
        <NumberInput
          id="current-octave"
          label="Current Octave"
          value={currentOctave}
          onDecrease={() => handleSetCurrentOctave(currentOctave - 1)}
          onIncrease={() => handleSetCurrentOctave(currentOctave + 1)}
        />
      </div>
      <div className="flex bg-grayDark">
        {notesInCurrentOctave.map((keyItem) => (
          <StyledKey
            onMouseDown={handlePlayNote}
            key={keyItem.index}
            data-key-index={keyItem.index}
            $pressed={notePressed === keyItem.index}
            $type={keyItem.isWhite ? "white" : "black"}
          />
        ))}
      </div>
    </>
  )
}

export default PianoRoll
