import { LoaderCircle } from "lucide-react"
import type { HTMLAttributes, ReactNode } from "react"
import { type VariantsConfig, convertRcProps, createVariantMap } from "react-classmate"

import type { Colors } from "#types/ui"
import isExternalLink from "#lib/utils/isExternalLink"

interface ButtonVariantProps {
  $size?: "lg" | "md" | "sm" | "xs"
  $color?: Colors
}

interface ButtonBaseProps {
  $disabled?: boolean
  $loading?: boolean
  $noGutter?: boolean
  $active?: boolean
}

const buttonVariants: VariantsConfig<ButtonVariantProps, ButtonBaseProps> = {
  base: ({ $noGutter, $disabled, $loading }) => `
    inline-flex items-center justify-center gap-2
    font-bold
    ${$noGutter ? "!p-0" : ""}
    ${$disabled ? "opacity-60 cursor-not-allowed" : ""}
    ${$loading ? "opacity-80 pointer-events-none" : ""}
  `,
  variants: {
    $size: {
      xs: "py-1 px-2 rounded-sm text-xs",
      sm: "py-1.5 px-2.5 rounded-sm text-sm ",
      md: "py-1.5 px-3 rounded-sm ",
      lg: "py-3 px-4 rounded ",
    },
    $color: {
      hollow: "",
      primary: ({ $disabled, $active }) => `
        text-lightNeutral
        bg-primaryDarkNeutral
        ${$active ? "!bg-primaryLight !text-dark" : ""}
        ${!$disabled ? "hover:bg-primary" : ""}
      `,
      secondary: ({ $disabled }) => `
        text-lightNeutral
        bg-secondaryDarkNeutral
        ${!$disabled ? "hover:bg-secondary" : ""}
      `,
      success: ({ $disabled }) => `
        text-lightNeutral
        bg-successDarkNeutral
        ${!$disabled ? "hover:bg-success" : ""}
      `,
      warning: ({ $disabled }) => `
        text-lightNeutral
        bg-warningDarkNeutral
        ${!$disabled ? "hover:bg-warning" : ""}
      `,
      error: ({ $disabled }) => `
        text-lightNeutral
        bg-errorDarkNeutral
        ${!$disabled ? "hover:bg-error" : ""}
      `,
    },
  },
  defaultVariants: {
    $size: "md",
    $color: "primary",
  },
}

const button = createVariantMap({
  elements: ["button", "a"],
  variantsConfig: buttonVariants,
})

export interface ButtonProps extends HTMLAttributes<HTMLAnchorElement | HTMLButtonElement> {
  icon?: ReactNode
  link?: string
  type?: "button" | "submit" | "reset"
  // we must redeclare these props here we don't want this $ on the outside
  size?: ButtonVariantProps["$size"]
  color?: ButtonVariantProps["$color"]
  disabled?: ButtonBaseProps["$disabled"]
  loading?: ButtonBaseProps["$loading"]
  noGutter?: ButtonBaseProps["$noGutter"]
  active?: ButtonBaseProps["$active"]
}

const Button = ({ children, icon, link, ...buttonProps }: ButtonProps) => {
  const Component = link ? button.a : button.button
  const isExternal = isExternalLink(link)

  const preparedProps = convertRcProps(buttonProps, {
    size: "$size",
    noGutter: "$noGutter",
    loading: "$loading",
    disabled: "$disabled",
    color: "$color",
    active: "$active",
  })

  return (
    <Component {...(link ? { href: link, target: isExternal ? "_blank" : "" } : {})} {...preparedProps}>
      {icon}
      {children}
      {buttonProps.loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
    </Component>
  )
}

export default Button
