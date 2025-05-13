import { axiosInstance } from "./axios-instance"

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    studentProfileId?: string
    avatarUrl?: string
  }
}

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await axiosInstance.post("/auth/login", { email, password })
  return response.data
}

export async function logout(refreshToken: string): Promise<void> {
  await axiosInstance.post("/auth/logout", { refreshToken })
}

export async function refreshToken(token: string): Promise<RefreshTokenResponse> {
  const response = await axiosInstance.post("/auth/refresh-token", { refreshToken: token })
  return response.data
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await axiosInstance.post("/auth/forgot-password", { email })
  return response.data
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password })
  return response.data
}

export async function getUserProfile() {
  const response = await axiosInstance.get("/auth/me")
  return response.data
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await axiosInstance.post("/auth/update-password", { currentPassword, newPassword })
  return response.data
}
