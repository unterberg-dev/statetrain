import { H3Headline } from "#components/common/Headline"
import NumberInput from "#components/form/NumberInput"
import { APP_CONFIG } from "#lib/config"
import type { Sequencer } from "#tone/class/Sequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"
import midiToNote from "#utils/midiToNote"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import rc from "react-classmate"

interface StyledKeyProps {
  $active: boolean
  $locked?: boolean
}

interface StyledKeyVariants {
  $type: "white" | "black"
}

const StyledKey = rc.button.variants<StyledKeyProps, StyledKeyVariants>({
  base: "h-40 cursor-pointer relative",
  variants: {
    $type: {
      white: (p) => `
        ${p.$active ? "bg-secondary/80" : "bg-white"}
        ${p.$locked ? "!bg-error/30" : ""}
        flex-1
        border-r-3
        border-dark
      `,
      black: (p) => `
        ${p.$active ? "bg-secondary/50" : "bg-dark"}
        ${p.$locked ? "!bg-error/10" : ""}
        flex-1
        border-r-3
         border-dark
      `,
    },
  },
})

const StyledKeyNoteValue = rc.span<{ $white: boolean; $pressed: boolean; $locked?: boolean }>`
  block
  ${(p) => (p.$locked ? "!text-error text-micro" : "text-sm")}
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

const SCALES = {
  none: null,
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
}

const maxVoices = 6

const getPlayableNotes = (root: number, scalePattern: number[] | null) => {
  if (!scalePattern) return new Set(Array.from({ length: 128 }, (_, i) => i)) // All notes playable

  const playableNotes = new Set<number>()
  for (let octave = 0; octave < 11; octave++) {
    for (const step of scalePattern) {
      const midiNote = root + step + octave * 12
      if (midiNote < 128) playableNotes.add(midiNote)
    }
  }
  return playableNotes
}

interface PianoRollProps {
  sequencer: Sequencer | null
  steps: Steps | undefined
  activeStep: number | undefined
}

/** Piano Roll protype */
const PianoRoll = ({ sequencer, steps, activeStep }: PianoRollProps) => {
  const { tone, scale, setScale, bpm } = useTone()
  const { editStepIndex } = useSequencer()
  const [currentOctave, setCurrentOctave] = useState(3)
  const [displayedOctaves, setDisplayedOctaves] = useState(2)
  const [notesPressed, setNotesPressed] = useState<number[] | null>(null)
  const [maxVoicesReached, setMaxVoicesReached] = useState(false)

  const rootNote = currentOctave * 12 // Root is first note of the displayed octave
  const playableNotes = useMemo(() => getPlayableNotes(rootNote, scale), [rootNote, scale])

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
    }, APP_CONFIG.transition.timeShort / 1.5)
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
      const nextNotePossible = currentEditStepNotesValuesToMidi.length < maxVoices

      if (synth && tone && sequencer) {
        const note = tone.Frequency(value, "midi").toNote()
        synth.triggerAttackRelease(note, "16n", tone.now(), 0.5)

        // if not edit, at least play the note
        if (editStepIndex === undefined) {
          setNotesPressed([value])
        } else {
          if (nextNotePossible) {
            sequencer.toggleStep(editStepIndex, note, 0.5)
            setMaxVoicesReached(false)
          } else {
            setMaxVoicesReached(true)
          }

          setEditStepNotesMap((prev) => {
            const prevNotes = prev[editStepIndex] || []

            // prevent adding next note if already n notes are added
            const nextValue = nextNotePossible ? [...prevNotes, value] : prevNotes

            const newNotes = prevNotes.includes(value) ? prevNotes.filter((n) => n !== value) : nextValue
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
    [sequencer, tone, editStepIndex, currentEditStepNotesValuesToMidi],
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
      keyMap
        .filter(
          (keyItem) =>
            keyItem.index >= currentOctave * 12 &&
            keyItem.index < Math.min((currentOctave + displayedOctaves) * 12, 128),
        )
        .map((keyItem) => ({
          ...keyItem,
          locked: !playableNotes.has(keyItem.index), // Lock keys outside the scale
        })),
    [currentOctave, displayedOctaves, playableNotes],
  )

  return (
    <>
      <H3Headline className="text-white mt-5 mb-3">Piano Roll</H3Headline>

      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-wrap gap-5 items-center">
          <NumberInput
            id="current-octave"
            label="Current Octave"
            value={currentOctave}
            className="!text-base"
            onDecrease={() => handleSetCurrentOctave(currentOctave - 1)}
            onIncrease={() => handleSetCurrentOctave(currentOctave + 1)}
          />
          {/* Displayed Octaves Selection */}
          <NumberInput
            id="displayed-octaves"
            label="Number of Octaves"
            value={displayedOctaves}
            className="!text-base"
            onDecrease={() => handleSetDisplayedOctaves(displayedOctaves - 1)}
            onIncrease={() => handleSetDisplayedOctaves(displayedOctaves + 1)}
          />
          <div className="flex gap-1 items-center">
            <label htmlFor="apply-scale">Apply scale: </label>
            <select
              value={
                Object.keys(SCALES).find((key) => SCALES[key as keyof typeof SCALES] === scale) || "none"
              }
              id="apply-scale"
              onChange={(e) => setScale(SCALES[e.target.value as keyof typeof SCALES])}
              className="p-1 rounded bg-grayDark text-white"
            >
              {Object.keys(SCALES).map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>
        </div>
        {maxVoicesReached && (
          <p className="text-error p-1 px-2 border-error border-1 rounded text-sm">
            Max Voices reached: {maxVoices}
          </p>
        )}
      </div>

      <div className="flex bg-grayDark">
        {notesInCurrentOctaves.map((keyItem) => {
          const wasPressed = notesPressed?.includes(keyItem.index) || false
          const isCurrentEditStep = currentEditStepNotesValuesToMidi.includes(keyItem.index)

          return (
            <MemoizedStyledKey
              $locked={keyItem.locked}
              onMouseDown={keyItem.locked ? undefined : handlePlayNote}
              key={keyItem.index}
              data-key-index={keyItem.index}
              $active={isCurrentEditStep}
              $type={keyItem.isWhite ? "white" : "black"}
            >
              <MemoizedStyledKeyNoteValue
                $locked={keyItem.locked}
                $pressed={isCurrentEditStep || wasPressed}
                $white={keyItem.isWhite}
              >
                {midiToNote(keyItem.index)}
              </MemoizedStyledKeyNoteValue>
              <div
                style={{
                  opacity: wasPressed ? 1 : 0,
                  transition: `opacity ${20 / bpm}s ease-out`,
                }}
                className="absolute top-0 left-0 w-full h-full bg-primary bg-opacity-100 z-100 pointer-events-none"
              />
            </MemoizedStyledKey>
          )
        })}
      </div>
    </>
  )
}

export default PianoRoll
