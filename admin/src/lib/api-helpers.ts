// Updated API helpers to properly handle authentication and API calls

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  if (!token) {
    console.warn("No authentication token found for API call:", endpoint)
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`)
    }

    // Check if the response is empty
    const text = await response.text()
    return text ? JSON.parse(text) : null
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

export async function login(email: string, password: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Login failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Login failed:", error)
    throw error
  }
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
}
