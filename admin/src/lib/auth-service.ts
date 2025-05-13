import api from "./api"
import type {
  LoginCredentials,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ProfileUpdateRequest,
  User,
  RefreshTokenRequest,
} from "@/types/auth"
import { setSession, clearSession } from "./auth-utils"

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials)
    setSession(response.data)
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const request: RefreshTokenRequest = { refreshToken }
    const response = await api.post<LoginResponse>("/auth/refresh-token", request)
    setSession(response.data)
    return response.data
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const request: ForgotPasswordRequest = { email }
    const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", request)
    return response.data
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const request: ResetPasswordRequest = { token, password }
    const response = await api.post<{ message: string }>("/auth/reset-password", request)
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken })
    clearSession()
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const request: ChangePasswordRequest = { currentPassword, newPassword }
    const response = await api.post<{ message: string }>("/auth/change-password", request)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/profile")
    return response.data
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await api.put<User>("/profile", data)
    return response.data
  },
}

export default authService
