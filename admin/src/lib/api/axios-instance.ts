import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)
