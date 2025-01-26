import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"

class Metronome {
  private static instance: Metronome
  private eighthNoteId: number | undefined = undefined
  private measureId: number | undefined = undefined
  private eighthSynth: SynthType | undefined = undefined
  private measureSynth: SynthType | undefined = undefined
  private isStarted = false

  private constructor() {
    ToneManager.events.on("timeSignatureChanged", this.handleTimeSignatureChanged.bind(this))
  }

  public static getInstance(): Metronome {
    if (!Metronome.instance) {
      Metronome.instance = new Metronome()
    }
    return Metronome.instance
  }

  public initMetronome() {
    if (!ToneManager.isInitialized) {
      throw new Error("[Metronome] Tone.js is not initialized. Call ToneManager.init() first.")
    }
    this.eighthSynth = ToneManager.createSynth()
    this.measureSynth = ToneManager.createSynth()
  }

  private handleTimeSignatureChanged() {
    if (this.isStarted) {
      this.register()
    }
  }

  public register() {
    this.unregister()

    if (!ToneManager.isInitialized) return
    if (!this.eighthSynth || !this.measureSynth) {
      console.warn("[Metronome] call initMetronome() first.")
      return
    }
    if (this.isStarted) {
      console.warn("[Metronome] Already started.")
      return
    }

    // Quarter-note beep
    this.eighthNoteId = ToneManager.Transport?.scheduleRepeat(
      (time) => {
        this.eighthSynth?.triggerAttackRelease("C3", "16n", time)
      },
      "4n",
      "0",
    )

    // Measure beep
    this.measureId = ToneManager.Transport?.scheduleRepeat(
      (time) => {
        this.measureSynth?.triggerAttackRelease("C4", "16n", time)
      },
      "1m",
      "0",
    )

    ToneManager.setTransport()

    this.isStarted = true
    console.info("[Metronome] Registered events. 8n:", this.eighthNoteId, " measure:", this.measureId)
  }

  public unregister() {
    if (!ToneManager.isInitialized) {
      console.warn("[Metronome] Not initialized in ToneManager.")
      return
    }
    if (!this.isStarted) {
      console.warn("[Metronome] Not started or already stopped.")
      return
    }
    // Clear scheduled events
    if (this.eighthNoteId !== undefined) {
      ToneManager.Transport?.clear(this.eighthNoteId)
      this.eighthNoteId = undefined
    }
    if (this.measureId !== undefined) {
      ToneManager.Transport?.clear(this.measureId)
      this.measureId = undefined
    }
    this.isStarted = false
    console.log("[Metronome] Stopped scheduling.")
  }

  public dispose() {
    // Unsubscribe from events so we don't leak
    ToneManager.events.off("timeSignatureChanged", this.handleTimeSignatureChanged)
    this.unregister()
    this.eighthSynth?.dispose()
    this.measureSynth?.dispose()
    console.info("[Metronome] Disposed completely.")
  }
}

export default Metronome.getInstance()
