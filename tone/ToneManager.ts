import { EventEmitter } from "eventemitter3"
import { consola } from "consola/browser"
import type { Synth as ToneSynth } from "tone"
import type { TransportType } from "#types/tone"
import { TRANSPORT_CONFIG } from "#lib/config"

interface SetupTransportOptions {
  bpm?: number
  timeSignature?: number
  loopLength?: number
}

class ToneManager {
  private static instance: ToneManager
  public isInitialized = false
  private initPromise: Promise<void> | undefined

  private Tone: typeof import("tone") | undefined
  public Transport: TransportType | undefined
  public Synth: typeof ToneSynth | undefined

  // Keep track of the scheduled repeat ID if we want to stop/clear it
  private transportTickId?: number

  // Maintain internal transport state - setup defaults
  public internalBpm = TRANSPORT_CONFIG.bpm.default
  public internalTimeSignature = TRANSPORT_CONFIG.timeSignature.default
  public internalLoopLength = TRANSPORT_CONFIG.loopLength.default

  // 1) Our global emitter
  public events = new EventEmitter()

  private constructor() {
    // Private to enforce singleton
  }

  public static getInstance(): ToneManager {
    if (!ToneManager.instance) {
      ToneManager.instance = new ToneManager()
    }
    return ToneManager.instance
  }

  public async init(): Promise<void> {
    if (this.isInitialized) {
      consola.warn("Tone.js is already initialized.")
      return
    }
    if (this.initPromise) {
      consola.info("Tone.js initialization is in progress.")
      return this.initPromise
    }
    this.initPromise = new Promise<void>((resolve, reject) => {
      const initialize = async () => {
        try {
          const ToneModule = await import("tone")
          this.Tone = ToneModule

          this.Transport = this.Tone.getTransport()
          this.Synth = this.Tone.Synth

          this.isInitialized = true
          consola.success("Tone.js initialized successfully (dynamic import).")

          // Possibly emit an event so React knows
          this.events.emit("initialized")

          resolve()
        } catch (error) {
          consola.error("Error initializing Tone.js (dynamic import):", error)
          reject(error)
        } finally {
          this.initPromise = undefined
        }
      }
      initialize()
    })
    return this.initPromise
  }

  /** Helper to set transport parameters */
  public setTransport({ bpm, timeSignature, loopLength }: SetupTransportOptions = {}) {
    if (!this.Transport) return

    this.Transport.bpm.value = Math.floor(bpm || this.internalBpm)
    this.Transport.timeSignature = Math.floor(timeSignature || this.internalTimeSignature)
    this.Transport.loopEnd = `${Math.floor(loopLength || this.internalLoopLength)}m`

    if (bpm) this.internalBpm = bpm
    if (timeSignature) this.internalTimeSignature = timeSignature
    if (loopLength) this.internalLoopLength = loopLength

    console.log("[ToneManager] Setting transport:", {
      bpm: this.Transport.bpm.value,
      timeSignature: this.Transport.timeSignature,
      loopLength: this.Transport.loopEnd,
    })
  }

  /** Start the Transport and schedule repeated "tick" events */
  public startTransport() {
    if (!this.isInitialized || !this.Transport || !this.Tone) {
      consola.warn("Cannot start Transport. Tone.js is not initialized.")
      return
    }

    // Set initial config
    this.setTransport()

    // For safety, clear old schedule
    if (this.transportTickId !== undefined) {
      this.Transport.clear(this.transportTickId)
    }

    // 2) Schedule repeating "tick" events every quarter note, for example
    this.transportTickId = this.Transport.scheduleRepeat(
      (time) => {
        // Use Tone.Draw so the callback fires at the right time for UI updates
        this.Tone?.getDraw().schedule(() => {
          // Our “bus” emits a custom event “transportTick”
          this.events.emit("transportTick", { time })
        }, time)
      },
      "4n",
      "4n",
    )

    this.Transport.start()
    consola.info("Transport started.")

    // Possibly emit an event to let React know we started
    this.events.emit("transportStart")
  }

  /** Stop the Transport and clear the repeated "tick" event. */
  public stopTransport() {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot stop Transport. Tone.js is not initialized.")
      return
    }
    this.Transport.stop()

    if (this.transportTickId !== undefined) {
      this.Transport.clear(this.transportTickId)
      this.transportTickId = undefined
    }
    consola.info("Transport stopped.")

    this.events.emit("transportStop")
  }

  public createSynth() {
    if (!this.isInitialized || !this.Synth) {
      throw new Error("Cannot create Synth. Tone.js is not initialized.")
    }
    return new this.Synth().toDestination()
  }

  public setBpm(value: number) {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot set BPM. Tone.js is not initialized.")
      return
    }
    if (value <= TRANSPORT_CONFIG.bpm.max && value >= TRANSPORT_CONFIG.bpm.min) {
      this.setTransport({ bpm: value })
      this.events.emit("bpmChanged", value)
    }
  }

  public setTimeSignature(value: number) {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot set time signature. Tone.js is not initialized.")
      return
    }

    if (value <= TRANSPORT_CONFIG.timeSignature.max && value >= TRANSPORT_CONFIG.timeSignature.min) {
      this.setTransport({ timeSignature: value })
      this.events.emit("timeSignatureChanged", value)
    }
  }
}

export default ToneManager.getInstance()
