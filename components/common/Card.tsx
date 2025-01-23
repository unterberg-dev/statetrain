import rc from "react-classmate"

import Notebox from "#components/common/Notebox"

const Card = rc.extend(Notebox)`
  !p-2
  md:!p-3
  rounded
  border-1
  border-grayLight/50 dark:border-graySuperLight/50
  shadow-md
  shadow-gray/20
  dark:shadow-light/50
`

export default Card
