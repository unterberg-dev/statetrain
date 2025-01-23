// src/tone/Metronome.ts
import type { SynthType } from "#types/tone"
import ToneManager from "./ToneManager"
import { consola } from "consola/browser"

class Metronome {
  // IDs for scheduled repeating events
  private eighthNoteId: number | undefined = undefined
  private measureId: number | undefined = undefined

  // Two Synths: one for 8th note ticks (C2), one for measure downbeats (C3)
  private eighthSynth: SynthType | undefined = undefined
  private measureSynth: SynthType | undefined = undefined

  // Flag to prevent multiple starts
  private isStarted = false

  /**
   * Prepares the Metronome by creating two Synth instances (one for each pitch).
   * We assume ToneManager is already initialized in the application flow.
   */
  public initMetronome() {
    if (!ToneManager.isInitialized) {
      throw new Error("[Metronome] Tone.js is not initialized. Call ToneManager.init() first.")
    }
  }

  /**
   * Schedules repeating events on the Transport:
   * - C2 every 8th note
   * - C3 every 1 measure
   */
  public start() {
    this.stop() // Clear any existing events
    this.eighthSynth = ToneManager.createSynth() // e.g., for 8th note "C2"
    this.measureSynth = ToneManager.createSynth() // e.g., for measure "C3"

    consola.success("[Metronome] Initialized: Created two Synth instances for C2 & C3.")

    if (!ToneManager.isInitialized) {
      consola.warn("[Metronome] ToneManager not initialized, cannot start metronome.")
      return
    }
    if (!this.eighthSynth || !this.measureSynth) {
      consola.warn("[Metronome] Synths not created. Call initMetronome() first.")
      return
    }
    if (this.isStarted) {
      consola.warn("[Metronome] Already started.")
      return
    }

    // Schedule a C2 note every 8th note
    // this.eighthNoteId = ToneManager.Transport?.scheduleRepeat((time) => {
    //   this.eighthSynth?.triggerAttackRelease('C3', '16n', time)
    // }, '4n')

    // Schedule a C3 note every measure
    this.measureId = ToneManager.Transport?.scheduleRepeat((time) => {
      this.measureSynth?.triggerAttackRelease("C4", "16n", time)
    }, "1m")

    consola.info("[Metronome] Started scheduling events:", {
      eighthNoteId: this.eighthNoteId,
      measureId: this.measureId,
    })

    this.isStarted = true
  }

  /**
   * Clears the scheduled events and disposes Synths.
   */
  public stop() {
    if (!ToneManager.isInitialized) {
      consola.warn("[Metronome] ToneManager not initialized, cannot stop metronome.")
      return
    }
    if (!this.isStarted) {
      consola.warn("[Metronome] Not started or already stopped.")
      return
    }

    // Clear repeating events
    if (this.eighthNoteId) {
      ToneManager.Transport?.clear(this.eighthNoteId)
      consola.info(`[Metronome] Cleared 8n repeat event ID: ${this.eighthNoteId}`)
      this.eighthNoteId = undefined
    }

    if (this.measureId) {
      ToneManager.Transport?.clear(this.measureId)
      consola.info(`[Metronome] Cleared measure repeat event ID: ${this.measureId}`)
      this.measureId = undefined
    }

    // Dispose synths
    if (this.eighthSynth) {
      this.eighthSynth.dispose()
      this.eighthSynth = undefined
    }
    if (this.measureSynth) {
      this.measureSynth.dispose()
      this.measureSynth = undefined
    }

    this.isStarted = false
    consola.success("[Metronome] Stopped and disposed synth resources.")
  }
}

export default Metronome
