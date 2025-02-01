import ToneManager from "#tone/class/ToneManager"
import type { AvailableSynths } from "#types/tone"
import consola from "consola"
import type { Reverb, PingPongDelay, Gain, Filter, FeedbackDelay, Player, Sampler } from "tone"

class EffectBus {
  private static instance: EffectBus
  private reverb: Reverb | null = null
  private pingPongDelay: PingPongDelay | null = null
  private feedbackDelay: FeedbackDelay | null = null
  private lowCutFilter: Filter | null = null
  private isInitialized = false
  private synthWetGains: Map<AvailableSynths, { reverb: Gain; delay: Gain }> = new Map()
  private playerWetGains: Map<Player | Sampler, { reverb: Gain; delay: Gain }> = new Map()

  private constructor() {}

  public static getInstance(): EffectBus {
    if (!EffectBus.instance) {
      EffectBus.instance = new EffectBus()
    }
    return EffectBus.instance
  }

  /**
   * Initializes the EffectBus **after** ToneManager is ready.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      consola.warn("[EffectBus] Already initialized.")
      return
    }

    if (!ToneManager.isInitialized) {
      consola.info("[EffectBus] Waiting for ToneManager to initialize...")
      await ToneManager.init()
    }

    const Tone = ToneManager.getTone()

    this.lowCutFilter = new Tone.Filter({
      type: "highpass",
      frequency: 350,
      Q: 1,
    })

    this.reverb = new Tone.Reverb({
      decay: 4,
      preDelay: 0.2,
    })
      .connect(this.lowCutFilter)
      .toDestination()

    this.pingPongDelay = new Tone.PingPongDelay("4n", 0.3).connect(this.lowCutFilter).toDestination()

    this.feedbackDelay = new Tone.FeedbackDelay("8n.", 0.5).connect(this.lowCutFilter).toDestination()

    this.updateDelayTime()

    this.isInitialized = true
    consola.success("[EffectBus] Initialized with reverb, delay, and low-cut filter.")

    // Listen for BPM changes to update the delay time dynamically
    ToneManager.toneTransport?.on("ticks", this.updateDelayTime.bind(this))
  }

  /**
   * Routes a synth through the effect bus with individual wet mix control for reverb & delay.
   * @param synth - The synth instance to route.
   * @param reverbMix - Initial reverb mix (0-1).
   * @param delayMix - Initial delay mix (0-1).
   */
  public routeSynth(synth: AvailableSynths, reverbMix = 0, delayMix = 0): void {
    if (!this.isInitialized || !this.reverb || !this.pingPongDelay || !this.feedbackDelay) {
      consola.warn("[EffectBus] Not initialized yet. Queueing synth routing.")
      return
    }
    synth.disconnect()
    if (!this.synthWetGains.has(synth)) {
      const Tone = ToneManager.getTone()
      const reverbGain = new Tone.Gain(reverbMix)
      const delayGain = new Tone.Gain(delayMix)

      synth.connect(reverbGain)
      reverbGain.connect(this.reverb)

      synth.connect(delayGain)
      delayGain.connect(this.pingPongDelay)
      delayGain.connect(this.feedbackDelay)

      this.synthWetGains.set(synth, { reverb: reverbGain, delay: delayGain })
    }

    synth.toDestination()
  }

  /**
   * Routes a player or sampler through the effect bus with individual wet mix control for reverb & delay.
   * @param player - The player instance to route.
   * @param reverbMix - Initial reverb mix (0-1).
   * @param delayMix - Initial delay mix (0-1).
   */
  public routePlayer(player: Player | Sampler, reverbMix = 0, delayMix = 0): void {
    if (!this.isInitialized || !this.reverb || !this.pingPongDelay || !this.feedbackDelay) {
      consola.warn("[EffectBus] Not initialized yet. Queueing player routing.")
      return
    }

    player.disconnect()
    if (!this.playerWetGains.has(player)) {
      const Tone = ToneManager.getTone()
      const reverbGain = new Tone.Gain(reverbMix)
      const delayGain = new Tone.Gain(delayMix)

      player.connect(reverbGain)
      reverbGain.connect(this.reverb)

      player.connect(delayGain)
      delayGain.connect(this.pingPongDelay)
      delayGain.connect(this.feedbackDelay)

      this.playerWetGains.set(player, { reverb: reverbGain, delay: delayGain })
    }

    player.toDestination()
  }

  /**
   * Updates the **reverb wet mix** level for a specific synth.
   * @param synth - The target synth.
   * @param wetMix - The new reverb level (0 - 1).
   */
  public updateSynthReverbMix(synth: AvailableSynths, wetMix: number): void {
    const wetGains = this.synthWetGains.get(synth)
    if (wetGains) {
      wetGains.reverb.gain.value = wetMix
      consola.info(`[EffectBus] Updated reverb mix for synth to ${wetMix}`)
    } else {
      consola.warn("[EffectBus] Synth not routed yet, cannot update reverb mix.")
    }
  }

  /**
   * Updates the **delay wet mix** level for a specific synth.
   * @param synth - The target synth.
   * @param wetMix - The new delay level (0 - 1).
   */
  public updateSynthDelayMix(synth: AvailableSynths, wetMix: number): void {
    const wetGains = this.synthWetGains.get(synth)
    if (wetGains) {
      wetGains.delay.gain.value = wetMix
      consola.info(`[EffectBus] Updated delay mix for synth to ${wetMix}`)
    } else {
      consola.warn("[EffectBus] Synth not routed yet, cannot update delay mix.")
    }
  }

  public updateDelayTime(): void {
    if (!this.pingPongDelay || !this.feedbackDelay || !ToneManager.toneTransport) return

    const bpm = ToneManager.toneTransport.bpm.value
    const beatTimeQuarter = ToneManager.getTone().Time("4n").toSeconds() // 8th note duration
    const beatTimeEigthsDotted = ToneManager.getTone().Time("8n.").toSeconds() // Dotted 8th note duration

    // only change the calculated new delay time has changed
    if (this.pingPongDelay.delayTime.value === beatTimeQuarter) return

    this.pingPongDelay.delayTime.value = beatTimeQuarter
    this.feedbackDelay.delayTime.value = beatTimeEigthsDotted

    consola.info(`[EffectBus] Synced delay time to BPM ${bpm}`)
  }
}

export default EffectBus.getInstance()
