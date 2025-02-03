import rc from "react-classmate"

interface StyledKeyProps {
  $active: boolean
  $locked?: boolean
}

interface StyledKeyVariants {
  $type: "white" | "black"
}

export const StyledKey = rc.button.variants<StyledKeyProps, StyledKeyVariants>({
  base: "h-40 cursor-pointer relative",
  variants: {
    $type: {
      white: (p) => `
        ${p.$active ? "bg-secondary/80" : "bg-white"}
        ${p.$locked ? "!bg-error/30" : ""}
        flex-1
        border-r-3
        border-dark
      `,
      black: (p) => `
        ${p.$active ? "bg-secondary/50" : "bg-dark"}
        ${p.$locked ? "!bg-error/10" : ""}
        flex-1
        border-r-3
         border-dark
      `,
    },
  },
})

export const StyledKeyNoteValue = rc.span<{ $white: boolean; $locked?: boolean }>`
  block pointer-events-none select-none
  ${(p) => (p.$locked ? "!text-error text-micro" : "text-sm")}
  ${(p) => (p.$white ? "text-gray mt-24" : "text-gray mt-12")}
`
