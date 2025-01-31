import { APP_CONFIG } from "#lib/config"
import rc from "react-classmate"

export const SequencerButton = rc.button.variants<{
  $state: "current" | "inactive" | "halfs" | "eigths" | "fourths" | "edit" | "locked"
  $armed?: boolean
  $compact?: boolean
}>({
  base: (p) =>
    `inset-0 absolute z-2 overflow-hidden ${p.$compact ? "" : `rounded-sm transition-all ${APP_CONFIG.transition.twShort}`}`, // sample styling
  variants: {
    $state: {
      current: (p) => `
        ${p.$armed ? "bg-primaryLight" : "bg-light"}
        ${p.$compact ? "" : "!-translate-y-2"}
      `,
      edit: "!bg-primaryLight scale-110 animate-pulse",
      inactive: (p) => `${p.$armed ? "bg-secondary/50" : "bg-grayDark hover:bg-secondaryLight/50"}`,
      locked: "bg-grayDark/50",
      halfs: (p) => `${p.$armed ? "bg-secondary" : "bg-grayDark hover:bg-secondaryLight/50"}`,
      fourths: (p) => `${p.$armed ? "bg-secondary" : "bg-grayContrast hover:bg-secondaryLight/50"}`,
      eigths: (p) => `${p.$armed ? "bg-secondary/60" : "bg-grayDark hover:bg-secondaryLight/50"}`,
    },
  },
})

export const StepsOuter = rc.div<{ $compact?: boolean }>`
  flex flex-col
  ${(p) => (p.$compact ? "gap-0.5" : "gap-1")}
`

export const StepRow = rc.div<{ $compact?: boolean }>`
  ${(p) => (p.$compact ? "min-h-5 gap-0.5" : "min-h-20 gap-1")}
  lg:flex
  lg:mb-0
  mb-3
  mb-0
  grid
  grid-cols-8
`
