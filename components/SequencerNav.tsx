import Button from "#components/common/Button"
import { H4Headline } from "#components/common/Headline"
import { APP_CONFIG } from "#lib/config"

const SequencerNav = () => (
  <div className="flex gap-3 items-center flex-wrap mb-10">
    <H4Headline>Choose Sequencer</H4Headline>
    <div className="flex gap-2 items-center">
      <Button color="error" link={`${APP_CONFIG.viteUrl}/`}>
        Sequencer 1
      </Button>
      <Button color="warning" link={`${APP_CONFIG.viteUrl}/sequencer-2/`}>
        Sequencer 2
      </Button>
      <Button link={`${APP_CONFIG.viteUrl}/sequencer-3/`}>Sequencer 3</Button>
    </div>
  </div>
)

export default SequencerNav
