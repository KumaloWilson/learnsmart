"use client"

import type React from "react"
import { createContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoginForm } from "@/components/login-form"

interface User {
  id: string
  email: string
  role: string
  name?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("AuthProvider: Checking authentication status")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.log("AuthProvider: No token found")
          setIsLoading(false)
          return
        }

        // Validate token with backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        console.log(`AuthProvider: Validating token at ${apiUrl}/auth/profile`)

        const response = await fetch(`${apiUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          console.log("AuthProvider: Token valid, user data:", userData)
          setUser(userData)
        } else {
          console.log("AuthProvider: Token invalid, clearing")
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
        }
      } catch (error) {
        console.error("AuthProvider: Auth check failed:", error)
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
      console.log("AuthProvider: Login function called with email:", email)
      setIsLoading(true)

      try {
        // For testing/debugging - create a mock successful response
        // This will help us verify if the function is being called correctly
        console.log("AuthProvider: Creating mock successful login")

        // Set mock user data
        const mockUser = {
          id: "1",
          email: email,
          role: "admin",
          name: "Admin User",
        }

        // Store mock tokens
        localStorage.setItem("token", "mock-token-12345")
        localStorage.setItem("refreshToken", "mock-refresh-token-12345")

        // Set user state
        setUser(mockUser)

        // Log success
        console.log("AuthProvider: Mock login successful")
        console.log("AuthProvider: Redirecting to dashboard")

        // Redirect to dashboard
        router.push("/")
        return

        // The code below is the actual API implementation
        // Uncomment this and remove the mock code above when ready to connect to the real API
        /*
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        console.log("AuthProvider: Making API request to:", `${apiUrl}/auth/login`)

        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        console.log("AuthProvider: API response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Login failed" }))
          console.error("AuthProvider: Login API error:", errorData)
          throw new Error(errorData.message || "Login failed")
        }

        const data = await response.json()
        console.log("AuthProvider: Login successful, received data:", {
          accessToken: data.accessToken ? "exists" : "missing",
          refreshToken: data.refreshToken ? "exists" : "missing",
          user: data.user ? "exists" : "missing",
        })

        // Store tokens
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        // Set user data
        setUser(data.user)

        // Redirect to dashboard
        console.log("AuthProvider: Redirecting to dashboard")
        router.push("/")
        */
      } catch (error) {
        console.error("AuthProvider: Login failed:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  // Logout function
  const logout = useCallback(() => {
    console.log("AuthProvider: Logout called")

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
    console.log("AuthProvider: User not logged in, showing login form")
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <LoginForm />
      </div>
    )
  }

  console.log("AuthProvider: Rendering children with auth context")
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
