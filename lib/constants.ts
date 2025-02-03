export enum SequencerKey {
  AM = 0,
  Mono = 1,
  Duo = 2,
  Metal = 3,
  Membrane = 4,
  FM = 5,
}

export const SCALES = {
  none: null,
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
}

const whiteBlackKeySequence = [true, false, true, false, true, true, false, true, false, true, false, true]

export const keyMap = Array.from({ length: 128 }, (_, i) => ({
  index: i,
  isWhite: whiteBlackKeySequence[i % whiteBlackKeySequence.length],
}))

export const VOLUME_MIN = -60
export const VOLUME_MAX = 0

export const DEFAULT_SYNTH_VOLUME_PERCENT = 80
export const DEFAULT_METRONOME_VOLUME_PERCENT = 50
