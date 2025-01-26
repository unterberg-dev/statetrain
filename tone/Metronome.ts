import { consola } from "consola/browser"

import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"

class Metronome {
  private eighthNoteId: number | undefined = undefined
  private measureId: number | undefined = undefined

  private eighthSynth: SynthType | undefined = undefined
  private measureSynth: SynthType | undefined = undefined

  private isStarted = false

  public initMetronome() {
    if (!ToneManager.isInitialized) {
      throw new Error("[Metronome] Tone.js is not initialized. Call ToneManager.init() first.")
    }
    this.eighthSynth = ToneManager.createSynth()
    this.measureSynth = ToneManager.createSynth()
  }

  public register() {
    this.stop() // Clear any existing events

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
    this.eighthNoteId = ToneManager.Transport?.scheduleRepeat((time) => {
      this.eighthSynth?.triggerAttackRelease("C3", "16n", time)
    }, "4n")

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

  public stop() {
    if (!ToneManager.isInitialized) {
      consola.warn("[Metronome] ToneManager not initialized, cannot stop metronome.")
      return
    }
    if (!this.isStarted) {
      consola.warn("[Metronome] Not started or already stopped.")
      return
    }

    if (this.eighthNoteId !== undefined) {
      ToneManager.Transport?.clear(this.eighthNoteId)
      consola.info(`[Metronome] Cleared 8n repeat event ID: ${this.eighthNoteId}`)
      this.eighthNoteId = undefined
    }

    if (this.measureId !== undefined) {
      ToneManager.Transport?.clear(this.measureId)
      consola.info(`[Metronome] Cleared measure repeat event ID: ${this.measureId}`)
      this.measureId = undefined
    }

    this.isStarted = false
    consola.success("[Metronome] Stopped and disposed synth resources.")
  }

  public dispose() {
    this.stop()
    if (this.eighthSynth) {
      this.eighthSynth.dispose()
      consola.info("[Metronome] Disposed 8th Synth.")
    }
    if (this.measureSynth) {
      this.measureSynth.dispose()
      consola.info("[Metronome] Disposed measure Synth.")
    }
  }
}

export default Metronome
