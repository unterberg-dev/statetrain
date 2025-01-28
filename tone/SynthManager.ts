// SynthManager.ts
import { EventEmitter } from "eventemitter3"
import { consola } from "consola/browser"
import type {
  AMSynth,
  AMSynthOptions,
  DuoSynth,
  DuoSynthOptions,
  MonoSynth,
  MonoSynthOptions,
  Synth,
  SynthOptions,
} from "tone"
import type { RecursivePartial } from "tone/build/esm/core/util/Interface"

import ToneManager from "#tone/ToneManager"

export type AvailableSynths = Synth | MonoSynth | AMSynth | DuoSynth

/**
 * Manages creation and management of Synth instances.
 */
class SynthManager {
  private static instance: SynthManager

  // Singleton Instance
  private constructor() {}

  public static getInstance(): SynthManager {
    if (!SynthManager.instance) {
      SynthManager.instance = new SynthManager()
    }
    return SynthManager.instance
  }

  // EventEmitter for synth-related events
  public emitter = new EventEmitter()

  /**
   * Create a new Synth instance routed to the destination.
   * @param options Tone.SynthOptions to configure the Synth
   * @returns Synth instance
   */
  public async createSynth(options?: RecursivePartial<SynthOptions>): Promise<Synth> {
    try {
      // Ensure Tone.js is initialized
      await ToneManager.init()

      const Tone = ToneManager.getTone()
      const synth = new Tone.Synth(options).toDestination()

      this.emitter.emit("synthCreated", synth)
      consola.info("Synth created successfully.")
      return synth
    } catch (error) {
      consola.error("Error creating Synth:", error)
      throw error
    }
  }

  /**
   * Create a new MonoSynth instance routed to the destination.
   * @param options Tone.MonoSynthOptions to configure the MonoSynth
   * @returns MonoSynth instance
   */
  public async createMonoSynth(options?: RecursivePartial<MonoSynthOptions>): Promise<MonoSynth> {
    try {
      // Ensure Tone.js is initialized
      await ToneManager.init()

      const Tone = ToneManager.getTone()
      const monoSynth = new Tone.MonoSynth(options).toDestination()

      this.emitter.emit("monoSynthCreated", monoSynth)
      consola.info("MonoSynth created successfully.")
      return monoSynth
    } catch (error) {
      consola.error("Error creating MonoSynth:", error)
      throw error
    }
  }

  /**
   * Create a new AMSynth instance routed to the destination.
   * @param options Tone.AMSynthOptions to configure the AMSynth
   * @returns AMSynth instance
   */
  public async createAMSynth(options?: RecursivePartial<AMSynthOptions>): Promise<AMSynth> {
    try {
      // Ensure Tone.js is initialized
      await ToneManager.init()

      const Tone = ToneManager.getTone()
      const amSynth = new Tone.AMSynth(options).toDestination()

      this.emitter.emit("amSynthCreated", amSynth)
      consola.info("AMSynth created successfully.")
      return amSynth
    } catch (error) {
      consola.error("Error creating AMSynth:", error)
      throw error
    }
  }

  public async createDuoSynth(options?: RecursivePartial<DuoSynthOptions>): Promise<DuoSynth> {
    try {
      // Ensure Tone.js is initialized
      await ToneManager.init()

      const Tone = ToneManager.getTone()
      const duoSynth = new Tone.DuoSynth(options).toDestination()

      this.emitter.emit("duoSynthCreated", duoSynth)
      consola.info("DuoSynth created successfully.")
      return duoSynth
    } catch (error) {
      consola.error("Error creating DuoSynth:", error)
      throw error
    }
  }
}

export default SynthManager.getInstance()
