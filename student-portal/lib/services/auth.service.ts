import { apiService } from "./api"
import type { AuthResponse, LoginCredentials } from "@/lib/types/auth.types"

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiService.request<AuthResponse>("/auth/login", "POST", credentials)

      // Store the entire response in localStorage
      localStorage.setItem("authData", JSON.stringify(response))

      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Login failed")
    }
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem("authData")
  },

  /**
   * Get stored auth data from localStorage
   */
  getStoredAuthData: (): AuthResponse | null => {
    const authData = localStorage.getItem("authData")
    if (authData) {
      return JSON.parse(authData) as AuthResponse
    }
    return null
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const authData = authService.getStoredAuthData()
    return !!authData?.accessToken
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      return await apiService.request<{ message: string }>("/auth/forgot-password", "POST", { email })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Password reset request failed")
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    try {
      return await apiService.request<{ message: string }>("/auth/reset-password", "POST", { token, password })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Password reset failed")
    }
  },
}
