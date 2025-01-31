import type * as Tone from "tone"
import type { TransportClass } from "tone/build/esm/core/clock/Transport"

import type { SequencerStoreValues } from "#tone/useSequencer"
import type {
  AMSynth,
  DuoSynth,
  FMSynth,
  MembraneSynth,
  MetalSynth,
  MonoSynth,
  PluckSynth,
  PolySynth,
  Synth,
} from "tone"

export type InternalToneType = typeof Tone
export type InternalTransportType = TransportClass

export type AvailableSynths =
  | PolySynth<Synth>
  | PolySynth<MonoSynth>
  | PolySynth<AMSynth>
  | PolySynth<DuoSynth>
  | PolySynth<FMSynth>
  | PolySynth<MetalSynth>
  | PolySynth<MembraneSynth>
// | PluckSynth

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

export type StepNote = {
  value: string
  velocity: number
}

export type Step = {
  index: number
  active: boolean
  notes: StepNote[]
  double: boolean
}

export type Steps = Step[]

// accept argument of type T or a callback using previous state of type T
export type StoreReactStateSetter<T> = T | ((prev: T) => T)
