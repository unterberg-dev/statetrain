import type { TransportConfigType } from "#types/tone"

export const APP_CONFIG = {
  viteUrl: `${import.meta.env.BASE_URL}`,
  transition: {
    tw: "duration-350 ease-out",
    twShort: "duration-125 ease-out",
    time: 350,
    timeShort: 125,
    ease: "ease-out",
  },
}

export const TRANSPORT_CONFIG: TransportConfigType = {
  bpm: {
    default: 115,
    min: 60,
    max: 240,
  },
  loop: {
    default: true,
  },
  timeSignature: {
    default: 4,
    min: 2,
    max: 8,
  },
  loopLength: {
    default: 4,
    min: 1,
    max: 8,
  },
  isPlaying: false,
}
