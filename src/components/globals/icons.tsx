import { FaDiscord } from "react-icons/fa6"
import { MdVerified } from "react-icons/md";

export const Icons = {
  discord:(props:React.HTMLAttributes<SVGElement>)=>(<FaDiscord {...props}/>),
  verificationBadge : (props:React.HTMLAttributes<SVGElement>)=>(<MdVerified {...props}/>)
}