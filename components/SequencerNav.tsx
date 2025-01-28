import Button from "#components/common/Button"
import { H4Headline } from "#components/common/Headline"
import { APP_CONFIG } from "#lib/config"

const SequencerNav = () => (
  <div className="flex gap-3 items-center flex-wrap mb-10">
    <H4Headline>Choose Sequencer</H4Headline>
    <div className="flex gap-2 items-center">
      <Button color="secondary" link={`${APP_CONFIG.viteUrl}/`}>
        All Sequencers
      </Button>
      <Button link={`${APP_CONFIG.viteUrl}/sequencer-1/`}>Sequencer 1</Button>
      <Button link={`${APP_CONFIG.viteUrl}/sequencer-2/`}>Sequencer 2</Button>
      <Button link={`${APP_CONFIG.viteUrl}/sequencer-3/`}>Sequencer 3</Button>
      <Button link={`${APP_CONFIG.viteUrl}/sequencer-4/`}>Sequencer 4</Button>
    </div>
  </div>
)

export default SequencerNav
