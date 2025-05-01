import { axiosInstance } from "./axios-instance"


export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken?: string
}

// Login user
// export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
//   try {
//     const response = await axiosInstance.post<AuthResponse>("/auth/login", credentials)
//     return handleApiResponse(response)
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

// // Get current user profile
// export const getCurrentUser = async (): Promise<User> => {
//   try {
//     const response = await axiosInstance.get<User>("/auth/me")
//     return handleApiResponse(response)
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

// // Refresh access token
// export const refreshAccessToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
//   try {
//     const response = await axiosInstance.post<TokenRefreshResponse>("/auth/refresh", { refreshToken })
//     return handleApiResponse(response)
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

// // Logout user
// export const logout = async (): Promise<void> => {
//   try {
//     const refreshToken = localStorage.getItem("refreshToken")
//     if (refreshToken) {
//       await axiosInstance.post("/auth/logout", { refreshToken })
//     }
//   } catch (error) {
//     console.error("Logout error:", error)
//   } finally {
//     // Clear local storage regardless of API response
//     localStorage.removeItem("token")
//     localStorage.removeItem("refreshToken")
//     localStorage.removeItem("user")
//   }
// }

// // Request password reset
// export const requestPasswordReset = async (email: string): Promise<void> => {
//   try {
//     const response = await axiosInstance.post("/auth/forgot-password", { email })
//     return handleApiResponse(response)
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

// // Reset password with token
// export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
//   try {
//     const response = await axiosInstance.post("/auth/reset-password", { token, newPassword })
//     return handleApiResponse(response)
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

// // Change password (authenticated)
// export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
//   try {
//     const response = await axiosInstance.post("/auth/change-password", { currentPassword, newPassword })
//     return handleApiResponse(response)
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

export const authApi = {
  login: (credentials: { email: string; password: string }) => {
    return axiosInstance.post("/auth/login", credentials)
  },
  logout: () => {
    return axiosInstance.post("/auth/logout")
  },
  getCurrentUser: () => {
    return axiosInstance.get("/auth/me")
  },
  forgotPassword: (email: string) => {
    return axiosInstance.post("/auth/forgot-password", { email })
  },
  resetPassword: (token: string, password: string) => {
    return axiosInstance.post("/auth/reset-password", { token, password })
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return axiosInstance.post("/auth/change-password", data)
  },
}
