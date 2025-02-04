import { APP_CONFIG } from "#lib/config"
import { SequencerKey } from "#lib/constants"

const base = APP_CONFIG.viteUrl

export const internalLinks = {
  home: {
    url: `${base}/`,
    title: "Mixer / Overview",
  },
  toneBroken: {
    url: `${base}/tone-crashed/`,
    title: "Tone is broken",
  },
  synths: {
    amSynth: {
      key: SequencerKey.AM,
      url: `${base}/am-synth/`,
      title: "AM Synth",
    },
    monoSynth: {
      key: SequencerKey.Mono,
      url: `${base}/mono-synth/`,
      title: "Mono Synth",
    },
    duoSynth: {
      key: SequencerKey.Duo,
      url: `${base}/duo-synth/`,
      title: "Duo Synth",
    },
    metalSynth: {
      key: SequencerKey.Metal,
      url: `${base}/metal-synth/`,
      title: "Metal Synth",
    },
    membraneSynth: {
      key: SequencerKey.Membrane,
      url: `${base}/membrane-synth/`,
      title: "Membrane Synth",
    },
    fmSynth: {
      key: SequencerKey.FM,
      url: `${base}/fm-synth/`,
      title: "FM Synth",
    },
    // pluckSynth: `${base}/pluck-synth/`,
  },
}

export const externalLinks = {
  github: "https://github.com/unterberg-dev/statetrain",
  author: "https://unterberg.dev/",
}
