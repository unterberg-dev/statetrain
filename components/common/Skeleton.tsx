import rc from "react-classmate"

const Skeleton = rc.div<{ $circle?: boolean }>`
  bg-grayDark
  animate-delay-300
  animate-pulse
  ${(p) => (p.$circle ? "rounded-full" : "rounded")}
`

export default Skeleton
