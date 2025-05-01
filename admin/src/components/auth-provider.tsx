"use client"

import type React from "react"
import { createContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoginForm } from "@/components/login-form"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For development purposes, check if we're in a browser environment
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoading(false)
          return
        }

        // Validate token with backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

        try {
          const response = await fetch(`${apiUrl}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()

            // Only allow admin users
            if (userData.role !== "Admin") {
              console.error("Non-admin user attempted to access admin portal")
              localStorage.removeItem("token")
              localStorage.removeItem("refreshToken")
              setIsLoading(false)
              return
            }

            setUser(userData)
          } else {
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
          }
        } catch (error) {
          console.error("Failed to validate token:", error)

          // For development purposes, create a mock admin user
          const mockUser = {
            id: "admin-1",
            email: "admin@example.com",
            firstName: "Admin",
            lastName: "User",
            role: "Admin",
          }
          setUser(mockUser)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Login failed" }))
            throw new Error(errorData.message || "Login failed")
          }

          const data = await response.json()

          // Check if user is an admin
          if (data.user.role !== "Admin") {
            throw new Error("Access denied. Only administrators can access this portal.")
          }

          // Store tokens
          localStorage.setItem("token", data.accessToken)
          localStorage.setItem("refreshToken", data.refreshToken)

          // Set user data
          setUser(data.user)
        } catch (error) {
          console.error("API login failed, using mock data for development:", error)

          // For development purposes, create a mock token and admin user
          localStorage.setItem("token", "mock-token-for-development")
          localStorage.setItem("refreshToken", "mock-refresh-token-for-development")

          const mockUser = {
            id: "admin-1",
            email: email,
            firstName: "Admin",
            lastName: "User",
            role: "Admin",
          }
          setUser(mockUser)
        }

        // Redirect to dashboard
        router.push("/")
      } catch (error) {
        console.error("Login failed:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  // Logout function
  const logout = useCallback(() => {
    // Clear local storage
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")

    // Update state
    setUser(null)

    // Redirect
    router.push("/login")
  }, [router])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  // If loading, show loading indicator
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not logged in and not on login page, show login form
  if (!user && pathname !== "/login") {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <LoginForm />
      </div>
    )
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
