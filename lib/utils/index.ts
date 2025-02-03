export const ruleOfThree = (value: number, min: number, max: number) => (value / 100) * (max - min) + min

export const getPercent = (value: number, min: number, max: number) =>
  Number((((value - min) / (max - min)) * 100).toFixed(2))

export type ConfigMinMax = {
  min: number
  max: number
}

export type GetPercentSingleValue = {
  value: number
} & ConfigMinMax

export const getPercentSingleValue = (item: GetPercentSingleValue) =>
  getPercent(item.value, item.min, item.max)

/** Helper to build a set of "allowed" notes if a scale is selected. */
export const getPlayableNotes = (root: number, scalePattern: number[] | null) => {
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
}
