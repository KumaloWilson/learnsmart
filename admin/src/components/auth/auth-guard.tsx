"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/forgot-password", "/reset-password"]
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login")
    } else if (isAuthenticated && isPublicRoute) {
      router.push("/")
    }

    setIsChecking(false)
  }, [isAuthenticated, pathname, router])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only render children if authenticated or on a public route
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  if (isAuthenticated || isPublicRoute) {
    return <>{children}</>
  }

  return null
}
