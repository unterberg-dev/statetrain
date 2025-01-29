import { APP_CONFIG } from "#lib/config"
import rc from "react-classmate"

export const SequencerButton = rc.button.variants<{
  $state: "current" | "inactive" | "halfs" | "eigths" | "fourths" | "edit"
  $armed?: boolean
}>({
  base: `inset-0 absolute z-2 transition-all rounded-sm ${APP_CONFIG.transition.twShort}`, // sample styling
  variants: {
    $state: {
      current: (p) => `
        ${p.$armed ? "bg-primaryLight" : "bg-light hover:bg-warning/50"}
        !-translate-y-2
      `,
      edit: "!bg-primaryLight scale-110 animate-pulse",
      inactive: (p) => `${p.$armed ? "bg-secondary/50" : "bg-grayDark hover:bg-secondaryLight/50"}`,
      halfs: (p) => `${p.$armed ? "bg-secondary" : "bg-grayDark hover:bg-secondaryLight/50"}`,
      fourths: (p) => `${p.$armed ? "bg-secondary" : "bg-grayContrast hover:bg-secondaryLight/50"}`,
      eigths: (p) => `${p.$armed ? "bg-secondary/60" : "bg-grayContrast/50 hover:bg-secondaryLight/50"}`,
    },
  },
})
