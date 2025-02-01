import { consola } from "consola/browser"
import type { Player } from "tone"

import ToneManager from "#tone/class/ToneManager"
import PlayerManager from "#tone/class/PlayerManager"
import { APP_CONFIG } from "#lib/config"

class Metronome {
  private static instance: Metronome

  /** IDs for scheduled repeat events in Tone.js */
  private quarterNoteScheduleId?: number
  private measureScheduleId?: number

  /** Synths used for quarter-note click and measure-downbeat click */
  private quarterSynth?: Player
  private measureSynth?: Player

  /** Tracks if the metronome has started scheduling events */
  private isPlaying = false

  private constructor() {
    ToneManager.emitter.on("timeSignatureChanged", this.handleTimeSignatureChanged.bind(this))
  }

  public static getInstance(): Metronome {
    if (!Metronome.instance) {
      Metronome.instance = new Metronome()
    }
    return Metronome.instance
  }

  /** Create synth instances; call after ToneManager is initialized. */
  public initialize() {
    if (!ToneManager.isInitialized) {
      throw new Error("[Metronome] Tone.js not initialized. Call ToneManager.init() first.")
    }

    // could be one sample too
    this.quarterSynth = PlayerManager.createPlayer({
      url: `${APP_CONFIG.viteUrl}/sounds/MPC2000/P_SN_RIM.wav`,
    })
    this.quarterSynth.playbackRate = 1.2

    this.measureSynth = PlayerManager.createPlayer({
      url: `${APP_CONFIG.viteUrl}/sounds/MPC2000/P_SN_RIM.wav`,
    })
    this.measureSynth.playbackRate = 0.8
  }

  /** If the time signature changes, re-register schedules if currently playing. */
  private handleTimeSignatureChanged(): void {
    if (this.isPlaying) {
      this.stop()
      this.start()
    }
  }

  /**
   * Start scheduling the metronome clicks.
   * (Clears existing schedules first to avoid duplicates.)
   */
  public start(): void {
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
        this.quarterSynth?.start(time)
      },
      "4n",
      "0",
    )

    // Measure downbeat click
    this.measureScheduleId = ToneManager.toneTransport?.scheduleRepeat(
      (time) => {
        this.measureSynth?.start(time)
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

  public setVolume(value: number) {
    if (this.measureSynth?.volume) {
      this.measureSynth.volume.value = value
    }
    if (this.quarterSynth?.volume) {
      this.quarterSynth.volume.value = value
    }
  }

  /**
   * Stop scheduling the metronome clicks and clear any events.
   */
  public stop(): void {
    if (!ToneManager.isInitialized) {
      consola.warn("[Metronome] ToneManager not initialized.")
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
