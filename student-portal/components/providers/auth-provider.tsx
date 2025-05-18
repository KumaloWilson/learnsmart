"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { restoreAuthState } from "@/lib/redux/slices/authSlice"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Public routes that don't require authentication
const publicRoutes = ["/login", "/forgot-password", "/reset-password"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore auth state from localStorage on initial load
    const restoreAuth = async () => {
      await dispatch(restoreAuthState())
      setIsLoading(false)
    }

    restoreAuth()
  }, [dispatch])

  useEffect(() => {
    // Only run redirection logic after auth state is restored
    if (!isLoading) {
      // Check if the current route is a public route
      const isPublicRoute = publicRoutes.some((route) => {
        if (route === "/reset-password" && pathname.startsWith("/reset-password")) {
          return true
        }
        return pathname === route
      })

      // Redirect logic based on authentication status
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login")
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/")
      }
    }
  }, [isAuthenticated, pathname, router, isLoading])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
