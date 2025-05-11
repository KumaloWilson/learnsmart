"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { login as apiLogin, logout as apiLogout, refreshToken, getUserProfile } from "@/lib/api/auth-api"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  studentProfileId?: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken")
      const refreshTokenValue = localStorage.getItem("refreshToken")

      if (!token && !refreshTokenValue) {
        setLoading(false)
        if (
          !pathname?.startsWith("/(auth)") &&
          !pathname?.includes("/login") &&
          !pathname?.includes("/forgot-password")
        ) {
          router.push("/login")
        }
        return
      }

      try {
        // Try to get user profile with current token
        const userData = await getUserProfile()
        setUser(userData)
      } catch (error) {
        // If token is invalid, try to refresh
        if (refreshTokenValue) {
          try {
            const refreshData = await refreshToken(refreshTokenValue)
            localStorage.setItem("accessToken", refreshData.accessToken)
            localStorage.setItem("refreshToken", refreshData.refreshToken)

            const userData = await getUserProfile()
            setUser(userData)
          } catch (refreshError) {
            // If refresh fails, logout
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            if (
              !pathname?.startsWith("/(auth)") &&
              !pathname?.includes("/login") &&
              !pathname?.includes("/forgot-password")
            ) {
              router.push("/login")
            }
          }
        } else {
          // No refresh token, logout
          localStorage.removeItem("accessToken")
          if (
            !pathname?.startsWith("/(auth)") &&
            !pathname?.includes("/login") &&
            !pathname?.includes("/forgot-password")
          ) {
            router.push("/login")
          }
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [router, pathname])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken")
      if (refreshTokenValue) {
        await apiLogout(refreshTokenValue)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      setLoading(false)
      router.push("/login")
    }
  }

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
