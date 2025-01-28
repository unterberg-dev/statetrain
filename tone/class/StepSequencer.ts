import SynthManager from "#tone/class/SynthManager"
import ToneManager from "#tone/class/ToneManager"
import type { SequencerMeasuresValue } from "#tone/useSequencer"
import type { AvailableSynths } from "#types/tone"

type SynthType = "default" | "mono" | "am" | "duo"

export class StepSequencer {
  private steps: boolean[] = []
  private measureCount = ToneManager.currentLoopLength

  private synth: AvailableSynths | null = null
  public currentStep = 0
  private scheduledId: number | null = null

  // Store the note here instead of passing it around
  private note: string | number
  private synthType: SynthType

  constructor(measureCount = 4, note = "G3", synthType: SynthType = "default", steps: boolean[] = []) {
    this.measureCount = measureCount as SequencerMeasuresValue
    this.note = note
    this.steps = steps
    this.synthType = synthType

    // Build steps for initial measureCount
    this.initSteps()
  }

  /**
   * Asynchronously initialize the StepSequencer by creating synths and scheduling repeats.
   */
  public init(): void {
    if (!ToneManager.isInitialized || !ToneManager.toneTransport) {
      throw new Error("ToneManager is not initialized.")
    }

    switch (this.synthType) {
      case "mono":
        this.synth = SynthManager.createMonoSynth({
          volume: 0,
          oscillator: {
            type: "sawtooth",
          },
          filter: {
            Q: 2,
            type: "bandpass",
            rolloff: -24,
          },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.2,
            release: 0.6,
          },
          filterEnvelope: {
            attack: 0.02,
            decay: 0.4,
            sustain: 1,
            release: 0.7,
            releaseCurve: "linear",
            baseFrequency: 20,
            octaves: 5,
          },
        })
        break
      case "am":
        this.synth = SynthManager.createAMSynth({
          harmonicity: 2,
          volume: 10,
          oscillator: {
            type: "amsine2",
            modulationType: "sine",
            harmonicity: 1.01,
          },
          envelope: {
            attack: 0.006,
            decay: 4,
            sustain: 0.04,
            release: 1.2,
          },
          modulation: {
            volume: 15,
            type: "amsine2",
            modulationType: "sine",
            harmonicity: 12,
          },
          modulationEnvelope: {
            attack: 0.006,
            decay: 0.2,
            sustain: 0.2,
            release: 0.4,
          },
        })
        break
      case "duo":
        this.synth = SynthManager.createDuoSynth({
          detune: -10,
          harmonicity: 2,
          volume: -10,
          voice0: {
            envelope: {
              attack: 0.01,
              decay: 0.2,
              sustain: 0.1,
              release: 0.1,
            },
            filter: {
              frequency: 2000,
              Q: 8,
            },
            filterEnvelope: {
              attack: 0.25,
              sustain: 0.05,
              release: 0.1,
            },
          },
          voice1: {
            filter: {
              frequency: 400,
              Q: 12,
            },
            envelope: {
              attack: 0.01,
              decay: 0.2,
              sustain: 0.1,
              release: 0.2,
            },
            filterEnvelope: {
              sustain: 0.05,
              release: 0.1,
            },
          },
        })
        break
      default:
        this.synth = SynthManager.createSynth({
          detune: 5,
          volume: -8,
          oscillator: {
            type: "amtriangle22",
            modulationType: "sine",
          },
          envelope: {
            attack: 0.01,
            decay: 0.14,
            sustain: 0.2,
            releaseCurve: "bounce",
            release: 0.4,
          },
        })
    }

    // Schedule the repeating callback ONCE
    this.scheduledId = ToneManager.toneTransport.scheduleRepeat(
      (time) => {
        const stepToPlay = this.currentStep % this.steps.length
        if (this.steps[stepToPlay]) {
          this.synth?.triggerAttackRelease(
            this.note, // Use the class property
            "16n",
            time,
            0.6,
          )
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

  public getVolume() {
    return this.synth?.volume.value || 0
  }

  /** Rebuilds the steps array based on measureCount & timeSig. */
  private initSteps() {
    const actualTimeSig = ToneManager.currentTimeSignature
    const totalSteps = this.measureCount * actualTimeSig * 4

    // Preserve old toggles if you want by copying them up to new length
    const oldSteps = this.steps
    this.steps = Array.from({ length: totalSteps }, (_, i) => oldSteps[i] ?? false)
  }

  /** Let the UI set how many measures the sequencer should use (1..4). */
  public setMeasureCount(newCount: number) {
    this.measureCount = newCount as SequencerMeasuresValue
    this.initSteps()
  }

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
    this.steps = newSteps.slice(0, this.steps.length)
  }

  public getSteps() {
    return [...this.steps]
  }

  /**
   * Change the note used by this sequencer on each triggered step.
   * Can accept a string note ("C4", "G#3", etc.) or MIDI number (0-127).
   */
  public changeNote(newNote: string | number) {
    this.note = newNote
  }

  /**
   * Retrieve the current note.
   */
  public getNote(): string | number {
    return this.note
  }
}
