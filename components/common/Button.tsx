import { LoaderCircle } from "lucide-react"
import type { HTMLAttributes, ReactNode } from "react"
import { type VariantsConfig, convertRcProps, createVariantMap } from "react-classmate"

import { APP_CONFIG } from "#lib/config"
import type { Colors } from "#types/ui"
import isExternalLink from "#lib/utils/isExternalLink"

interface ButtonBaseProps {
  $size?: "lg" | "md" | "sm" | "xs"
  $color?: Colors
  $disabled?: boolean
  $loading?: boolean
  $noShadow?: boolean
  $noGutter?: boolean
}

const buttonVariants: VariantsConfig<ButtonBaseProps, ButtonBaseProps> = {
  base: ({ $noShadow, $noGutter, $disabled, $loading }) => `
    transition-colors
    inline-flex items-center justify-center gap-2
    font-bold
    ${APP_CONFIG.transition.tw}
    ${$noShadow ? "!shadow-none" : "shadow-darkNeutral/20"}
    ${$noGutter ? "!p-0" : ""}
    ${$disabled ? "opacity-60 cursor-not-allowed" : ""}
    ${$loading ? "opacity-80 pointer-events-none" : ""}
  `,
  variants: {
    $size: {
      xs: "py-1 px-2 rounded-sm text-xs shadow-sm",
      sm: "py-1.5 px-2.5 rounded-sm text-sm shadow-sm",
      md: "py-1.5 px-3 rounded-sm shadow-sm",
      lg: "py-3 px-4 rounded shadow-md",
    },
    $color: {
      hollow: "",
      primary: ({ $disabled }) => `
        text-lightNeutral
        bg-primaryDarkNeutral
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
      neutral: ({ $disabled }) => `
        text-dark
        bg-light dark:bg-grayLight
        ${!$disabled ? "hover:bg-graySuperLight dark:hover:bg-gray" : ""}
      `,
      copy: ({ $disabled }) => `
        bg-white dark:bg-gray/30
        text-dark
        active:bg-successDarkNeutral active:text-lightNeutral
        dark:active:bg-successDarkNeutral dark:active:text-lightNeutral
        ${!$disabled ? "hover:text-dark hover:bg-grayLight/30 dark:hover:bg-gray/50" : ""}
      `,
      icon: `
        rounded-full
        w-7 lg:w-8
        h-7 lg:h-8
        bg-gray/20 dark:bg-grayLight
        text-dark dark:text-grayDark
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
  size?: ButtonBaseProps["$size"]
  color?: ButtonBaseProps["$color"]
  disabled?: ButtonBaseProps["$disabled"]
  loading?: ButtonBaseProps["$loading"]
  noShadow?: ButtonBaseProps["$noShadow"]
  noGutter?: ButtonBaseProps["$noGutter"]
}

const Button = ({ children, icon, link, ...buttonProps }: ButtonProps) => {
  const Component = link ? button.a : button.button
  const isExternal = isExternalLink(link)

  const preparedProps = convertRcProps(buttonProps, {
    size: "$size",
    noShadow: "$noShadow",
    noGutter: "$noGutter",
    loading: "$loading",
    disabled: "$disabled",
    color: "$color",
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
