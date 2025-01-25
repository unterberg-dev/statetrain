// src/tone/ToneManager.ts
import { TRANSPORT_CONFIG } from "#lib/config"
import type { TransportType } from "#types/tone"
import { consola } from "consola/browser"
import type { Synth as ToneSynth } from "tone"

class ToneManager {
  private static instance: ToneManager
  public isInitialized = false
  private initPromise: Promise<void> | undefined = undefined

  // Store references to Tone classes/objects after dynamic import
  private Tone: typeof import("tone") | undefined = undefined

  // We'll keep references for convenience
  public Transport: TransportType | undefined = undefined
  public Synth: typeof ToneSynth | undefined = undefined

  private constructor() {}

  public static getInstance(): ToneManager {
    if (!ToneManager.instance) {
      ToneManager.instance = new ToneManager()
    }
    return ToneManager.instance
  }

  private setupTransport() {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot setup Transport. Tone.js is not initialized.")
      return
    }
    this.Transport.bpm.value = TRANSPORT_CONFIG.bpm.default
    this.Transport.timeSignature = TRANSPORT_CONFIG.timeSignature.default
    this.Transport.loopEnd = `${TRANSPORT_CONFIG.loopLength.default}m`
  }

  public async init(): Promise<void> {
    if (this.isInitialized) {
      consola.warn("Tone.js is already initialized.")
      return
    }

    if (this.initPromise) {
      consola.info("Tone.js initialization is already in progress.")
      return this.initPromise
    }

    // Create a promise so if multiple calls come in while initialization is in progress,
    // they await the same promise rather than re-initializing.
    this.initPromise = new Promise<void>((resolve, reject) => {
      const initialize = async () => {
        try {
          const ToneModule = await import("tone")
          this.Tone = ToneModule

          // Now we can access all Tone objects through this.Tone
          this.Transport = this.Tone?.getTransport()
          this.setupTransport()
          this.Synth = this.Tone.Synth

          this.isInitialized = true
          consola.success("Tone.js initialized successfully (dynamic import).")
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

  public startTransport() {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot start Transport. Tone.js is not initialized.")
      return
    }
    this.Transport.start()
    consola.info("Transport started.")
  }

  public stopTransport() {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot stop Transport. Tone.js is not initialized.")
      return
    }
    this.Transport.stop()
    consola.info("Transport stopped.")
  }

  public getTransportState(): string {
    if (!this.isInitialized || !this.Transport) {
      return "stopped"
    }
    return this.Transport.state
  }

  public createSynth() {
    if (!this.isInitialized || !this.Synth) {
      throw new Error("Cannot create Synth. Tone.js is not initialized.")
    }
    return new this.Synth().toDestination()
  }

  public setTimeSignature(value: number) {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot set time signature. Tone.js is not initialized.")
      return
    }
    this.Transport.timeSignature = value
  }

  public setBpm(value: number) {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot set BPM. Tone.js is not initialized.")
      return
    }
    if (value && value <= TRANSPORT_CONFIG.bpm.max && value >= TRANSPORT_CONFIG.bpm.min) {
      this.Transport.bpm.value = value
    }
  }
}

export default ToneManager.getInstance()
