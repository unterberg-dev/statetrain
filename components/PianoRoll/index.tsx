import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react"
import rc from "react-classmate"
import type { Sequencer } from "#tone/class/Sequencer"
import { APP_CONFIG } from "#lib/config"
import useTone from "#tone/useTone"
import useSequencer from "#tone/useSequencer"
import midiToNote from "#utils/midiToNote"
import { H3Headline } from "#components/common/Headline"
import NumberInput from "#components/form/NumberInput"
import { useGlobalActiveStepRef } from "#tone/ActiveStepProvider"

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
  block pointer-events-none
  ${(p) => (p.$locked ? "!text-error text-micro" : "text-sm")}
  ${(p) => (p.$white ? "text-gray mt-24" : "text-gray mt-12")}
  ${(p) => (p.$pressed ? "!text-white" : "")}
`

// @ todo: implement again
const MemoizedStyledKey = memo(StyledKey)
const MemoizedStyledKeyNoteValue = memo(StyledKeyNoteValue)

interface PianoRollProps {
  sequencer: Sequencer | null
}

export default function PianoRoll({ sequencer }: PianoRollProps) {
  const { tone, scale, setScale, bpm } = useTone()
  const { editStepIndex } = useSequencer()

  // This ref is updated by your sixteenth‐tick logic (like in HighlightOverlayDOM).
  const globalActiveStepRef = useGlobalActiveStepRef()

  // For local user-editing states:
  const [currentOctave, setCurrentOctave] = useState(3)
  const [displayedOctaves, setDisplayedOctaves] = useState(2)
  const [notesPressed, setNotesPressed] = useState<number[] | null>(null)
  const [maxVoicesReached, setMaxVoicesReached] = useState(false)
  const [editStepNotesMap, setEditStepNotesMap] = useState<Record<number, number[]>>({})

  // Container ref for all the rendered key elements
  const pianoRef = useRef<HTMLDivElement>(null)
  // We'll track the previously highlighted step to know when it changes
  const prevHighlightedStepRef = useRef<number | null>(null)

  // Scale definitions
  const SCALES = useMemo(
    () => ({
      none: null,
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonic: [0, 2, 4, 7, 9],
      blues: [0, 3, 5, 6, 7, 10],
    }),
    [],
  )

  // White or black key by index
  const whiteBlackKeySequence = useMemo(
    () => [true, false, true, false, true, true, false, true, false, true, false, true],
    [],
  )
  // Full keyMap from 0..127
  const keyMap = useMemo(
    () =>
      Array.from({ length: 128 }, (_, i) => ({
        index: i,
        isWhite: whiteBlackKeySequence[i % whiteBlackKeySequence.length],
      })),
    [whiteBlackKeySequence],
  )

  /** Helper to build a set of "allowed" notes if a scale is selected. */
  const getPlayableNotes = useCallback((root: number, scalePattern: number[] | null) => {
    if (!scalePattern) {
      return new Set(Array.from({ length: 128 }, (_, i) => i)) // All notes playable
    }
    const playable = new Set<number>()
    for (let octave = 0; octave < 11; octave++) {
      for (const step of scalePattern) {
        const midiNote = root + step + octave * 12
        if (midiNote < 128) playable.add(midiNote)
      }
    }
    return playable
  }, [])

  // The root note to display
  const rootNote = currentOctave * 12
  // A set of allowable notes based on scale
  const playableNotes = useMemo(() => getPlayableNotes(rootNote, scale), [rootNote, scale, getPlayableNotes])

  // Filter out only the keys for the current octaves:
  const notesInCurrentOctaves = useMemo(() => {
    const start = currentOctave * 12
    const end = Math.min((currentOctave + displayedOctaves) * 12, 128)
    return keyMap
      .filter((k) => k.index >= start && k.index < end)
      .map((k) => ({
        ...k,
        locked: !playableNotes.has(k.index),
      }))
  }, [currentOctave, displayedOctaves, keyMap, playableNotes])

  useEffect(() => {
    let frameId: number

    function rafLoop() {
      if (!sequencer || !pianoRef.current) {
        frameId = requestAnimationFrame(rafLoop)
        return
      }
      const stepIndex = globalActiveStepRef.current
      // If step changed, highlight the new step’s notes
      if (prevHighlightedStepRef.current !== stepIndex) {
        // 1) Clear the old highlight:

        if (prevHighlightedStepRef.current !== null) {
          const oldStep = sequencer.getSteps()[prevHighlightedStepRef.current]

          if (oldStep?.notes && tone) {
            for (const note of oldStep.notes) {
              const midiVal = tone.Frequency(note.value).toMidi()
              const keyEl = pianoRef.current?.querySelector<HTMLDivElement>(`[data-midi-key="${midiVal}"]`)
              if (keyEl) {
                const overlay = keyEl.querySelector<HTMLDivElement>(".live-highlight")
                if (overlay) {
                  overlay.style.opacity = "0" // or overlay.classList.remove('live-highlight--active')
                }
              }
            }
          }
        }

        // 2) Highlight the new step
        const newStep = sequencer.getSteps()[stepIndex]
        if (newStep?.notes && tone) {
          for (const note of newStep.notes) {
            const midiVal = tone.Frequency(note.value).toMidi()
            const keyEl = pianoRef.current?.querySelector<HTMLDivElement>(`[data-midi-key="${midiVal}"]`)
            if (keyEl) {
              const overlay = keyEl.querySelector<HTMLDivElement>(".live-highlight")
              if (overlay) {
                overlay.style.opacity = "1"
              }
            }
          }
        }

        prevHighlightedStepRef.current = stepIndex
      }

      frameId = requestAnimationFrame(rafLoop)
    }

    frameId = requestAnimationFrame(rafLoop)
    return () => cancelAnimationFrame(frameId)
  }, [sequencer, globalActiveStepRef, tone])

  // Whenever the user changes the step to edit, load the existing notes:
  useEffect(() => {
    if (editStepIndex === undefined || !sequencer || !tone) return

    const step = sequencer.getSteps()[editStepIndex]
    if (!step) return
    const stepNotes = step.notes.map((n) => tone.Frequency(n.value).toMidi())
    setEditStepNotesMap({ [editStepIndex]: stepNotes })
  }, [editStepIndex, sequencer, tone])

  const currentEditStepMidiNotes = editStepIndex !== undefined ? editStepNotesMap[editStepIndex] || [] : []

  // Check if we can add more voices:
  useEffect(() => {
    if (!sequencer) return
    setMaxVoicesReached(currentEditStepMidiNotes.length >= sequencer.maxVoices)
  }, [sequencer, currentEditStepMidiNotes])

  // Press effect for “visual feedback” (not the live playback highlight):
  const pressedFeedbackTimeout = useRef<NodeJS.Timeout | null>(null)
  const handleNotePressFeedback = useCallback((notes: number[]) => {
    setNotesPressed(notes)
    if (pressedFeedbackTimeout.current) {
      clearTimeout(pressedFeedbackTimeout.current)
    }
    pressedFeedbackTimeout.current = setTimeout(
      () => setNotesPressed(null),
      APP_CONFIG.transition.timeShort / 1.5,
    )
  }, [])

  // If the user clicks a key to toggle it in the currently edited step:
  const handlePlayNote = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (!sequencer || !tone) return

      const keyIndex = Number(ev.currentTarget.dataset.keyIndex)
      const synth = sequencer.getSynth()
      if (!synth) return

      // Immediate audio feedback
      const note = tone.Frequency(keyIndex, "midi").toNote()
      synth.triggerAttackRelease(note, "16n", tone.now(), 0.5)

      if (editStepIndex === undefined) {
        // Not editing a step, just do pressed feedback
        handleNotePressFeedback([keyIndex])
        return
      }

      const isNoteActive = currentEditStepMidiNotes.includes(keyIndex)
      const canAddMore = currentEditStepMidiNotes.length < sequencer.maxVoices

      if (!isNoteActive && !canAddMore) {
        // You might show a warning if step is at max voices
        return
      }

      // Toggle the note in the sequencer
      sequencer.toggleStep(editStepIndex, note, 0.5)

      // Keep local state in sync
      setEditStepNotesMap((prev) => {
        const oldNotes = prev[editStepIndex] || []
        let newNotes: number[]
        if (isNoteActive) {
          // Remove note
          newNotes = oldNotes.filter((n) => n !== keyIndex)
        } else {
          newNotes = [...oldNotes, keyIndex]
        }
        return { ...prev, [editStepIndex]: newNotes }
      })

      // Small pressed feedback
      handleNotePressFeedback([keyIndex])
    },
    [sequencer, tone, editStepIndex, currentEditStepMidiNotes, handleNotePressFeedback],
  )

  // ================== UI for octaves & scales ==================
  const handleSetCurrentOctave = useCallback((val: number) => {
    if (val < 0 || val > 10) return
    setCurrentOctave(val)
  }, [])

  const handleSetDisplayedOctaves = useCallback(
    (val: number) => {
      const maxAllowed = 10 - currentOctave
      const clamped = Math.max(1, Math.min(val, maxAllowed, 3))
      setDisplayedOctaves(clamped)
    },
    [currentOctave],
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
        {maxVoicesReached && (
          <p className="text-error p-1 px-2 border-error border-1 rounded text-sm">
            Max Voices reached: {sequencer?.maxVoices}
          </p>
        )}
      </div>
      {/* Piano keys container */}
      <div ref={pianoRef} className="flex bg-grayDark">
        {notesInCurrentOctaves.map((keyItem) => {
          const wasPressed = notesPressed?.includes(keyItem.index) ?? false
          const isStepActive = currentEditStepMidiNotes.includes(keyItem.index)

          return (
            <button
              type="button"
              key={keyItem.index}
              data-key-index={keyItem.index}
              data-midi-key={keyItem.index}
              onMouseDown={keyItem.locked ? undefined : handlePlayNote}
              className={`relative h-40 flex-1 border-r-2
                ${
                  keyItem.isWhite
                    ? isStepActive
                      ? "bg-secondary/80"
                      : "bg-white"
                    : isStepActive
                      ? "bg-secondary/50"
                      : "bg-dark"
                }
                ${keyItem.locked ? "!bg-error/30" : ""}
              `}
              style={{ position: "relative" }}
            >
              {/* The note text */}
              <span
                className={`
                  block pointer-events-none
                  ${keyItem.locked ? "!text-error text-micro" : "text-sm"}
                  ${keyItem.isWhite ? "text-gray mt-24" : "text-gray mt-12"}
                  ${isStepActive || wasPressed ? "!text-white" : ""}
                `}
              >
                {midiToNote(keyItem.index)}
              </span>

              {/* Pressed feedback overlay */}
              <div
                style={{
                  opacity: wasPressed ? 1 : 0,
                  transition: `opacity ${20 / bpm}s ease-out`,
                }}
                className="absolute inset-0 bg-primary bg-opacity-100 z-10 pointer-events-none"
              />

              <div className="live-highlight bg-red absolute inset-0" style={{ opacity: 0 }} />
            </button>
          )
        })}
      </div>
    </>
  )
}
