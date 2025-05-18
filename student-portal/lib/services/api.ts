const API_BASE_URL = "http://localhost:5000/api"

export const apiService = {
  request: async <T,>(endpoint: string, method = "GET", data = null, token = null) => {
    const url = API_BASE_URL + endpoint

    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = "Bearer " + token
    }

    const config = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "An error occurred")
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("An unknown error occurred")
    }
  },
}
