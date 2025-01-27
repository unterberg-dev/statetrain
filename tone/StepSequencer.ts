// StepSequencer.ts
import ToneManager from "#tone/ToneManager"
import type { SequencerMeasuresValue } from "#tone/useInternalSequencerStore"
import type { MonoSynth } from "tone"

export class StepSequencer {
  private steps: boolean[] = []
  private measureCount = ToneManager.currentLoopLength

  private synth: MonoSynth | null = null
  public currentStep = 0
  private scheduledId: number | null = null

  constructor(measureCount = 4, note = "G3") {
    if (!ToneManager.isInitialized || !ToneManager.toneTransport) {
      throw new Error("ToneManager not initialized.")
    }
    this.synth = ToneManager.createAlternativeSynth()
    this.measureCount = measureCount as SequencerMeasuresValue

    // Build steps for initial measureCount
    this.initSteps()

    // Schedule the repeating callback ONCE
    this.scheduledId = ToneManager.toneTransport.scheduleRepeat(
      (time) => {
        const stepToPlay = this.currentStep % this.steps.length
        if (this.steps[stepToPlay]) {
          this.synth?.triggerAttackRelease(note, "16n", time, Math.random() * 0.5)
        }
        this.currentStep++
      },
      "16n",
      "0m",
    )

    // Optionally reset current step on Transport start
    ToneManager.toneTransport.on("start", () => {
      this.currentStep = 0
    })
  }

  /** Rebuilds the steps array based on measureCount & timeSig. */
  private initSteps() {
    const actualTimeSig = ToneManager.currentTimeSignature
    const totalSteps = this.measureCount * actualTimeSig * 4
    // Preserve old toggles if you want by copying them up to new length:
    const oldSteps = this.steps
    this.steps = Array.from({ length: totalSteps }, (_, i) => oldSteps[i] ?? false)
  }

  /** Let the UI set how many measures the sequencer should use (1..4). */
  public setMeasureCount(newCount: number) {
    this.measureCount = newCount as SequencerMeasuresValue
    this.initSteps()
  }

  // unused?
  public dispose() {
    if (ToneManager.toneTransport && this.scheduledId !== null) {
      ToneManager.toneTransport.clear(this.scheduledId)
    }
  }

  public toggleStep(index: number) {
    if (index < 0 || index >= this.steps.length) return
    this.steps[index] = !this.steps[index]
  }

  public setAllSteps(newSteps: boolean[]) {
    // If `newSteps.length` > `this.steps.length`, you might want to slice
    this.steps = newSteps.slice(0, this.steps.length)
  }

  public getSteps() {
    return [...this.steps]
  }
}
