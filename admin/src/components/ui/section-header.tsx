import { cn } from "@/lib/utils"
import { AnimationWrapper } from "./animation-wrapper"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  align?: "left" | "center" | "right"
  animateOnView?: boolean
}

export function SectionHeader({
  title,
  description,
  className,
  align = "center",
  animateOnView = true,
}: SectionHeaderProps) {
  return (
    <AnimationWrapper
      variant="slide-up"
      duration={0.6}
      animateOnView={animateOnView}
      className={cn("mb-10", align === "center" && "text-center", align === "right" && "text-right", className)}
    >
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {title}
      </h2>

      {description && (
        <p className={cn("mt-4 text-muted-foreground", align === "center" && "mx-auto max-w-3xl")}>{description}</p>
      )}
    </AnimationWrapper>
  )
}
