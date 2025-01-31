import { EventEmitter } from "eventemitter3"
import { consola } from "consola/browser"

import type { InternalToneType, InternalTransportType } from "#types/tone"
import { TRANSPORT_CONFIG } from "#lib/config"
import { StepSequencer } from "#tone/class/StepSequencer"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import SynthManager from "#tone/class/SynthManager"
import {
  sequencer1DefaultMeasures,
  sequencer2DefaultMeasures,
  sequencer3DefaultMeasures,
  sequencer4DefaultMeasures,
} from "#lib/defaultSteps"
import {
  amDefaultPreset,
  duoDefaultPreset,
  fmDefaultPreset,
  membraneDefaultPreset,
  metalDefaultPreset,
  monoDefaultPreset,
  pluckDefaultPreset,
} from "#utils/synthdefaultPresets"

interface TransportSettings {
  bpm?: number
  timeSignature?: number
  loopLength?: number
}

/**
 * Manages loading Tone.js and exposes shared Tone resources.
 */
class ToneManager {
  private static instance: ToneManager

  // Singleton & initialization tracking
  private constructor() {}
  public static getInstance(): ToneManager {
    if (!ToneManager.instance) {
      ToneManager.instance = new ToneManager()
    }
    return ToneManager.instance
  }

  private initPromise: Promise<void> | undefined
  public isInitialized = false

  // Tone.js library references
  private toneCore: InternalToneType | undefined
  public toneTransport: InternalTransportType | undefined

  // Scheduler IDs for repeated callbacks
  private quarterNoteRepeatId?: number
  private sixteenthNoteRepeatId?: number

  // Current transport state
  public currentBpm = TRANSPORT_CONFIG.bpm.default
  public currentTimeSignature = TRANSPORT_CONFIG.timeSignature.default
  public currentLoopLength = TRANSPORT_CONFIG.loopLength.default // e.g. 4 bars

  // Derived for reference (e.g. UI)
  public totalQuarterNotes = this.currentTimeSignature * this.currentLoopLength
  public totalSixteenthNotes = this.currentTimeSignature * 4 * this.currentLoopLength

  // add sequencers
  private amSynthSequencer: StepSequencer | null = null
  private monoSynthSequencer: StepSequencer | null = null
  private duoSynthSequencer: StepSequencer | null = null
  private metalSynthSequencer: StepSequencer | null = null
  private membraneSynthSequencer: StepSequencer | null = null
  private fmSynthSequencer: StepSequencer | null = null
  private pluckSynthSequencer: StepSequencer | null = null

  // Global EventEmitter
  public emitter = new EventEmitter()

  /**
   * Dynamic import and initialization of Tone.js
   */
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
          this.toneCore = ToneModule
          this.toneTransport = this.toneCore.getTransport()
          this.isInitialized = true

          consola.success("Tone.js initialized successfully (dynamic import).")
          this.emitter.emit("initialized")

