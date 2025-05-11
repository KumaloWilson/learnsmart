import axios, { AxiosResponse } from "axios"
import { getAuthToken } from "../auth-utils"

// Create an Axios instance with default config
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor to add the auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = getAuthToken()

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
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
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Clear auth data from localStorage
            localStorage.removeItem("accessToken")
            localStorage.removeItem("admin_user")

            // Redirect to login page if we're in the browser
            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
        }

        return Promise.reject(error)
    },
)

/**
 * Handles successful API responses
 * @param {AxiosResponse} response - The axios response object
 * @returns {any} The response data
 */
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
    // Extract data from response
    return response.data
}

/**
 * Handles API errors
 * @param {unknown} error - The error object from axios
 * @throws {Error} Rethrows a formatted error
 */
export const handleApiError = (error: unknown): never => {
    // Get error details from the response if available
    const axiosError = error as any;
    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'An unknown error occurred'
    const statusCode = axiosError.response?.status

    // Log the error for debugging
    console.error(`API Error (${statusCode}):`, errorMessage)

    // Create a more informative error object
    const enhancedError = new Error(errorMessage) as any
    enhancedError.statusCode = statusCode
    enhancedError.originalError = error

    // Throw the enhanced error
    throw enhancedError
}

export default axiosInstance