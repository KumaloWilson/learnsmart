import axios from "axios"

// Create an Axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const accessToken = localStorage.getItem("accessToken")

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get refresh token from localStorage or cookies
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Call refresh token endpoint
        const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {
          refreshToken,
        })

        // Update tokens in localStorage or cookies
        localStorage.setItem("accessToken", response.data.accessToken)
        localStorage.setItem("refreshToken", response.data.refreshToken)

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`

        // Retry the original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
