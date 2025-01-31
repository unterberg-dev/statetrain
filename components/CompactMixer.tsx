import rc from "react-classmate"
import type { ReactElement, ReactNode } from "react"

import LinkComponent from "#components/common/LinkComponent"
import AMSynthSequencer from "#components/sequencer/templates/AMSynth"
import MonoSynthSequencer from "#components/sequencer/templates/MonoSynth"
import DuoSynthSequencer from "#components/sequencer/templates/DuoSynth"
import MetalSynthSequencer from "#components/sequencer/templates/MetalSynth"
import MembraneSynthSequencer from "#components/sequencer/templates/MembraneSynth"
import FMSynthSequencer from "#components/sequencer/templates/FmSynth"
import { internalLinks } from "#lib/links"
import { SquareArrowOutUpRight } from "lucide-react"
import { usePageContext } from "vike-react/usePageContext"

const InstrumentOuter = rc.div`flex-1`

const StyledExtendedLink = rc.extend(LinkComponent)<{ $active: boolean }>`
  text-lg
  w-full
  py-1
  font-bold
  text-sm
  no-underline
  !text-light
  mb-2
  text-center
  bg-primaryDark
  ${(p) => (p.$active ? "bg-white" : "")}
  hover:bg-primary
  !hover:text-light
  rounded-sm
  w-full
  flex
  gap-2
  items-center
  justify-center
`

const Icon = rc.extend(SquareArrowOutUpRight)`w-3 h-3`

interface ExtendedLinkProps {
  children: ReactNode
  href: string
}

const ExtendedLink = ({ children, href }: ExtendedLinkProps) => {
  const { urlOriginal } = usePageContext()

  return (
    <StyledExtendedLink href={href} $active={urlOriginal === href}>
      {children} <Icon />
    </StyledExtendedLink>
  )
}

const CompactMixer = () => {
  return (
    <div className="flex gap-2 mt-10">
      <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.amSynth}>AM</ExtendedLink>
        <AMSynthSequencer compact />
      </InstrumentOuter>
      <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.monoSynth}>Mono</ExtendedLink>
        <MonoSynthSequencer compact />
      </InstrumentOuter>
      <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.duoSynth}>Duo</ExtendedLink>
        <DuoSynthSequencer compact />
      </InstrumentOuter>
      <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.metalSynth}>Metal</ExtendedLink>
        <MetalSynthSequencer compact />
      </InstrumentOuter>
      <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.membraneSynth}>Membrane</ExtendedLink>
        <MembraneSynthSequencer compact />
      </InstrumentOuter>
      <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.fmSynth}>FM</ExtendedLink>
        <FMSynthSequencer compact />
      </InstrumentOuter>
      {/* Buggy: <InstrumentOuter>
        <ExtendedLink href={internalLinks.synths.pluckSynth}>Pluck</ExtendedLink>
        <PluckSynthSequencer compact />
      </InstrumentOuter> */}
    </div>
  )
}

export default CompactMixer
