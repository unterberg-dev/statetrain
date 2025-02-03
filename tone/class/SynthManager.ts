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
  PolySynth,
  Synth,
  SynthOptions,
} from "tone"
import type { RecursivePartial } from "tone/build/esm/core/util/Interface"

import ToneManager from "#tone/class/ToneManager"
import EffectBus from "#tone/class/EffectBus"

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

  public createMetalSynth(options?: RecursivePartial<MetalSynthOptions>): PolySynth<MetalSynth> {
    const Tone = ToneManager.getTone()
    const synth = new Tone.PolySynth(Tone.MetalSynth, options)
    EffectBus.routeSynth(synth)
    return synth
  }

  public createMembraneSynth(options?: RecursivePartial<MembraneSynthOptions>): PolySynth<MembraneSynth> {
    const Tone = ToneManager.getTone()
    const synth = new Tone.PolySynth(Tone.MembraneSynth, options)
    EffectBus.routeSynth(synth)
    return synth
  }

  public createFMSynth(options?: RecursivePartial<FMSynthOptions>): PolySynth<FMSynth> {
    const Tone = ToneManager.getTone()
    const synth = new Tone.PolySynth(Tone.FMSynth, options).toDestination()
    EffectBus.routeSynth(synth)
    return synth
  }

  public createMonoSynth(options?: RecursivePartial<MonoSynthOptions>): PolySynth<MonoSynth> {
    const Tone = ToneManager.getTone()
    const synth = new Tone.PolySynth(Tone.MonoSynth, options)
    EffectBus.routeSynth(synth)
    return synth
  }

  public createAMSynth(options?: RecursivePartial<AMSynthOptions>): PolySynth<AMSynth> {
    const Tone = ToneManager.getTone()
    const synth = new Tone.PolySynth(Tone.AMSynth, options)
    EffectBus.routeSynth(synth)
    return synth
  }

  public createDuoSynth(options?: RecursivePartial<DuoSynthOptions>): PolySynth<DuoSynth> {
    const Tone = ToneManager.getTone()
    const synth = new Tone.PolySynth(Tone.DuoSynth, options)
    EffectBus.routeSynth(synth)
    return synth
  }
}

export default SynthManager.getInstance()
