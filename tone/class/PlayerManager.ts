import EffectBus from "#tone/class/EffectBus"
import ToneManager from "#tone/class/ToneManager"
import type { Player, PlayerOptions } from "tone"

class PlayerManager {
  private static instance: PlayerManager
  private constructor() {}

  public static getInstance(): PlayerManager {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager()
    }
    return PlayerManager.instance
  }

  public createPlayer(options: Partial<PlayerOptions>): Player {
    const Tone = ToneManager.getTone()
    const player = new Tone.Player(options)
    EffectBus.routePlayer(player)
    return new Tone.Player(options).toDestination()
  }
}

export default PlayerManager.getInstance()
