import rc from "react-classmate"

export const SequencerButton = rc.button.variants<{
  $state: "current" | "inactive" | "halfs" | "eigths" | "fourths" | "edit" | "locked"
  $armed?: boolean
}>({
  base: "inset-0 absolute z-2 overflow-hidden rounded-sm",
  variants: {
    $state: {
      edit: "!bg-error scale-110 z-200",
      inactive: (p) => `${p.$armed ? "bg-secondary/50" : "bg-grayDark hover:bg-secondaryLight/50"}`,
      locked: "bg-grayDark/50",
      halfs: (p) => `${p.$armed ? "bg-secondary" : "bg-grayDark hover:bg-secondaryLight/50"}`,
      fourths: (p) => `${p.$armed ? "bg-secondary" : "bg-grayContrast hover:bg-secondaryLight/50"}`,
      eigths: (p) => `${p.$armed ? "bg-secondary/60" : "bg-grayDark hover:bg-secondaryLight/50"}`,
    },
  },
})

export const StepsOuter = rc.div`
  flex flex-col
  gap-1
`

export const StepRow = rc.div`
  min-h-20 gap-1
  lg:flex
  lg:mb-0
  mb-3
  mb-0
  grid
  grid-cols-8
`
