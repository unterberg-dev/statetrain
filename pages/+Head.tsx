import { APP_CONFIG } from "#lib/config"

const HeadDefault = () => (
  <>
    <link rel="manifest" href={`${APP_CONFIG.viteUrl}/site.webmanifest`} />
    <link rel="icon" href={`${APP_CONFIG.viteUrl}/favicon/favicon.ico`} />
  </>
)

export default HeadDefault
