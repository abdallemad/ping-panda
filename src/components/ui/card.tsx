import { cn } from "@/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement>{
  contentClassName?:string
}
export const Card = ({className,contentClassName, children , ...props}:Props)=>{

  return (
    <div {...props} className={cn("relative rounded-lg bg-gray-50 text-card-foreground",className)}>
      <div className={cn('relative z-10 p-6', contentClassName)}>
        {children}
      </div>
      <div className="absolute z-0 inset-px rounded-lg bg-white"/>
      <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5"/>
    </div>
  )
}