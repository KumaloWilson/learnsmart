"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name?: string
  role: string
  [key: string]: any
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("userData")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    console.log("useAuth: Login called with email:", email)

    try {
      // For demo purposes, accept any credentials
      const userData = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "admin",
      }

      // Store in localStorage
      localStorage.setItem("token", "mock-token-12345")
      localStorage.setItem("refreshToken", "mock-refresh-token-12345")
      localStorage.setItem("userData", JSON.stringify(userData))

      // Update state
      setUser(userData)

      return userData
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    console.log("useAuth: Logout called")

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userData")

    // Update state
    setUser(null)

    // Redirect to login
    router.push("/login")
  }, [router])

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
