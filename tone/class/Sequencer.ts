import { VOLUME_MAX, VOLUME_MIN } from "#lib/constants"
import ToneManager from "#tone/class/ToneManager"
import { useAmSynthStore } from "#tone/useSequencer"
import type { AvailableSynths, Steps } from "#types/tone"
import { ruleOfThree } from "#utils/index"
import consola from "consola"

export class Sequencer {
  private steps: Steps = []
  private scheduledId: number | null = null
  private synth: AvailableSynths | null = null
  public maxVoices = 1
  public currentStep = 0

  constructor(maxVoices = 1) {
    this.steps = this.initSteps(4)
    this.maxVoices = maxVoices
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
    this.steps = steps
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
          if (!step.double) {
            for (const note of step.notes) {
              this.synth.triggerAttackRelease(note.value, "16n", time, note.velocity)
            }
          } else {
            for (const note of step.notes) {
              this.synth.triggerAttackRelease(note.value, "32n", time, note.velocity)
              const secondHitTime = time + ToneManager.getTone().Time("32n").toSeconds()
              this.synth.triggerAttackRelease(note.value, "32n", secondHitTime, note.velocity)
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

    const defaultVolume = useAmSynthStore.getState().volume
    this.synth.volume.value = ruleOfThree(defaultVolume, VOLUME_MIN, VOLUME_MAX)
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

    const newSteps = [...this.steps]
    newSteps[index] = {
      ...step,
      double: !step.double,
    }

    this.steps = newSteps
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

  public setMeasureCount(newCount: number) {
    const actualTimeSig = ToneManager.currentTimeSignature
    const newTotalSteps = newCount * actualTimeSig * 4
    const oldSteps = this.steps

    // Create new steps while retaining existing step data where possible
    const newSteps = Array.from({ length: newTotalSteps }, (_, index) => {
      if (index < oldSteps.length) {
        return oldSteps[index]
      }
      return { index, active: false, notes: [], double: false }
    })

    this.steps = newSteps
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
