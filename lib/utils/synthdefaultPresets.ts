import type {
  AMSynthOptions,
  DuoSynthOptions,
  FMSynthOptions,
  MembraneSynthOptions,
  MetalSynthOptions,
  MonoSynthOptions,
  PluckSynthOptions,
} from "tone"

export const fmDefaultPreset = {
  harmonicity: 4,
  oscillator: {
    type: "sine",
  },
  modulationIndex: 10,
  volume: 0,
  envelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.3,
    release: 1.2,
    attackCurve: "exponential",
  },
  modulation: {
    type: "sawtooth",
    phase: 30,
  },
  modulationEnvelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.5,
    release: 0.1,
  },
} as FMSynthOptions

export const pluckDefaultPreset = {
  volume: -10,
  resonance: 0.9,
  dampening: 4000,
} as PluckSynthOptions

export const membraneDefaultPreset = {
  pitchDecay: 0.05,
  octaves: 10,
  volume: -10,
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0.01,
    release: 1.4,
    attackCurve: "exponential",
  },
} as MembraneSynthOptions

export const metalDefaultPreset = {
  detune: 5,
  volume: -8,
  envelope: {
    attack: 0.01,
    decay: 0.14,
    sustain: 0.2,
    releaseCurve: "bounce",
    release: 0.4,
  },
} as MetalSynthOptions

export const duoDefaultPreset = {
  detune: -10,
  harmonicity: 2,
  volume: -10,
  voice0: {
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.1,
      release: 0.1,
    },
    filter: {
      frequency: 2000,
      Q: 8,
    },
    filterEnvelope: {
      attack: 0.25,
      sustain: 0.05,
      release: 0.1,
    },
  },
  voice1: {
    filter: {
      frequency: 400,
      Q: 12,
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.1,
      release: 0.2,
    },
    filterEnvelope: {
      sustain: 0.05,
      release: 0.1,
    },
  },
} as DuoSynthOptions

export const monoDefaultPreset = {
  volume: 0,
  oscillator: {
    type: "sawtooth",
  },
  filter: {
    Q: 2,
    type: "bandpass",
    rolloff: -24,
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.2,
    release: 0.6,
  },
  filterEnvelope: {
    attack: 0.02,
    decay: 0.4,
    sustain: 1,
    release: 0.7,
    releaseCurve: "linear",
    baseFrequency: 20,
    octaves: 5,
  },
} as MonoSynthOptions

export const amDefaultPreset = {
  harmonicity: 2,
  volume: 10,
  oscillator: {
    type: "amsine2",
    modulationType: "sine",
    harmonicity: 1.01,
  },
  envelope: {
    attack: 0.006,
    decay: 4,
    sustain: 0.04,
    release: 1.2,
  },
  modulation: {
    volume: 15,
    type: "amsine2",
    modulationType: "sine",
    harmonicity: 12,
  },
  modulationEnvelope: {
    attack: 0.006,
    decay: 0.2,
    sustain: 0.2,
    release: 0.4,
  },
} as AMSynthOptions
