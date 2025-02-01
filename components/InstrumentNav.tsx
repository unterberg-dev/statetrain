import Button from "#components/common/Button"
import { H4Headline } from "#components/common/Headline"
import { APP_CONFIG, TRANSPORT_CONFIG } from "#lib/config"
import { internalLinks } from "#lib/links"
import useTone from "#tone/useTone"
import { useMemo } from "react"
import { usePageContext } from "vike-react/usePageContext"

const InstrumentNav = () => {
  const { urlOriginal } = usePageContext()
  const { availableInstruments } = useTone()

  const buttonMap = useMemo(
    () =>
      availableInstruments.map((item) => {
        return (
          <Button size="sm" key={item?.key} active={urlOriginal === item?.url} link={item?.url}>
            {item?.title}
          </Button>
        )
      }),
    [urlOriginal, availableInstruments],
  )

  return (
    <div className="flex gap-3 items-center flex-wrap mb-10 mt-10">
      <H4Headline>Choose Instrument</H4Headline>
      <div className="flex gap-2 flex-wrap items-center">
        <Button size="sm" color="success" link={`${APP_CONFIG.viteUrl}/`}>
          Mixer / Overview
        </Button>
        {buttonMap}
      </div>
    </div>
  )
}

export default InstrumentNav
