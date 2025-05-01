// Storage keys
const TOKEN_KEY = "accessToken" // Changed to match what's used in the auth-slice
const USER_KEY = "admin_user"

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

// Get user from localStorage
export const getUser = (): any | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

// Set user in localStorage
export const setUser = (user: any): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Remove user from localStorage
export const removeUser = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}

// Clear all auth data
export const clearAuth = (): void => {
  removeAuthToken()
  removeUser()
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

// Check if user has admin role
export const isAdmin = (): boolean => {
  const user = getUser()
  return user && user.role === "ADMIN"
}