import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

function Heading({ children, className, ...prop }: Props) {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl lg:text-6xl text-pretty font-heading font-semibold tracking-tight text-zinc-800",
        className
      )}
      {...prop}
    >
      {children}
    </h1>
  );
}

export default Heading;
