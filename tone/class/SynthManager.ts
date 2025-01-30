import { EventEmitter } from "eventemitter3"
import type {
  AMSynth,
  AMSynthOptions,
  DuoSynth,
  DuoSynthOptions,
  FMSynth,
  FMSynthOptions,
  MembraneSynth,
  MembraneSynthOptions,
  MetalSynth,
  MetalSynthOptions,
  MonoSynth,
  MonoSynthOptions,
  PluckSynth,
  PluckSynthOptions,
  PolySynth,
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
   * @deprecated Just for testing
   */
  public createSynth(options?: RecursivePartial<SynthOptions>): PolySynth<Synth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.Synth, options).toDestination()
  }

  // only monophonic
  public createPluckSynth(options?: RecursivePartial<PluckSynthOptions>): PluckSynth {
    const Tone = ToneManager.getTone()
    return new Tone.PluckSynth(options).toDestination()
  }

  public createMetalSynth(options?: RecursivePartial<MetalSynthOptions>): PolySynth<MetalSynth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.MetalSynth, options).toDestination()
  }

  public createMembraneSynth(options?: RecursivePartial<MembraneSynthOptions>): PolySynth<MembraneSynth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.MembraneSynth, options).toDestination()
  }

  public createFMSynth(options?: RecursivePartial<FMSynthOptions>): PolySynth<FMSynth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.FMSynth, options).toDestination()
  }

  public createMonoSynth(options?: RecursivePartial<MonoSynthOptions>): PolySynth<MonoSynth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.MonoSynth, options).toDestination()
  }

  public createAMSynth(options?: RecursivePartial<AMSynthOptions>): PolySynth<AMSynth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.AMSynth, options).toDestination()
  }

  public createDuoSynth(options?: RecursivePartial<DuoSynthOptions>): PolySynth<DuoSynth> {
    const Tone = ToneManager.getTone()
    return new Tone.PolySynth(Tone.DuoSynth, options).toDestination()
  }
}

export default SynthManager.getInstance()
