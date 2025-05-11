import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva("h-2 w-full overflow-hidden rounded-full bg-secondary", {
  variants: {
    indicatorColor: {
      default: "",
      "bg-primary": "",
      "bg-secondary": "",
      "bg-success": "",
      "bg-warning": "",
      "bg-destructive": "",
    },
  },
  defaultVariants: {
    indicatorColor: "default",
  },
})

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indicatorColor, ...props }, ref) => {
    const percentage = value != null ? Math.min(Math.max(value, 0), max) : 0
    const indicatorClassName = indicatorColor || "bg-primary"

    return (
      <div ref={ref} className={cn(progressVariants({ indicatorColor }), className)} {...props}>
        <div
          className={cn("h-full w-full flex-1 transition-all", indicatorClassName)}
          style={{ transform: `translateX(-${100 - (percentage / max) * 100}%)` }}
        />
      </div>
    )
  },
)
Progress.displayName = "Progress"

export { Progress }