          resolve()
        } catch (error) {
          consola.error("Error initializing Tone.js (dynamic import):", error)
          reject(error)
        } finally {
          this.initPromise = undefined
        }
      }
      void initialize()
    })

    return this.initPromise
  }

  public initializeSequencer(measureCount?: number): void {
    if (!this.isInitialized) {
      throw new Error("Tone.js is not yet initialized.")
    }

    if (!this.amSynthSequencer) {
      consola.info("Initializing StepSequencer 1 with measureCount:", measureCount)
      this.amSynthSequencer = new StepSequencer(sequencer1DefaultMeasures, [], false)
      this.amSynthSequencer.initializeSynth(SynthManager.createAMSynth(amDefaultPreset))
      this.amSynthSequencer.registerTransportCallback()
    }

    if (!this.monoSynthSequencer) {
      consola.info("Initializing StepSequencer 2 with measureCount:", measureCount)
      this.monoSynthSequencer = new StepSequencer(sequencer2DefaultMeasures, [], false)
      this.monoSynthSequencer.initializeSynth(SynthManager.createMonoSynth(monoDefaultPreset))
      this.monoSynthSequencer.registerTransportCallback()
    }

    if (!this.duoSynthSequencer) {
      consola.info("Initializing StepSequencer 3 with measureCount:", measureCount)
      this.duoSynthSequencer = new StepSequencer(sequencer3DefaultMeasures, [], false)
      this.duoSynthSequencer.initializeSynth(SynthManager.createDuoSynth(duoDefaultPreset))
      this.duoSynthSequencer.registerTransportCallback()
    }

    if (!this.metalSynthSequencer) {
      consola.info("Initializing StepSequencer 4 with measureCount:", measureCount)
      this.metalSynthSequencer = new StepSequencer(sequencer4DefaultMeasures, [], false)
      this.metalSynthSequencer.initializeSynth(SynthManager.createMetalSynth(metalDefaultPreset))
      this.metalSynthSequencer.registerTransportCallback()
    }

    if (!this.membraneSynthSequencer) {
      consola.info("Initializing StepSequencer 5 with measureCount:", measureCount)
      this.membraneSynthSequencer = new StepSequencer(sequencer4DefaultMeasures, [], false)
      this.membraneSynthSequencer.initializeSynth(SynthManager.createMembraneSynth(membraneDefaultPreset))
      this.membraneSynthSequencer.registerTransportCallback()
    }

    if (!this.fmSynthSequencer) {
      consola.info("Initializing StepSequencer 6 with measureCount:", measureCount)
      this.fmSynthSequencer = new StepSequencer(sequencer4DefaultMeasures, [], false)
      this.fmSynthSequencer.initializeSynth(SynthManager.createFMSynth(fmDefaultPreset))
      this.fmSynthSequencer.registerTransportCallback()
    }

    if (!this.pluckSynthSequencer) {
      consola.info("Initializing StepSequencer 7 with measureCount:", measureCount)
      this.pluckSynthSequencer = new StepSequencer(sequencer4DefaultMeasures, [])
      this.pluckSynthSequencer.initializeSynth(SynthManager.createPluckSynth(pluckDefaultPreset))
      this.pluckSynthSequencer.registerTransportCallback()
    }
  }

  public getAmSynth() {
    return this.amSynthSequencer
  }
  public getMonoSynth() {
    return this.monoSynthSequencer
  }
  public getDuoSynth() {
    return this.duoSynthSequencer
  }
  public getMetalSynth() {
    return this.metalSynthSequencer
  }
  public getMembraneSynth() {
    return this.membraneSynthSequencer
  }
  public getFmSynth() {
    return this.fmSynthSequencer
  }
  public getPluckSynth() {
    return this.pluckSynthSequencer
  }

  /**
   * Returns the raw Tone module (Tone.js) for direct usage
   */
  public getTone(): InternalToneType {
    if (!this.toneCore) {
      throw new Error("Tone.js is not yet initialized.")
    }
    return this.toneCore
  }

  /**
   * Configure the transport using provided settings,
   * or fall back to current values.
   */
  public configureTransport({ bpm, timeSignature, loopLength }: TransportSettings = {}): void {
    if (!this.toneTransport) return

    const newBpm = bpm ?? this.currentBpm
    const newTimeSig = timeSignature ?? this.currentTimeSignature
    const newLoopLength = loopLength ?? this.currentLoopLength

    this.toneTransport.bpm.value = Math.floor(newBpm)
    this.toneTransport.timeSignature = Math.floor(newTimeSig)
    this.toneTransport.loopEnd = `${Math.floor(newLoopLength)}m`

    this.currentBpm = newBpm
    this.currentTimeSignature = newTimeSig
    this.currentLoopLength = newLoopLength as SequencerMeasuresValue

    this.totalQuarterNotes = this.currentTimeSignature * this.currentLoopLength
    this.totalSixteenthNotes = this.currentTimeSignature * 4 * this.currentLoopLength

    consola.info("[ToneManager] configureTransport:", {
      bpm: this.toneTransport.bpm.value,
      timeSignature: this.toneTransport.timeSignature,
      loopEnd: this.toneTransport.loopEnd,
    })
  }

  /**
   * Start the transport and schedule repeated "tick" events.
   */
  public register(): void {
    if (!this.isInitialized || !this.toneTransport || !this.toneCore) {
      consola.warn("Cannot start playback. Tone.js is not initialized.")
      return
    }

    this.initializeSequencer(this.currentLoopLength)
    this.configureTransport()

    // Clear any previous schedules
    if (this.quarterNoteRepeatId !== undefined) {
      this.toneTransport.clear(this.quarterNoteRepeatId)
    }
    if (this.sixteenthNoteRepeatId !== undefined) {
      this.toneTransport.clear(this.sixteenthNoteRepeatId)
    }

    // Schedule repeating "tick" events
    this.quarterNoteRepeatId = this.toneTransport.scheduleRepeat(
      (time) => {
        this.toneCore?.getDraw().schedule(() => {
          this.emitter.emit("quarterTick", { time })
        }, time)
      },
      "4n",
      "4n",
    )

    this.sixteenthNoteRepeatId = this.toneTransport.scheduleRepeat(
      (time) => {
        this.toneCore?.getDraw().schedule(() => {
          this.emitter.emit("sixteenthTick", { time })
        }, time)
      },
      "16n",
      "0",
    )

    consola.info("Transport registered.")
  }

  public start(): void {
    if (!this.isInitialized || !this.toneTransport) {
      consola.warn("Cannot start playback. Tone.js is not initialized.")
      return
    }
    this.toneTransport.start()
    consola.info("Transport started.")
  }

  /**
   * Stop the transport and clear the repeated "tick" events.
   */
  public stop(): void {
    if (!this.isInitialized || !this.toneTransport) {
      consola.warn("Cannot stop playback. Tone.js is not initialized.")
      return
    }
    this.toneTransport.stop()

    if (this.quarterNoteRepeatId !== undefined) {
      this.toneTransport.clear(this.quarterNoteRepeatId)
      this.quarterNoteRepeatId = undefined
    }
    if (this.sixteenthNoteRepeatId !== undefined) {
      this.toneTransport.clear(this.sixteenthNoteRepeatId)
      this.sixteenthNoteRepeatId = undefined
    }

    consola.info("Transport stopped.")
    this.emitter.emit("playbackStopped")
  }

  /**
   * Convenience method to update BPM and fire event.
   */
  public updateBpm(value: number): void {
    if (!this.isInitialized || !this.toneTransport) {
      consola.warn("Cannot update BPM. Tone.js is not initialized.")
      return
    }
    if (value <= TRANSPORT_CONFIG.bpm.max && value >= TRANSPORT_CONFIG.bpm.min) {
      this.configureTransport({ bpm: value })
      this.emitter.emit("bpmChanged", value)
    }
  }

  /**
   * Convenience method to update the time signature and fire event.
   */
  public updateTimeSignature(value: number): void {
    if (!this.isInitialized || !this.toneTransport) {
      consola.warn("Cannot update time signature. Tone.js is not initialized.")
      return
    }
    if (value <= TRANSPORT_CONFIG.timeSignature.max && value >= TRANSPORT_CONFIG.timeSignature.min) {
      this.configureTransport({ timeSignature: value })
      this.emitter.emit("timeSignatureChanged", value)
      consola.info("Time signature changed to:", value)
    }
  }
}

export default ToneManager.getInstance()
