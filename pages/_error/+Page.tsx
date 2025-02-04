import Button from "#components/common/Button"
import { H1Headline } from "#components/common/Headline"
import { ServerCrash, Unlink } from "lucide-react"
import rc from "react-classmate"
import { usePageContext } from "vike-react/usePageContext"

export const StyledErrorPage = rc.div`w-50% my-20 mx-auto text-center flex-col flex gap-2 items-center`
export const StyledErrorHeadline = rc.extend(H1Headline)`my-5`
export const StyledErrorParagraph = rc.p`text-xl mb-5`

const ErrorPage = () => {
  const context = usePageContext()
  const is404 = context.is404

  return (
    <StyledErrorPage>
      {is404 ? (
        <>
          <Unlink size={128} />
          <StyledErrorHeadline>404 Page Not Found</StyledErrorHeadline>
          <StyledErrorParagraph>This page could not be found.</StyledErrorParagraph>
          <Button link="/"> Go to Start page</Button>
        </>
      ) : (
        <>
          <ServerCrash size={128} />
          <StyledErrorHeadline>500 Internal Server Error</StyledErrorHeadline>
          <StyledErrorParagraph>Something went wrong.</StyledErrorParagraph>
        </>
      )}
    </StyledErrorPage>
  )
}

export default ErrorPage
