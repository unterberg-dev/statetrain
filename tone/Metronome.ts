import { consola } from "consola/browser"
import type { SynthOptions } from "tone"
import type { RecursivePartial } from "tone/build/esm/core/util/Interface"

import SynthManager from "#tone/SynthManager"
import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"

class Metronome {
  private static instance: Metronome

  /** IDs for scheduled repeat events in Tone.js */
  private quarterNoteScheduleId?: number
  private measureScheduleId?: number

  /** Synths used for quarter-note click and measure-downbeat click */
  private quarterSynth?: SynthType
  private measureSynth?: SynthType

  /** Tracks if the metronome has started scheduling events */
  private isPlaying = false

  private constructor() {
    // Reconfigure if time signature changes
    ToneManager.emitter.on("timeSignatureChanged", this.handleTimeSignatureChanged.bind(this))
  }

  public static getInstance(): Metronome {
    if (!Metronome.instance) {
      Metronome.instance = new Metronome()
    }
    return Metronome.instance
  }

  /** Create synth instances; call after ToneManager is initialized. */
  public async initialize(): Promise<void> {
    if (!ToneManager.isInitialized) {
      throw new Error("[Metronome] Tone.js not initialized. Call ToneManager.init() first.")
    }

    const sharedOptions = {
      envelope: {
        sustain: 0.3,
      },
      oscillator: {
        type: "sine3",
      },
    } as RecursivePartial<SynthOptions>

    this.quarterSynth = await SynthManager.createSynth(sharedOptions)
    this.measureSynth = await SynthManager.createSynth(sharedOptions)
  }

  /** If the time signature changes, re-register schedules if currently playing. */
  private handleTimeSignatureChanged(): void {
    if (this.isPlaying) {
      this.start()
    }
  }

  /**
   * Start scheduling the metronome clicks.
   * (Clears existing schedules first to avoid duplicates.)
   */
  public start(): void {
    // Stop any active schedules
    this.stop()

    if (!ToneManager.isInitialized) {
      consola.warn("[Metronome] ToneManager is not initialized.")
      return
    }
    if (!this.quarterSynth || !this.measureSynth) {
      consola.warn("[Metronome] Synths not created. Call initialize() first.")
      return
    }
    if (this.isPlaying) {
      consola.warn("[Metronome] Already running.")
      return
    }

    // Quarter-note click
    this.quarterNoteScheduleId = ToneManager.toneTransport?.scheduleRepeat(
      (time) => {
        this.quarterSynth?.triggerAttackRelease("C3", "16n", time, 0.5)
      },
      "4n",
      "0",
    )

    // Measure-downbeat click
    this.measureScheduleId = ToneManager.toneTransport?.scheduleRepeat(
      (time) => {
        this.measureSynth?.triggerAttackRelease("C4", "16n", time, 0.75)
      },
      "1m",
      "0",
    )

    this.isPlaying = true
    consola.info(
      "[Metronome] Started. quarterNoteScheduleId:",
      this.quarterNoteScheduleId,
      " measureScheduleId:",
      this.measureScheduleId,
    )
  }

  /**
   * Stop scheduling the metronome clicks and clear any events.
   */
  public stop(): void {
    if (!ToneManager.isInitialized) {
      consola.warn("[Metronome] ToneManager not initialized.")
      return
    }
    if (!this.isPlaying) {
      consola.warn("[Metronome] Not running or already stopped.")
      return
    }

    // Clear scheduled events
    if (this.quarterNoteScheduleId !== undefined) {
      ToneManager.toneTransport?.clear(this.quarterNoteScheduleId)
      this.quarterNoteScheduleId = undefined
    }
    if (this.measureScheduleId !== undefined) {
      ToneManager.toneTransport?.clear(this.measureScheduleId)
      this.measureScheduleId = undefined
    }

    this.isPlaying = false
    consola.info("[Metronome] Stopped scheduling.")
  }

  /**
   * Unsubscribe from events and dispose any created synths.
   * Use this if you want to fully tear down the Metronome.
   */
  public dispose(): void {
    // Stop receiving updates on timeSignatureChanged
    ToneManager.emitter.off("timeSignatureChanged", this.handleTimeSignatureChanged)

    // Stop the metronome if currently playing
    this.stop()

    // Dispose synths
    this.quarterSynth?.dispose()
    this.measureSynth?.dispose()
    this.quarterSynth = undefined
    this.measureSynth = undefined

    consola.info("[Metronome] Disposed completely.")
  }
}

export default Metronome.getInstance()
