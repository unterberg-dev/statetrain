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

import ToneManager from "#tone/class/ToneManager"

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
  public createSynth(options?: RecursivePartial<SynthOptions>): Synth {
    const Tone = ToneManager.getTone()
    const synth = new Tone.Synth(options).toDestination()

    this.emitter.emit("synthCreated", synth)
    consola.info("Synth created successfully.")
    return synth
  }

  /**
   * Create a new MonoSynth instance routed to the destination.
   * @param options Tone.MonoSynthOptions to configure the MonoSynth
   * @returns MonoSynth instance
   */
  public createMonoSynth(options?: RecursivePartial<MonoSynthOptions>): MonoSynth {
    const Tone = ToneManager.getTone()
    const monoSynth = new Tone.MonoSynth(options).toDestination()

    this.emitter.emit("monoSynthCreated", monoSynth)
    consola.info("MonoSynth created successfully.")
    return monoSynth
  }

  /**
   * Create a new AMSynth instance routed to the destination.
   * @param options Tone.AMSynthOptions to configure the AMSynth
   * @returns AMSynth instance
   */
  public createAMSynth(options?: RecursivePartial<AMSynthOptions>): AMSynth {
    const Tone = ToneManager.getTone()
    const amSynth = new Tone.AMSynth(options).toDestination()

    this.emitter.emit("amSynthCreated", amSynth)
    consola.info("AMSynth created successfully.")
    return amSynth
  }

  public createDuoSynth(options?: RecursivePartial<DuoSynthOptions>): DuoSynth {
    const Tone = ToneManager.getTone()
    const duoSynth = new Tone.DuoSynth(options).toDestination()

    this.emitter.emit("duoSynthCreated", duoSynth)
    consola.info("DuoSynth created successfully.")
    return duoSynth
  }
}

export default SynthManager.getInstance()
