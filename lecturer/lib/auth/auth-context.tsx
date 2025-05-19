"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { AuthState, User, LecturerProfile } from "./types"
import * as authApi from "./auth-api"

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setLecturerProfile: (profile: LecturerProfile | null) => void
  setTokens: (accessToken: string | null, refreshToken: string | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
}

const initialState: AuthState = {
  user: null,
  lecturerProfile: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Initialize auth state from localStorage
      const accessToken = localStorage.getItem("accessToken")
      const refreshToken = localStorage.getItem("refreshToken")
      const userStr = localStorage.getItem("user")
      const lecturerProfileStr = localStorage.getItem("lecturerProfile")

      const user = userStr ? JSON.parse(userStr) : null
      const lecturerProfile = lecturerProfileStr ? JSON.parse(lecturerProfileStr) : null
      const isAuthenticated = !!accessToken && !!user

      setAuthState({
        ...authState,
        user,
        lecturerProfile,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading: false,
      })
    } else {
      setAuthState({
        ...authState,
        isLoading: false,
      })
    }
  }, [])

  // Add a useEffect to handle token persistence in cookies for middleware
  useEffect(() => {
    if (authState.accessToken) {
      // Set a cookie for the middleware to read
      document.cookie = `accessToken=${authState.accessToken}; path=/; max-age=86400; SameSite=Strict`
    } else {
      // Clear the cookie when logged out
      document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict"
    }
  }, [authState.accessToken])

  const login = async (email: string, password: string, rememberMe = false) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await authApi.login({ email, password })

      // Store auth data
      const { user, lecturerProfile, accessToken, refreshToken } = response

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("lecturerProfile", JSON.stringify(lecturerProfile))

      setAuthState({
        user,
        lecturerProfile,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || "Login failed. Please try again."
      setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
      throw error
    }
  }

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      if (authState.refreshToken) {
        await authApi.logout(authState.refreshToken)
      }
      clearAuth()
    } catch (error: any) {
      console.error("Logout error:", error)
      // Even if the API call fails, we still want to clear the local auth state
      clearAuth()
    }
  }

  const setUser = (user: User | null) => {
    setAuthState((prev) => ({ ...prev, user }))
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }

  const setLecturerProfile = (profile: LecturerProfile | null) => {
    setAuthState((prev) => ({ ...prev, lecturerProfile: profile }))
    if (profile) {
      localStorage.setItem("lecturerProfile", JSON.stringify(profile))
    } else {
      localStorage.removeItem("lecturerProfile")
    }
  }

  const setTokens = (accessToken: string | null, refreshToken: string | null) => {
    setAuthState((prev) => ({ ...prev, accessToken, refreshToken }))
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken)
    } else {
      localStorage.removeItem("accessToken")
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    } else {
      localStorage.removeItem("refreshToken")
    }
  }

  const setIsAuthenticated = (isAuthenticated: boolean) => {
    setAuthState((prev) => ({ ...prev, isAuthenticated }))
  }

  const setIsLoading = (isLoading: boolean) => {
    setAuthState((prev) => ({ ...prev, isLoading }))
  }

  const setError = (error: string | null) => {
    setAuthState((prev) => ({ ...prev, error }))
  }

  const clearAuth = () => {
    setAuthState({
      ...initialState,
      isLoading: false,
    })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("lecturerProfile")
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict"
  }

  const value = {
    ...authState,
    login,
    logout,
    setUser,
    setLecturerProfile,
    setTokens,
    setIsAuthenticated,
    setIsLoading,
    setError,
    clearAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
