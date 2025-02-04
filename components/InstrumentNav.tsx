import Button from "#components/common/Button"
import { H4Headline } from "#components/common/Headline"
import useSequencer from "#tone/useSequencer"
import useTone from "#tone/useTone"
import { useMemo } from "react"

const InstrumentNav = () => {
  const { availableInstruments } = useTone()
  const { setActiveSequencer } = useSequencer()

  const buttonMap = useMemo(
    () =>
      availableInstruments.map((item) => {
        return (
          <Button size="sm" key={item?.key} onClick={() => setActiveSequencer(item?.key)}>
            {item?.title}
          </Button>
        )
      }),
    [availableInstruments, setActiveSequencer],
  )

  return (
    <div className="flex gap-3 items-center flex-wrap mb-10 mt-10">
      <H4Headline>Choose Instrument</H4Headline>
      <div className="flex gap-2 flex-wrap items-center">
        <Button size="sm" color="success" onClick={() => setActiveSequencer(undefined)}>
          Mixer / Overview
        </Button>
        {buttonMap}
      </div>
    </div>
  )
}

export default InstrumentNav
