import { Github, Smile } from "lucide-react"

import LayoutComponent from "#components/common/LayoutComponent"
import LinkComponent from "#components/common/LinkComponent"
import useTone from "#tone/useTone"

const Footer = () => {
  const { isPlaying } = useTone()

  return (
    <LayoutComponent className="mt-10 mb-5 flex flex-col gap-2 justify-center items-center">
      <Smile size={32} className={`${isPlaying ? "animate-spin" : ""}`} />
      <LinkComponent href="https://unterberg.dev/" className="flex items-center gap-2">
        unterberg.dev
      </LinkComponent>
      <LinkComponent
        isMenu
        href="https://github.com/unterberg-dev/statetrain"
        className="flex items-center gap-2 text-sm"
      >
        <Github size={12} />
        Source code on GitHub
      </LinkComponent>
    </LayoutComponent>
  )
}

export default Footer
