import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("accessToken")

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem("accessToken")
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Store the new tokens
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Retry the original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
