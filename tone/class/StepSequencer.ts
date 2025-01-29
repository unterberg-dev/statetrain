import ToneManager from "#tone/class/ToneManager"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import type { AvailableSynths, Steps } from "#types/tone"
import consola from "consola"

export class StepSequencer {
  private steps: Steps = []
  private measureCount: number
  private scheduledId: number | null = null
  private synth: AvailableSynths | null = null
  public currentStep = 0
  public monoVoice = true

  constructor(measureCount = 4, steps: Steps = []) {
    this.measureCount = measureCount
    this.steps = steps.length ? steps : this.initSteps(measureCount)
  }

  private initSteps(measureCount: number): Steps {
    const actualTimeSig = ToneManager.currentTimeSignature
    const totalSteps = measureCount * actualTimeSig * 4

    consola.info("Initializing steps with measure count", measureCount, "and total steps", totalSteps)

    const steps = Array.from({ length: totalSteps }, (_, index) => ({
      index,
      active: false,
      notes: [],
      double: false,
    }))
    // consola.info("Initialized steps", steps)
    return steps
  }

  public setSteps(newSteps: Steps) {
    this.steps = newSteps
  }

  public getSteps() {
    return [...this.steps]
  }

  public getSynth() {
    return this.synth
  }

  public registerTransportCallback(): void {
    if (!ToneManager.toneTransport) return

    // Ensure we remove previous scheduling
    if (this.scheduledId !== null) {
      ToneManager.toneTransport.clear(this.scheduledId)
    }

    // Schedule repeating step trigger
    this.scheduledId = ToneManager.toneTransport.scheduleRepeat(
      (time) => {
        const stepIndex = this.currentStep % this.steps.length
        const step = this.steps[stepIndex]

        if (step.active && this.synth) {
          if (this.monoVoice) {
            this.synth?.triggerAttackRelease(step.notes[0].value, "16n", time, step.notes[0].velocity)
          } else {
            for (const note of step.notes) {
              this.synth?.triggerAttackRelease(note.value, "16n", time, note.velocity)
            }
          }
        }
        this.currentStep++
      },
      "16n",
      "0m",
    )

    // Reset step counter on transport start
    ToneManager.toneTransport.on("start", () => {
      this.currentStep = 0
    })
  }

  public initializeSynth(synth: AvailableSynths) {
    this.synth = synth
  }

  public increaseVolume() {
    if (this.synth?.volume) {
      this.synth.volume.value += 5
    }
  }

  public decreaseVolume() {
    if (this.synth?.volume) {
      this.synth.volume.value -= 5
    }
  }

  public setVolume(value: number) {
    if (this.synth?.volume) {
      this.synth.volume.value = value
    }
  }

  public toggleStep(index: number, note: string, velocity: number) {
    const step = this.steps[index]
    if (!step) return

    const existingNote = step.notes.find((n) => n.value === note)
    if (existingNote) {
      step.notes = step.notes.filter((n) => n.value !== note)
    } else {
      step.notes.push({ value: note, velocity })
    }
    step.active = step.notes.length > 0
  }

  public toggleDouble(index: number) {
    const step = this.steps[index]
    if (!step) return
    step.double = !step.double
  }

  public triggerStep(index: number, time: number) {
    const step = this.steps[index]
    if (step.active && this.synth) {
      for (const note of step.notes) {
        this.synth?.triggerAttackRelease(note.value, step.double ? "32n" : "16n", time, note.velocity)
      }
    }
  }

  public clearStep(index: number) {
    if (this.steps[index]) {
      this.steps[index].notes = []
      this.steps[index].active = false
    }
  }

  /** Let the UI set how many measures the sequencer should use (1..4). */
  public setMeasureCount(newCount: number) {
    this.measureCount = newCount as SequencerMeasuresValue
    const newSteps = this.initSteps(newCount)
    this.registerTransportCallback()
    return newSteps
  }

  public updateVelocity(index: number, note: string, velocity: number) {
    const step = this.steps[index]
    if (!step) return

    const targetNote = step.notes.find((n) => n.value === note)
    if (targetNote) {
      targetNote.velocity = velocity
    }
  }
}
