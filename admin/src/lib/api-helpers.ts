export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken")
  
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}${url}`, {
      ...options,
      headers,
    })
  }
  