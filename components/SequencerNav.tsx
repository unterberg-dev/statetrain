import Button from "#components/common/Button"
import { H4Headline } from "#components/common/Headline"
import { APP_CONFIG } from "#lib/config"
import { internalLinks } from "#lib/links"
import { useMemo } from "react"
import { usePageContext } from "vike-react/usePageContext"

const SequencerNav = () => {
  const { urlOriginal, urlPathname } = usePageContext()

  const buttonMap = useMemo(
    () =>
      Object.entries(internalLinks.synths).map(([key, url]) => {
        return (
          <Button key={key} active={urlOriginal === url} link={url}>
            {key}
          </Button>
        )
      }),
    [urlOriginal],
  )

  return (
    <div className="flex gap-3 items-center flex-wrap mb-10">
      <H4Headline>Choose Sequencer</H4Headline>
      <div className="flex gap-2 items-center">
        <Button color="secondary" link={`${APP_CONFIG.viteUrl}/`}>
          All Sequencers
        </Button>
        {buttonMap}
      </div>
    </div>
  )
}

export default SequencerNav
