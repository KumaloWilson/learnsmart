import axios from "axios"
import type { LoginRequest, LoginResponse } from "@/features/auth/types"

const API_URL = "https://learnsmart-6i9q.onrender.com/api"

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  logout(): void {
    if (isBrowser) {
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("studentProfile")

      // Also remove cookies
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },

  saveUserData(data: LoginResponse): void {
    if (isBrowser) {
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("studentProfile", JSON.stringify(data.studentProfile))

      // Also set cookies for server-side auth
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=2592000` // 30 days
    }
  },

  getUserData(): LoginResponse | null {
    if (!isBrowser) {
      return null
    }

    const user = localStorage.getItem("user")
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    const studentProfile = localStorage.getItem("studentProfile")

    if (!user || !accessToken || !refreshToken || !studentProfile) {
      return null
    }

    return {
      user: JSON.parse(user),
      accessToken,
      refreshToken,
      studentProfile: JSON.parse(studentProfile),
    }
  },
}
