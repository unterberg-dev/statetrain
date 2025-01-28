import type * as Tone from "tone"
import type { TransportClass } from "tone/build/esm/core/clock/Transport"

import type { SequencerStoreValues } from "#tone/useSequencer"
import type { AMSynth, DuoSynth, MonoSynth, Synth } from "tone"

export type InternalToneType = typeof Tone
export type InternalTransportType = TransportClass

export type AvailableSynths = Synth | MonoSynth | AMSynth | DuoSynth

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
    default: SequencerStoreValues["measures"]
    min: number
    max: number
  }
  isPlaying: boolean
}
