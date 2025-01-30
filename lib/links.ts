import { APP_CONFIG } from "#lib/config"

const base = APP_CONFIG.viteUrl

export const internalLinks = {
  home: "/",
  synths: {
    amSynth: `${base}/am-synth/`,
    monoSynth: `${base}/mono-synth/`,
    membraneSynth: `${base}/membrane-synth/`,
    duoSynth: `${base}/duo-synth/`,
  },
}

export const externalLinks = {
  github: "https://github.com/unterberg-dev/statetrain",
  author: "https://unterberg.dev/",
}
