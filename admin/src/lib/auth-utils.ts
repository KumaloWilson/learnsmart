import Cookies from 'js-cookie';

// Storage keys - ensure consistency
const TOKEN_KEY = "accessToken"
const COOKIE_TOKEN_KEY = "token"  // For middleware compatibility
const USER_KEY = "admin_user"

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

// Set auth token in localStorage and cookies
export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  Cookies.set(COOKIE_TOKEN_KEY, token, { path: "/" })
}

// Remove auth token from localStorage and cookies
export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  Cookies.remove(COOKIE_TOKEN_KEY, { path: "/" })
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
  return user && user.role === "admin" 
}