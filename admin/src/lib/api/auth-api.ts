import axiosInstance from "./axios-instance"

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials)
      return response
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Login failed")
      }
      throw new Error("Network error. Please try again.")
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout")
      return response
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Logout failed")
      }
      throw new Error("Network error. Please try again.")
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/me")
      return response
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to get current user")
      }
      throw new Error("Network error. Please try again.")
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh-token")
      return response
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to refresh token")
      }
      throw new Error("Network error. Please try again.")
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email })
      return response
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to send password reset email")
      }
      throw new Error("Network error. Please try again.")
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", { token, password })
      return response
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to reset password")
      }
      throw new Error("Network error. Please try again.")
    }
  },
}
