import type { AnchorHTMLAttributes } from "react"
import rc from "react-classmate"
import { usePageContext } from "vike-react/usePageContext"

import { APP_CONFIG } from "#lib/config"
import isExternalLink from "#lib/utils/isExternalLink"

interface StyledLinkProps {
  $isExternal: boolean
  $isActive: boolean
  $isMenu: boolean
}

const StyledLink = rc.a<StyledLinkProps>`
  link
  transition-colors
  ${APP_CONFIG.transition.tw}
  inline-block
  hover:text-primaryLight
  ${(p) => (p.$isActive ? "!text-primaryDark/70 underline isActive" : "")}
  ${(p) => (p.$isMenu ? "!text-dark" : "text-primaryLight/80 underline underline-0.5")}
`

const LinkComponent = ({
  target = "_self",
  isMenu = false,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string; isMenu?: boolean }) => {
  const { urlOriginal } = usePageContext()

  if (!href) {
    return <span className="color-red">Missing href</span>
  }

  const isExternal = isExternalLink(href)
  const isActive = urlOriginal === href

  return (
    <StyledLink
      href={isExternal ? href : `${APP_CONFIG.viteUrl}${href}`}
      target={isExternal ? "_blank" : target}
      rel={isExternal ? "noreferrer" : ""}
      $isExternal={isExternal}
      $isActive={isActive}
      $isMenu={isMenu}
      {...props}
    />
  )
}

export default LinkComponent
