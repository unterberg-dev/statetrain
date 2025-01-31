const midiToNote = (midi: number): string => {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const octave = Math.floor(midi / 12) - 1
  const note = noteNames[midi % 12]
  return `${note}${octave}`
}

export default midiToNote
