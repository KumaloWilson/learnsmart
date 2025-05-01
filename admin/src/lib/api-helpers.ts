const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null // Return null during SSR
  }

  const token = localStorage.getItem("token")

  // If no token is available, return fallback data instead of throwing an error
  if (!token) {
    console.warn("No authentication token found, returning fallback data")
    return null
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await refreshToken()

      if (refreshed) {
        // Retry with new token
        return fetchWithAuth(endpoint, options)
      } else {
        // Refresh failed, redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        throw new Error("Authentication failed")
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "API request failed" }))
      throw new Error(errorData.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    localStorage.setItem("token", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)

    return true
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred"
}
