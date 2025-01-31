import { APP_CONFIG } from "#lib/config"

const base = APP_CONFIG.viteUrl

export const internalLinks = {
  home: "/",
  synths: {
    amSynth: `${base}/am-synth/`,
    monoSynth: `${base}/mono-synth/`,
    duoSynth: `${base}/duo-synth/`,
    metalSynth: `${base}/metal-synth/`,
    membraneSynth: `${base}/membrane-synth/`,
    fmSynth: `${base}/fm-synth/`,
    // pluckSynth: `${base}/pluck-synth/`,
  },
}

export const externalLinks = {
  github: "https://github.com/unterberg-dev/statetrain",
  author: "https://unterberg.dev/",
}
