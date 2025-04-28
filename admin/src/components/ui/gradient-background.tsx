"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GradientBackgroundProps {
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary" | "accent" | "muted" | "custom"
  customColors?: string
  animate?: boolean
}

export function GradientBackground({
  children,
  className,
  variant = "primary",
  customColors,
  animate = false,
}: GradientBackgroundProps) {
  // Define gradient variants
  const gradientVariants = {
    primary: "from-primary/20 via-muted to-secondary/10",
    secondary: "from-secondary/20 via-muted to-primary/10",
    accent: "from-accent/10 via-muted to-accent/5",
    muted: "from-muted-foreground/5 via-muted to-background",
    custom: customColors || "",
  }

  // Animation properties for subtle gradient movement
  const animationVariants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  }

  return (
    <motion.div
      className={cn("bg-gradient-to-r bg-[length:200%_100%]", gradientVariants[variant], className)}
      initial={animate ? "initial" : undefined}
      animate={animate ? "animate" : undefined}
      variants={animate ? animationVariants : undefined}
    >
      {children}
    </motion.div>
  )
}
