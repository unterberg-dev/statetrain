import { TRANSPORT_CONFIG } from "#lib/config"
import type { TransportType } from "#types/tone"

export const setTransportDefaults = (transport: TransportType) => {
  transport.loop = TRANSPORT_CONFIG.loop.default
  transport.loopEnd = `${TRANSPORT_CONFIG.loopLength.default}m`
  transport.bpm.value = TRANSPORT_CONFIG.bpm.default
  transport.timeSignature = TRANSPORT_CONFIG.timeSignature.default
}
