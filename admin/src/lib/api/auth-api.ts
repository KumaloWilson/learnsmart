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
