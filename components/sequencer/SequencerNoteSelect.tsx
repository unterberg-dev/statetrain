import { useCallback, useEffect, useState } from "react"

import { NOTES } from "#components/sequencer/utils"
import type { StepSequencer } from "#tone/StepSequencer"
import NumberInput from "#components/form/NumberInput"
import { StyledSelect } from "#components/form/styled"

interface SequencerNoteSelectProps {
  sequencer: StepSequencer | null
}

const SequencerNoteSelect = ({ sequencer }: SequencerNoteSelectProps) => {
  // @todo: get from useTone -> implement new store entries
  const [selectedNote, setSelectedNote] = useState<string>("G")
  const [selectedOctave, setSelectedOctave] = useState<number>(4)

  // Function to combine note and octave and update the sequencer
  const updateSequencerNote = useCallback(
    (note: string, inputOctave: number) => {
      if (inputOctave > selectedOctave) {
        setSelectedOctave((prev) => prev + 1)
      }
      if (inputOctave < selectedOctave) {
        setSelectedOctave((prev) => prev - 1)
      }

      const combinedNote = `${note}${inputOctave}`
      if (sequencer) {
        sequencer.changeNote(combinedNote)
      }
    },
    [sequencer, selectedOctave],
  )

  // Handle note name change
  const handleNoteChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newNote = event.target.value
      setSelectedNote(newNote)
      updateSequencerNote(newNote, selectedOctave)
    },
    [selectedOctave, updateSequencerNote],
  )

  const handleOctaveDecrease = useCallback(() => {
    updateSequencerNote(selectedNote, selectedOctave - 1)
  }, [selectedNote, selectedOctave, updateSequencerNote])

  const handleOctaveIncrease = useCallback(() => {
    updateSequencerNote(selectedNote, selectedOctave + 1)
  }, [selectedNote, selectedOctave, updateSequencerNote])

  // Initialize the selects with the current note when sequencer is available
  useEffect(() => {
    if (!sequencer) return
    const currentNote = sequencer.getNote() // e.g., "G4"
    if (typeof currentNote === "string") {
      const noteMatch = currentNote.match(/^([A-G]#?)(\d)$/)
      if (noteMatch) {
        setSelectedNote(noteMatch[1])
        setSelectedOctave(Number.parseInt(noteMatch[2], 10))
      }
    }
  }, [sequencer])

  return (
    <div className="flex justify-start gap-4 mb-5">
      {/* Note Selection */}
      <div className="flex items-center justify-between w-34">
        <label htmlFor="note-select" className="text-sm whitespace-nowrap">
          Note:
        </label>
        <StyledSelect
          className="rounded w-20 py-0.5 h-auto"
          id="note-select"
          value={selectedNote}
          onChange={handleNoteChange}
        >
          {NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div className="w-40">
        <NumberInput
          label="Octave:"
          value={selectedOctave}
          id="step"
          onDecrease={handleOctaveDecrease}
          onIncrease={handleOctaveIncrease}
        />
      </div>
    </div>
  )
}

export default SequencerNoteSelect
