import Button from "#components/common/Button"
import { H4Headline } from "#components/common/Headline"
import { APP_CONFIG } from "#lib/config"
import { internalLinks } from "#lib/links"
import { useMemo } from "react"
import { usePageContext } from "vike-react/usePageContext"

const InstrumentNav = () => {
  const { urlOriginal } = usePageContext()

  const buttonMap = useMemo(
    () =>
      Object.entries(internalLinks.synths).map(([key, url]) => {
        return (
          <Button size="sm" key={key} active={urlOriginal === url} link={url}>
            {key}
          </Button>
        )
      }),
    [urlOriginal],
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
