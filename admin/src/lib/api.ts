import axios from "axios"
import { getSession, setSession, clearSession } from "./auth-utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://learnsmart-6i9q.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const session = getSession()
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const session = getSession()
        if (!session?.refreshToken) {
          throw new Error("No refresh token available")
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: session.refreshToken,
        })

        const { accessToken, refreshToken, user } = response.data

        // Update session with new tokens
        setSession({ user, accessToken, refreshToken })

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear session and redirect to login
        clearSession()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
