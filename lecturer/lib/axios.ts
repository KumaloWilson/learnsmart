import axios from "axios"

const baseURL = "http://localhost:5000/api"

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Try to refresh the token
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Store the new tokens
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Retry the original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        localStorage.removeItem("lecturerProfile")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
