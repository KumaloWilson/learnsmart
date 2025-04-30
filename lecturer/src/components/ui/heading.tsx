import type React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs"
  children: React.ReactNode
  className?: string
}

export function Heading({ as: Component = "h2", size = "lg", children, className }: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-semibold leading-tight tracking-tight",
        size === "4xl" && "text-4xl",
        size === "3xl" && "text-3xl",
        size === "2xl" && "text-2xl",
        size === "xl" && "text-xl",
        size === "lg" && "text-lg",
        size === "md" && "text-base",
        size === "sm" && "text-sm",
        size === "xs" && "text-xs",
        className,
      )}
    >
      {children}
    </Component>
  )
}
