// StepSequencer.ts
import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"

export class StepSequencer {
  private steps: boolean[] = []
  private synth: SynthType | null = null
  private currentStep = 0
  private scheduledId: number | null = null

  constructor() {
    if (!ToneManager.isInitialized || !ToneManager.toneTransport) {
      throw new Error("ToneManager not initialized.")
    }
    this.synth = ToneManager.createSynth()

    this.initSteps()

    // schedule the repeating callback ONCE here
    this.scheduledId = ToneManager.toneTransport.scheduleRepeat((time) => {
      const stepToPlay = this.currentStep % this.steps.length
      if (this.steps[stepToPlay]) {
        this.synth?.triggerAttackRelease("G3", "16n", time)
      }
      this.currentStep++
    }, "16n")

    // Optionally listen for Transport start/stop to reset currentStep or do other housekeeping
    ToneManager.toneTransport.on("start", () => {
      this.currentStep = 0
    })
    // Transport.on("stop", () => { ... optional ... })
  }

  private initSteps() {
    // e.g., 16 steps
    const totalSteps = ToneManager.totalSixteenthNotes || 16
    this.steps = Array.from({ length: totalSteps }, () => false)
  }

  public dispose() {
    if (ToneManager.toneTransport && this.scheduledId !== null) {
      ToneManager.toneTransport.clear(this.scheduledId)
    }
    this.synth?.dispose()
  }

  public toggleStep(index: number) {
    if (index < 0 || index >= this.steps.length) return
    this.steps[index] = !this.steps[index]
  }

  public setAllSteps(newSteps: boolean[]) {
    this.steps = [...newSteps] // clone if desired
  }

  public getSteps() {
    return [...this.steps]
  }
}
