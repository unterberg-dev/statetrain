import { H3Headline } from "#components/common/Headline"
import NumberInput from "#components/form/NumberInput"
import { APP_CONFIG } from "#lib/config"
import type { StepSequencer } from "#tone/class/StepSequencer"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import type { Steps } from "#types/tone"
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react"
import rc from "react-classmate"

interface StyledKeyProps {
  $pressed: boolean
  $active: boolean
}

interface StyledKeyVariants {
  $type: "white" | "black"
}

const StyledKey = rc.button.variants<StyledKeyProps, StyledKeyVariants>({
  base: (p) => `h-40 cursor-pointer transition-colors ${APP_CONFIG.transition.twShort}`,
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
// @todo: we need the activeStep + information which note was played.
// means we need a real object containing the current step, note, velocity, etc.
const PianoRoll = ({ sequencer, steps, activeStep }: PianoRollProps) => {
  const { tone } = useTone()
  const { editStepIndex } = useSequencer()
  const [currentOctave, setCurrentOctave] = useState(3)
  const [notesPressed, setNotesPressed] = useState<number[] | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null) // To store the timeout reference

  // we only need this for diplaying what user choosen to edit on this step
  const [editStepNotes, setEditStepNotes] = useState<number[]>([])

  useEffect(() => {
    if (editStepIndex) {
      setEditStepNotes([])
    }
  }, [editStepIndex])

  // currently buggin if key was 0
  const notesInCurrentOctave = keyMap.filter(
    (keyItem) => keyItem.index >= currentOctave * 12 && keyItem.index < (currentOctave + 1) * 12,
  )

  const currentActiveStep = useMemo(
    () => steps?.find((step) => step.index === activeStep),
    [steps, activeStep],
  )

  // we wanna check if the step we edit (editStepIndex) had notes in it and wanna display them on the roll
  const currentEditStepNotes = useMemo(
    () => steps?.find((step) => step.index === editStepIndex)?.notes,
    [steps, editStepIndex],
  )

  const currentEditStepNotesValuesToMidi: number[] = useMemo(() => {
    if (!tone || !currentEditStepNotes) return []
    const steps = currentEditStepNotes.map((note) => tone.Frequency(note.value).toMidi())

    return [...steps, ...editStepNotes]
  }, [currentEditStepNotes, editStepNotes, tone])

  useEffect(() => {
    if (sequencer && currentActiveStep?.active && tone) {
      const notes = []
      for (const note of currentActiveStep.notes) {
        notes.push(tone.Frequency(note.value).toMidi())
      }

      setNotesPressed(notes)

      // Clear any existing timeout to prevent conflicting resets
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a new timeout to clear the pressed note after 300ms
      timeoutRef.current = setTimeout(() => {
        setNotesPressed(null)
      }, APP_CONFIG.transition.timeShort)
    }
  }, [sequencer, currentActiveStep, tone])

  const handlePlayNote = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const synth = sequencer?.getSynth()
      const value = Number(event.currentTarget.dataset.keyIndex)

      setNotesPressed([value])
      setEditStepNotes((prev) => {
        if (prev.includes(value)) {
          return prev.filter((note) => note !== value)
        }
        return [...prev, value]
      })

      if (synth && editStepIndex !== undefined && value !== undefined && tone && sequencer) {
        const note = tone.Frequency(value, "midi").toNote()
        sequencer.toggleStep(editStepIndex, note, 0.5)
        synth.triggerAttackRelease(tone.Frequency(value, "midi").toNote(), "16n", tone.now(), 0.5)
      }

      // Clear any existing timeout to prevent conflicting resets
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a new timeout to clear the pressed note after 300ms
      timeoutRef.current = setTimeout(() => {
        setNotesPressed(null)
      }, APP_CONFIG.transition.timeShort)
    },
    [sequencer, tone, editStepIndex],
  )

  const handleSetCurrentOctave = useCallback((octave: number) => {
    if (octave < 0 || octave > 10) return
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
            $pressed={notesPressed?.includes(keyItem.index) || false}
            $active={currentEditStepNotesValuesToMidi.includes(keyItem.index)}
            $type={keyItem.isWhite ? "white" : "black"}
          />
        ))}
      </div>
    </>
  )
}

export default PianoRoll
