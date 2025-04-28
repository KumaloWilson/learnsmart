"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverCardEffectProps {
  children: ReactNode
  className?: string
  glowColor?: string
  borderColor?: string
  intensity?: "subtle" | "medium" | "strong"
}

export function HoverCardEffect({
  children,
  className,
  glowColor = "rgba(138, 43, 226, 0.2)", // Default purple glow
  borderColor = "rgba(138, 43, 226, 0.3)", // Default purple border
  intensity = "medium",
}: HoverCardEffectProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Intensity settings
  const intensitySettings = {
    subtle: {
      glowOpacity: 0.1,
      borderOpacity: 0.2,
      rotateX: 1,
      rotateY: 1,
      translateZ: 5,
    },
    medium: {
      glowOpacity: 0.15,
      borderOpacity: 0.3,
      rotateX: 2,
      rotateY: 2,
      translateZ: 10,
    },
    strong: {
      glowOpacity: 0.2,
      borderOpacity: 0.4,
      rotateX: 3,
      rotateY: 3,
      translateZ: 15,
    },
  }

  const settings = intensitySettings[intensity]

  // Handle mouse move to update glow position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  // Reset position when component unmounts or when isHovered changes
  useEffect(() => {
    if (!isHovered) {
      setMousePosition({ x: 0, y: 0 })
    }
  }, [isHovered])

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={{
        rotateX: isHovered ? mousePosition.y / 20 - settings.rotateX : 0,
        rotateY: isHovered ? -mousePosition.x / 20 + settings.rotateY : 0,
        translateZ: isHovered ? settings.translateZ : 0,
        boxShadow: isHovered ? `0 10px 30px -15px ${glowColor}` : "0 0 0 0 transparent",
        border: isHovered ? `1px solid ${borderColor}` : "1px solid transparent",
      }}
      style={{
        transformStyle: "preserve-3d",
        transition: "box-shadow 0.3s ease, border 0.3s ease",
      }}
    >
      {/* Glow effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor} 0%, transparent 70%)`,
            opacity: settings.glowOpacity,
            mixBlendMode: "soft-light",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: settings.glowOpacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
