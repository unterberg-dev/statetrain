import vikeReact from "vike-react/config"
import type { Config } from "vike/types"

import pkg from "#lib/utils/pkg"

export default {
  title: pkg.name,
  description: pkg.description,
  extends: vikeReact,
  lang: "en",
  clientRouting: true,
} satisfies Config
