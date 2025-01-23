import type * as Tone from "tone"
import type { TransportClass } from "tone/build/esm/core/clock/Transport"

export type ToneType = typeof Tone
export type TransportType = TransportClass

export type SynthType = Tone.Synth

export type TransportConfigType = {
  bpm: {
    default: number
    min: number
    max: number
  }
  loop: {
    default: boolean
  }
  timeSignature: {
    default: number
    min: number
    max: number
  }
  loopLength: {
    default: number
    min: number
    max: number
  }
  isPlaying: boolean
}
