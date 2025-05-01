"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { fetchWithAuth, login, logout } from "@/lib/api-helpers"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
          // Validate token by making a request to the API
          const userData = await fetchWithAuth("/auth/me")

          if (userData) {
            setUser(userData)
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("user")
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        // Clear storage on error
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await login(email, password)

      if (data && data.token && data.user) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)

        // Redirect based on user role
        if (data.user.role === "Admin") {
          router.push("/")
        } else {
          setError("Access denied. Admin privileges required.")
          await handleLogout()
        }
      } else {
        setError("Login failed. Invalid response from server.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await logout()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
