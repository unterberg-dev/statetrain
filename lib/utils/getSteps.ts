import ToneManager from "#tone/class/ToneManager"
import type { InternalTransportType } from "#types/tone"

export const getCurrentSixteenthStep = (totalSteps: number) => {
  if (!ToneManager.toneTransport) return 0

  const { ticks, PPQ } = ToneManager.toneTransport
  // 1 sixteenth note = PPQ/4 pulses (if PPQ=192, that’s 48 pulses)
  const sixteenthIndex = Math.floor(ticks / (PPQ / 4))

  // Use modulo to wrap around totalSteps
  // (Optional: subtract 1 if you want to highlight “just triggered” instead of “next” step)
  return sixteenthIndex % totalSteps
}

export const getCurrentQuarterStep = (transport: InternalTransportType, totalQuarterSteps: number) => {
  // By default, PPQ = 192 pulses per quarter note
  const quarterNotesPassed = Math.floor(transport.ticks / transport.PPQ)
  // Wrap around in a loop
  return quarterNotesPassed % totalQuarterSteps
}
