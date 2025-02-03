import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react"

import { APP_CONFIG } from "#lib/config"
import useTone from "#tone/useTone"
import useSequencer from "#tone/useSequencer"
import midiToNote from "#utils/midiToNote"
import { H3Headline } from "#components/common/Headline"
import { useGlobalActiveStepRef } from "#tone/ActiveStepProvider"
import PianoRollControls from "#components/PianoRoll/Controls"
import { StyledKey, StyledKeyNoteValue } from "#components/PianoRoll/styled"
import { keyMap } from "#lib/constants"
import { getPlayableNotes } from "#utils/index"

const MemoizedStyledKey = memo(StyledKey)
const MemoizedStyledKeyNoteValue = memo(StyledKeyNoteValue)

export default function PianoRoll() {
  const { tone, scale, bpm } = useTone()
  const {
    editStepIndex,
    currentSequencer: { sequencer, steps },
    setEditStepNotesMap,
    editStepNotesMap,
  } = useSequencer()

  // This ref is updated by your sixteenth‐tick logic
  const globalActiveStepRef = useGlobalActiveStepRef()

  // Local states
  const [currentOctave, setCurrentOctave] = useState(3)
  const [displayedOctaves, setDisplayedOctaves] = useState(2)
  const [notesPressed, setNotesPressed] = useState<number[] | null>(null)
  const [maxVoicesReached, setMaxVoicesReached] = useState(false)

  // Force a re-render if the sequencer changes (since it's a class outside React)
  const [, forceRender] = useState(0)

  // For highlighting active keys
  const pianoRef = useRef<HTMLDivElement>(null)
  const prevHighlightedStepRef = useRef<number | null>(null)

  // Root note to display
  const rootNote = currentOctave * 12

  // A set of allowable notes based on scale
  const playableNotes = useMemo(() => getPlayableNotes(rootNote, scale), [rootNote, scale])

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
  }, [currentOctave, displayedOctaves, playableNotes])

  // Animate highlight for the "live playing" step
  useEffect(() => {
    let frameId: number

    function rafLoop() {
      if (!sequencer || !pianoRef.current) {
        frameId = requestAnimationFrame(rafLoop)
        return
      }

      const stepIndex = globalActiveStepRef.current

      if (prevHighlightedStepRef.current !== stepIndex) {
        // Un-highlight old step
        if (prevHighlightedStepRef.current !== null) {
          const oldStep = sequencer.getSteps()[prevHighlightedStepRef.current]
          if (oldStep?.notes && tone) {
            for (const note of oldStep.notes) {
              const midiVal = tone.Frequency(note.value).toMidi()
              const keyEl = pianoRef.current?.querySelector<HTMLDivElement>(`[data-midi-key="${midiVal}"]`)
              if (keyEl) {
                const overlay = keyEl.querySelector<HTMLDivElement>(".live-highlight")
                if (overlay) overlay.style.opacity = "0"
              }
            }
          }
        }

        // Highlight new step
        const newStep = sequencer.getSteps()[stepIndex]
        if (newStep?.notes && tone) {
          for (const note of newStep.notes) {
            const midiVal = tone.Frequency(note.value).toMidi()
            const keyEl = pianoRef.current?.querySelector<HTMLDivElement>(`[data-midi-key="${midiVal}"]`)
            if (keyEl) {
              const overlay = keyEl.querySelector<HTMLDivElement>(".live-highlight")
              if (overlay) overlay.style.opacity = "0.5"
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

    // Convert step's note strings back to MIDI
    const stepNotes = step.notes.map((n) => tone.Frequency(n.value).toMidi())
    setEditStepNotesMap({ [editStepIndex]: stepNotes })
  }, [editStepIndex, sequencer, tone, setEditStepNotesMap])

  // The list of MIDI notes for the currently editing step
  const currentEditStepMidiNotes = useMemo(() => {
    if (editStepIndex === undefined) return []
    return editStepNotesMap[editStepIndex] || []
  }, [editStepIndex, editStepNotesMap])

  // Check if we can add more voices:
  useEffect(() => {
    if (!sequencer) return
    setMaxVoicesReached(currentEditStepMidiNotes.length >= sequencer.maxVoices)
  }, [sequencer, currentEditStepMidiNotes])

  // Press effect for “visual feedback” (not the live playback highlight)
  const pressedFeedbackTimeout = useRef<NodeJS.Timeout | null>(null)
  const handleNotePressFeedback = useCallback((notes: number[]) => {
    setNotesPressed(notes)
    if (pressedFeedbackTimeout.current) {
      clearTimeout(pressedFeedbackTimeout.current)
    }
    pressedFeedbackTimeout.current = setTimeout(() => {
      setNotesPressed(null)
    }, APP_CONFIG.transition.timeShort / 1.5)
  }, [])

  /**
   * Read the step's .double from the steps array:
   */
  const currentStepDouble = useMemo(() => {
    if (editStepIndex === undefined) return false
    return steps[editStepIndex]?.double ?? false
  }, [steps, editStepIndex])

  const [localIsDouble, setLocalIsDouble] = useState(false)
  useEffect(() => {
    if (editStepIndex === undefined) {
      setLocalIsDouble(false)
      return
    }
    const step = sequencer?.getSteps()[editStepIndex]
    console.log(step)
    if (!step) {
      setLocalIsDouble(false)
      return
    }
    setLocalIsDouble(step.double)
  }, [editStepIndex, sequencer])

  /**
   * Toggle the double value for this step,
   * and force a re-render so the checkbox updates.
   */
  const handleToggleDouble = useCallback(() => {
    if (editStepIndex === undefined || sequencer === null) return
    // 1) Flip local state
    setLocalIsDouble((prev) => !prev)
    // 2) Update the sequencer
    sequencer.toggleDouble(editStepIndex)
  }, [editStepIndex, sequencer])

  /**
   * Called when user clicks a piano key
   */
  const handlePlayNote = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (!sequencer || !tone) return

      const keyIndex = Number(ev.currentTarget.dataset.keyIndex)
      const synth = sequencer.getSynth()
      if (!synth) return

      // Immediate audio feedback
      const note = tone.Frequency(keyIndex, "midi").toNote()
      synth.triggerAttackRelease(note, "16n", tone.now(), 0.5)

      // If we don't have an editStepIndex, it's just a real-time preview
      if (editStepIndex === undefined) {
        handleNotePressFeedback([keyIndex])
        return
      }

      // If we are editing a step, toggle the note in that step
      const isNoteActive = currentEditStepMidiNotes.includes(keyIndex)
      const canAddMore = currentEditStepMidiNotes.length < sequencer.maxVoices
      if (!isNoteActive && !canAddMore) {
        // Reached max voices, do nothing
        return
      }

      // Toggle the note in the Sequencer
      sequencer.toggleStep(editStepIndex, note, 0.5)

      // Keep local state in sync
      setEditStepNotesMap((prev) => {
        const oldNotes = prev[editStepIndex] || []
        let newNotes: number[]
        if (isNoteActive) {
          // remove it
          newNotes = oldNotes.filter((n) => n !== keyIndex)
        } else {
          // add it
          newNotes = [...oldNotes, keyIndex]
        }
        return { ...prev, [editStepIndex]: newNotes }
      })

      // Visual pressed feedback
      handleNotePressFeedback([keyIndex])
    },
    [sequencer, tone, editStepIndex, currentEditStepMidiNotes, handleNotePressFeedback, setEditStepNotesMap],
  )

  return (
    <>
      <H3Headline className="text-white mt-5 mb-3">Piano Roll</H3Headline>

      <div className="flex justify-between items-center mb-5">
        <PianoRollControls
          currentOctave={currentOctave}
          setCurrentOctave={setCurrentOctave}
          displayedOctaves={displayedOctaves}
          setDisplayedOctaves={setDisplayedOctaves}
        />

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
            <MemoizedStyledKey
              $active={isStepActive}
              $locked={keyItem.locked}
              $type={keyItem.isWhite ? "white" : "black"}
              type="button"
              key={keyItem.index}
              data-key-index={keyItem.index}
              data-midi-key={keyItem.index}
              onMouseDown={keyItem.locked ? undefined : handlePlayNote}
            >
              <MemoizedStyledKeyNoteValue $locked={keyItem.locked} $white={keyItem.isWhite}>
                {midiToNote(keyItem.index)}
              </MemoizedStyledKeyNoteValue>

              {/* Pressed feedback overlay */}
              <div
                style={{
                  opacity: wasPressed ? 1 : 0,
                  transition: `opacity ${20 / bpm}s ease-out`,
                }}
                className="absolute inset-0 bg-primary bg-opacity-50 z-10 pointer-events-none"
              />

              {/* Live playback highlight overlay */}
              <div
                className="live-highlight bg-red absolute inset-0 transition-opacity"
                style={{ opacity: 0 }}
              />
            </MemoizedStyledKey>
          )
        })}
      </div>

      {/* Settings per steps */}
      {editStepIndex !== undefined && (
        <div className="mt-5">
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localIsDouble}
              onChange={handleToggleDouble}
              className="cursor-pointer"
            />
            <span className="text-white text-sm">Double</span>
          </label>
        </div>
      )}
    </>
  )
}
