"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  // List of public paths that don't require authentication
  const publicPaths = ["/login", "/forgot-password", "/reset-password"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  useEffect(() => {
    // Wait a bit to ensure auth state is loaded from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Skip auth check for public paths
    if (isPublicPath) {
      return
    }

    // If not authenticated and done checking, redirect to login
    if (!isAuthenticated && !isChecking && !authLoading) {
      router.push("/login")
    }
  }, [isAuthenticated, router, pathname, isPublicPath, isChecking, authLoading])

  // If on a public path and already authenticated, redirect to dashboard
  useEffect(() => {
    if (isPublicPath && isAuthenticated && !isChecking) {
      router.push("/")
    }
  }, [pathname, isAuthenticated, router, isPublicPath, isChecking])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
