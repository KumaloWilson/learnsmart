"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimationWrapperProps {
  children: ReactNode
  className?: string

  // Animation variants
  variant?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "none"

  // Animation settings
  duration?: number
  delay?: number

  // Whether to animate when in view (for scroll animations)
  animateOnView?: boolean

  // Animation once or every time
  once?: boolean
}

export function AnimationWrapper({
  children,
  className,
  variant = "fade",
  duration = 0.5,
  delay = 0,
  animateOnView = false,
  once = true,
}: AnimationWrapperProps) {
  // Define animation variants
  const variants = {
    hidden: {
      opacity: 0,
      y: variant === "slide-up" ? 20 : variant === "slide-down" ? -20 : 0,
      x: variant === "slide-left" ? 20 : variant === "slide-right" ? -20 : 0,
      scale: variant === "scale" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Improved easing curve for smoother motion
      },
    },
    exit: {
      opacity: 0,
      y: variant === "slide-up" ? -20 : variant === "slide-down" ? 20 : 0,
      x: variant === "slide-left" ? -20 : variant === "slide-right" ? 20 : 0,
      scale: variant === "scale" ? 0.95 : 1,
      transition: {
        duration: duration * 0.75, // Slightly faster exit for better UX
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  // If no animation is desired
  if (variant === "none") {
    return <div className={className}>{children}</div>
  }

  // For scroll-triggered animations
  if (animateOnView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        variants={variants}
      >
        {children}
      </motion.div>
    )
  }

  // For immediate animations
  return (
    <motion.div className={cn(className)} initial="hidden" animate="visible" exit="exit" variants={variants}>
      {children}
    </motion.div>
  )
}

// For page transitions
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// For staggered children animations
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  duration = 0.5,
  animateOnView = false,
  once = true,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
  duration?: number
  animateOnView?: boolean
  once?: boolean
}) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  if (animateOnView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        variants={containerVariants}
      >
        {React.Children.map(children, (child) => (
          <motion.div variants={childVariants}>{child}</motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div className={className} initial="hidden" animate="visible" variants={containerVariants}>
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
