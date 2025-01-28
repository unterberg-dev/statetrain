export function parseTransportPosition(positionStr: string, timeSignature: number): number {
  const [bars, quarters, sixteenths] = positionStr.split(":").map(Number)

  // The number of sixteenth notes in one bar depends on the time signature:
  // e.g., for 4/4 time, one bar = 16 sixteenth notes (4 quarters * 4 sixteenths)
  const sixteenthNotesPerBar = timeSignature * 4

  // bars * (sixteenth-notes-per-bar) + quarters*4 + sixteenths
  return bars * sixteenthNotesPerBar + quarters * 4 + (sixteenths || 0)
}

// The chunk helper
export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize))
  }
  return chunks
}

/** Generate a unique ID for measure+step, or any other approach. */
export function getUniqueStepId(measureIndex: number, stepIndex: number) {
  return `m${measureIndex}-s${stepIndex}`
}

export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const OCTAVES = Array.from({ length: 9 }, (_, i) => i) // Generates [0, 1, 2, ..., 8]
