import {
  useInternalSequencer1Store,
  useInternalSequencer2Store,
  useInternalSequencer3Store,
} from "./useInternalSequencerStore"
import useInternalTransportStore from "#tone/useInternalTransportStore"
import { ToneContext } from "#tone/ToneContextProvider"
import ToneManager from "#tone/ToneManager"
import { useCallback, useContext, useEffect, useMemo } from "react"
import { TRANSPORT_CONFIG } from "#lib/config"

/** the tone controller */
const useTone = () => {
  const context = useContext(ToneContext)

  // transport
  const setIsPlaying = useInternalTransportStore((state) => state.setIsPlaying)
  const isPlaying = useInternalTransportStore((state) => state.isPlaying)
  const bpm = useInternalTransportStore((state) => state.bpm)
  const setBpm = useInternalTransportStore((state) => state.setBpm)
  const timeSignature = useInternalTransportStore((state) => state.timeSignature)
  const setTimeSignature = useInternalTransportStore((state) => state.setTimeSignature)

  // sequencer 1
  const sequencer1Steps = useInternalSequencer1Store((state) => state.steps)
  const setSequencer1Steps = useInternalSequencer1Store((state) => state.setSteps)
  const sequencer1Measures = useInternalSequencer1Store((state) => state.measures)
  const setSequencer1Measures = useInternalSequencer1Store((state) => state.setMeasures)

  // sequencer 2
  const sequencer2Steps = useInternalSequencer2Store((state) => state.steps)
  const setSequencer2Steps = useInternalSequencer2Store((state) => state.setSteps)
  const sequencer2Measures = useInternalSequencer2Store((state) => state.measures)
  const setSequencer2Measures = useInternalSequencer2Store((state) => state.setMeasures)

  // sequencer 3
  const sequencer3Steps = useInternalSequencer3Store((state) => state.steps)
  const setSequencer3Steps = useInternalSequencer3Store((state) => state.setSteps)
  const sequencer3Measures = useInternalSequencer3Store((state) => state.measures)
  const setSequencer3Measures = useInternalSequencer3Store((state) => state.setMeasures)

  const isInitialized = useMemo(() => context?.isInitialized, [context])

  const initTone = useCallback(() => {
    if (context?.initTone) {
      context.initTone()
    }
  }, [context])

  const handlePlay = useCallback(() => {
    ToneManager.register()
    ToneManager.start()
    setIsPlaying(true)
  }, [setIsPlaying])

  const handleStop = useCallback(() => {
    ToneManager.stop()
    setIsPlaying(false)
  }, [setIsPlaying])

  const handleChangeBpm = useCallback(
    (value: number) => {
      if (value <= TRANSPORT_CONFIG.bpm.max && value >= TRANSPORT_CONFIG.bpm.min) {
        setBpm(value)
        ToneManager.updateBpm(value)
      }
    },
    [setBpm],
  )

  const handleChangeTimeSignature = useCallback(
    (value: number) => {
      if (value <= TRANSPORT_CONFIG.timeSignature.max && value >= TRANSPORT_CONFIG.timeSignature.min) {
        ToneManager.updateTimeSignature(value)
        setTimeSignature(value)
      }
    },
    [setTimeSignature],
  )

  if (!context) {
    throw new Error("useTone must be used within a ToneContextProvider")
  }

  return {
    // transport
    isPlaying,
    handlePlay,
    handleStop,
    bpm,
    handleChangeBpm,
    timeSignature,
    handleChangeTimeSignature,
    initTone,
    isInitialized,
    loopLength: TRANSPORT_CONFIG.loopLength.default,

    // sequencer 1
    sequencer1Steps,
    setSequencer1Steps,
    sequencer1Measures,
    setSequencer1Measures,

    // sequencer 2
    sequencer2Steps,
    setSequencer2Steps,
    sequencer2Measures,
    setSequencer2Measures,

    // sequencer 3
    sequencer3Steps,
    setSequencer3Steps,
    sequencer3Measures,
    setSequencer3Measures,
  } as const
}

export default useTone
