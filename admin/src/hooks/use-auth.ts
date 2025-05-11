"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchCurrentUser } from "@/store/slices/auth-slice"

export function useAuth(requireAdmin = false) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const [authChecked, setAuthChecked] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        try {
          await dispatch(fetchCurrentUser()).unwrap()
        } catch (error) {
          console.error("Error fetching current user:", error)
          // Error handled in the slice
        } finally {
          setAuthChecked(true)
        }
      } else {
        setAuthChecked(true)
      }
    }
    
    checkAuth()
  }, [dispatch, isAuthenticated, isLoading])

  // Handle redirects based on auth state
  useEffect(() => {
    // Only redirect after we've checked authentication
    if (!authChecked) return
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login")
        router.push("/login")
      } else if (requireAdmin && user?.role !== "admin") {
        console.log("Not an admin, redirecting to home")
        router.push("/")
      }
    }
  }, [authChecked, isLoading, isAuthenticated, user, router, requireAdmin])

  return { user, isAuthenticated, isLoading, authChecked }
}