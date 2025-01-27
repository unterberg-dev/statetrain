import rc from "react-classmate"

export const SequencerButton = rc.button.variants<{
  $state: "current" | "inactive" | "halfs" | "eigths" | "fourths"
  $armed?: boolean
}>({
  base: "inset-0 absolute z-2", // sample styling
  variants: {
    $state: {
      current: (p) => `${p.$armed ? "bg-warningLight" : "bg-light hover:bg-warning/50"}`,
      inactive: (p) => `${p.$armed ? "bg-warning/70" : "bg-gray/50 hover:bg-warning/50"}`,
      halfs: (p) => `${p.$armed ? "bg-warning" : "bg-grayContrast hover:bg-warning/50"}`,
      fourths: (p) => `${p.$armed ? "bg-warning" : "bg-grayContrast hover:bg-warning/50"}`,
      eigths: (p) => `${p.$armed ? "bg-warning/80" : "bg-gray/50 hover:bg-warning/50"}`,
    },
  },
})
