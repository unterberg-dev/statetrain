import Button from "#components/common/Button"
import { StyledErrorHeadline, StyledErrorPage, StyledErrorParagraph } from "#pages/_error/+Page"
import { EarOff } from "lucide-react"

// since we prerender we cannot use the error page and feed it with the error code
const ToneBrokenPage = () => {
  return (
    <StyledErrorPage>
      <EarOff size={128} />
      <StyledErrorHeadline>Oh no, audio crashed</StyledErrorHeadline>
      <StyledErrorParagraph>Sorry, the instance of the the tone.js library crashed.</StyledErrorParagraph>
      <Button link="/"> Restart Application</Button>
    </StyledErrorPage>
  )
}

export default ToneBrokenPage
