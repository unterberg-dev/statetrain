import rc from "react-classmate"

interface StyledToggleButtonProps {
  $pos: "left" | "right"
}

// todo: convert input scenario like this: https://react-classmate.dev/docs/examples/headline/
export const inputStyle = `
  bg-darkLight
  border-1
  border-gray
  text-center
  text-light
  bg-dark
  text-sm
  flex
  items-center
  justify-center
  font-bold
`

export const StyledToggleButton = rc.button<StyledToggleButtonProps>`
  bg-dark
  border-1
  border-gray
  px-2
  flex
  text-center
  items-center
  w-10
  font-bold
  justify-center
  h-full
  ${(p) => (p.$pos === "left" ? "rounded-s-lg" : "rounded-e-lg")}
`

export const StyledNumberInput = rc.input`
  ${inputStyle}
  border-x-0
  w-full
  h-full
`
export const StyledSelect = rc.select`${inputStyle}`
