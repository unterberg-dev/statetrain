// src/tone/ToneManager.ts
import type { TransportType } from "#types/tone"
import { consola } from "consola/browser"
import type { Synth as ToneSynth } from "tone"

/**
 * We'll store the type references of Tone objects (like 'ToneTransport') and
 * only dynamically import them at runtime. So we don't import 'tone' at the top-level.
 */
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

  /**
   * Initializes Tone.js dynamically. Ensures it's only initialized once and only after user gesture.
   */
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
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
    this.initPromise = new Promise<void>(async (resolve, reject) => {
      try {
        consola.start("Dynamically importing Tone.js...")

        // Dynamically import Tone.js only now (after user gesture).
        // This ensures no AudioContext is created until init is called.
        const ToneModule = await import("tone")

        // 'default' might be undefined depending on how the bundler exports it,
        // so we handle both possibilities.
        this.Tone = ToneModule

        // Now we can access all Tone objects through this.Tone
        this.Transport = this.Tone?.getTransport()
        this.Synth = this.Tone.Synth

        // (Optional) Starting the AudioContext in some browsers
        // requires a user gesture. If you want to do that explicitly,
        // you can do: await this.Tone.start();

        this.Transport.bpm.value = 120 // Set default BPM
        this.isInitialized = true

        consola.success("Tone.js initialized successfully (dynamic import).")
        resolve()
      } catch (error) {
        consola.error("Error initializing Tone.js (dynamic import):", error)
        reject(error)
      } finally {
        this.initPromise = undefined
      }
    })

    return this.initPromise
  }

  /**
   * Starts the Tone.js Transport.
   */
  public startTransport() {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot start Transport. Tone.js is not initialized.")
      return
    }
    this.Transport.start()
    consola.info("Transport started.")
  }

  /**
   * Stops the Tone.js Transport.
   */
  public stopTransport() {
    if (!this.isInitialized || !this.Transport) {
      consola.warn("Cannot stop Transport. Tone.js is not initialized.")
      return
    }
    this.Transport.stop()
    consola.info("Transport stopped.")
  }

  /**
   * Retrieves the current state of the Transport.
   * @returns {string} The current state ('started', 'stopped', 'paused').
   */
  public getTransportState(): string {
    if (!this.isInitialized || !this.Transport) {
      return "stopped"
    }
    return this.Transport.state
  }

  /**
   * Creates and returns a new Synth instance (e.g., Tone.Synth()).
   */
  public createSynth() {
    if (!this.isInitialized || !this.Synth) {
      throw new Error("Cannot create Synth. Tone.js is not initialized.")
    }
    return new this.Synth().toDestination()
  }
}

export default ToneManager.getInstance()
