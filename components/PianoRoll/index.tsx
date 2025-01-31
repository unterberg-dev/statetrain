import { H3Headline } from "#components/common/Headline"
import NumberInput from "#components/form/NumberInput"
import { APP_CONFIG } from "#lib/config"
import type { StepSequencer } from "#tone/class/StepSequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"
import midiToNote from "#utils/midiToNote"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import rc from "react-classmate"

interface StyledKeyProps {
  $pressed: boolean
  $active: boolean
}

interface StyledKeyVariants {
  $type: "white" | "black"
}

const StyledKey = rc.button.variants<StyledKeyProps, StyledKeyVariants>({
  base: `h-40 cursor-pointer transition-colors ${APP_CONFIG.transition.twShort}`,
  variants: {
    $type: {
      white: (p) => `
        ${p.$pressed ? "!bg-primary" : ""}
        ${p.$active ? "bg-secondary/80" : "bg-white"}
        flex-1
        border-r-3
        border-dark
      `,
      black: (p) => `
        ${p.$pressed ? "!bg-primary" : ""}
        ${p.$active ? "bg-secondary/50" : "bg-dark"}
        flex-1
        border-r-3
         border-dark
      `,
    },
  },
})

const StyledKeyNoteValue = rc.span<{ $white: boolean; $pressed: boolean }>`
  block
  text-sm
  ${(p) => (p.$white ? "text-gray mt-24" : "text-gray mt-12")}
  ${(p) => (p.$pressed ? "!text-white" : "")}
`

const MemoizedStyledKey = memo(StyledKey)
const MemoizedStyledKeyNoteValue = memo(StyledKeyNoteValue)

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
  steps: Steps | undefined
  activeStep: number | undefined
}

/** Piano Roll protype */
const PianoRoll = ({ sequencer, steps, activeStep }: PianoRollProps) => {
  const { tone } = useTone()
  const { editStepIndex } = useSequencer()
  const [currentOctave, setCurrentOctave] = useState(3)
  const [displayedOctaves, setDisplayedOctaves] = useState(2)
  const [notesPressed, setNotesPressed] = useState<number[] | null>(null)

  const [editStepNotesMap, setEditStepNotesMap] = useState<Record<number, number[]>>({})
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // on change of editStepIndex it should prefill editStepNotesMap with the notes of the step
  useEffect(() => {
    if (editStepIndex === undefined || !steps?.length || !tone) return

    const stepNotes = steps[editStepIndex]?.notes.map((note) => tone.Frequency(note.value).toMidi())
    setEditStepNotesMap({ [editStepIndex]: stepNotes })
  }, [editStepIndex, steps, tone])

  const currentActiveStep = steps?.find((step) => step.index === activeStep)

  const handleNotePress = useCallback((notes: number[]) => {
    setNotesPressed(notes)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setNotesPressed(null)
    }, APP_CONFIG.transition.timeShort)
  }, [])

  const currentEditStepNotesValuesToMidi =
    editStepIndex !== undefined && steps?.length ? editStepNotesMap[editStepIndex] || [] : []

  useEffect(() => {
    if (sequencer && currentActiveStep?.active && tone) {
      const notes = []
      for (const note of currentActiveStep.notes) {
        notes.push(tone.Frequency(note.value).toMidi())
      }
      handleNotePress(notes)
    }
  }, [sequencer, currentActiveStep, tone, handleNotePress])

  const handlePlayNote = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const synth = sequencer?.getSynth()
      const value = Number(event.currentTarget.dataset.keyIndex)

      if (synth && tone && sequencer) {
        const note = tone.Frequency(value, "midi").toNote()
        synth.triggerAttackRelease(note, "16n", tone.now(), 0.5)

        // if not edit, at least play the note
        if (editStepIndex === undefined) {
          setNotesPressed([value])
        } else {
          sequencer.toggleStep(editStepIndex, note, 0.5)
          setEditStepNotesMap((prev) => {
            const prevNotes = prev[editStepIndex] || []
            const newNotes = prevNotes.includes(value)
              ? prevNotes.filter((n) => n !== value)
              : [...prevNotes, value]
            return { ...prev, [editStepIndex]: newNotes }
          })
        }
      }

      // Clear pressed state after timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setNotesPressed(null)
      }, APP_CONFIG.transition.timeShort)
    },
    [sequencer, tone, editStepIndex],
  )

  const handleSetCurrentOctave = useCallback((octave: number) => {
    if (octave < 1 || octave > 10) return
    setCurrentOctave(octave)
  }, [])

  const handleSetDisplayedOctaves = useCallback(
    (octaves: number) => {
      // we don't go beyond MIDI note 127
      const maxAllowed = 10 - currentOctave
      const clampedOctaves = Math.max(1, Math.min(octaves, maxAllowed, 3))
      setDisplayedOctaves(clampedOctaves)
    },
    [currentOctave],
  )

  // Filter keys based on the current octave and displayed range
  const notesInCurrentOctaves = useMemo(
    () =>
      keyMap.filter(
        (keyItem) =>
          keyItem.index >= currentOctave * 12 &&
          keyItem.index < Math.min((currentOctave + displayedOctaves) * 12, 128), // Prevent overflow
      ),
    [currentOctave, displayedOctaves],
  )

  return (
    <>
      <H3Headline className="text-white mt-5 mb-3">Piano Roll</H3Headline>
      <div className="flex flex-wrap gap-5 mb-5">
        <div className="w-50">
          <NumberInput
            id="current-octave"
            label="Current Octave"
            value={currentOctave}
            onDecrease={() => handleSetCurrentOctave(currentOctave - 1)}
            onIncrease={() => handleSetCurrentOctave(currentOctave + 1)}
          />
        </div>
        {/* Displayed Octaves Selection */}
        <div className="w-50">
          <NumberInput
            id="displayed-octaves"
            label="Number of Octaves"
            value={displayedOctaves}
            onDecrease={() => handleSetDisplayedOctaves(displayedOctaves - 1)}
            onIncrease={() => handleSetDisplayedOctaves(displayedOctaves + 1)}
          />
        </div>
      </div>
      <div className="flex bg-grayDark">
        {notesInCurrentOctaves.map((keyItem) => (
          <MemoizedStyledKey
            onMouseDown={handlePlayNote}
            key={keyItem.index}
            data-key-index={keyItem.index}
            $pressed={notesPressed?.includes(keyItem.index) || false}
            $active={currentEditStepNotesValuesToMidi.includes(keyItem.index)}
            $type={keyItem.isWhite ? "white" : "black"}
          >
            <MemoizedStyledKeyNoteValue
              $pressed={
                notesPressed?.includes(keyItem.index) ||
                currentEditStepNotesValuesToMidi.includes(keyItem.index) ||
                false
              }
              $white={keyItem.isWhite}
            >
              {midiToNote(keyItem.index)}
            </MemoizedStyledKeyNoteValue>
          </MemoizedStyledKey>
        ))}
      </div>
    </>
  )
}

export default PianoRoll
