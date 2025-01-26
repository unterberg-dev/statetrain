// StepSequencer.ts
import ToneManager from "#tone/ToneManager"
import type { SynthType } from "#types/tone"
import { consola } from "consola/browser"
import type { Part } from "tone"

/*
WIP NOT WORKING PROPERLY
*/
export class StepSequencer {
  private steps: boolean[] = []
  private part: Part | null = null
  private synth: SynthType | null = null
  private isStarted = false // track if we're currently started

  constructor() {
    if (!ToneManager.isInitialized) {
      throw new Error("ToneManager not initialized. Call toneManager.init() first.")
    }

    // Create a new synth from ToneManager
    this.synth = ToneManager.createSynth()

    // Prepare initial steps and Part
    this.initPart()

    // Listen for timeSignatureChanged so we can rebuild Part if needed
    ToneManager.events.on("timeSignatureChanged", this.handleTimeSignatureChanged)
  }

  /**
   * Cleans up event listener & resources (call when removing from the UI).
   */
  public dispose() {
    // Unsubscribe from the time signature changes to avoid memory leaks
    ToneManager.events.off("timeSignatureChanged", this.handleTimeSignatureChanged)

    // Dispose part & synth
    this.part?.dispose()
    this.part = null
    this.synth?.dispose()
    this.synth = null
  }

  /**
   * Called when ToneManager fires "timeSignatureChanged"
   * If this sequencer is started, we re-build the Part with new timeSignature-based details.
   */
  private handleTimeSignatureChanged = () => {
    this.initPart()
  }

  /**
   * (Re)Initializes the steps array & Tone.Part
   * If you want to preserve old steps upon time-signature change,
   * you can copy them up to the new length.
   */
  private initPart() {
    consola.warn("Rebuilding Part with new time signature.")

    if (!ToneManager.isInitialized) return
    const Tone = ToneManager.getTone()
    if (!Tone) return

    // Save old steps if you want to preserve "on/off" data
    const oldSteps = this.steps

    // Recompute how many total ticks we want based on time signature
    // For example, ToneManager might store timeSignature * 4 for "quarter note" steps,
    // or timeSignature * 16 for "16th note" steps, etc.
    const totalSteps = ToneManager.totalSixteenthTicks
    consola.info(totalSteps)

    // Rebuild steps, preserving old toggles if they're in range
    this.steps = Array.from({ length: totalSteps }, (_, i) => oldSteps[i] || false)

    // Dispose old Part if it exists
    if (this.part) {
      this.part.dispose()
      this.part = null
    }

    // Create new Part with updated step events
    this.part = new Tone.Part((time, stepIndex: number | string) => {
      if (typeof stepIndex === "number" && this.steps[stepIndex]) {
        this.synth?.triggerAttackRelease("G3", "16n", time)
      }
    }, this.generateStepEvents(totalSteps))

    this.part.loop = true
    this.part.loopEnd = "4m"
    this.start()
  }

  private generateStepEvents(numSteps: number) {
    const loopLength = ToneManager.internalLoopCount // e.g. 4
    const ev = Array.from({ length: numSteps }, (_, i) => [`${(i / numSteps) * 16}m`, i])
    consola.info(ev)
    return ev
  }

  /** Toggle a specific step on/off */
  public toggleStep(index: number) {
    if (index < 0 || index >= this.steps.length) return
    this.steps[index] = !this.steps[index]
  }

  /** Read step array in the UI */
  public getSteps() {
    return [...this.steps]
  }

  /** Start the Part on the global Transport timeline */
  public start() {
    if (!this.part) return
    this.isStarted = true
    this.part.start(0)
  }

  /** Stop the Part from playing */
  public stop() {
    this.isStarted = false
    this.part?.stop()
  }
}
