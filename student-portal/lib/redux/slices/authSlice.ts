import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent flash of unauthenticated content
  error: null,
}

// Load auth state from localStorage if available
if (typeof window !== "undefined") {
  try {
    const storedAuth = localStorage.getItem("auth")
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth)
      initialState.user = parsedAuth.user
      initialState.accessToken = parsedAuth.accessToken
      initialState.refreshToken = parsedAuth.refreshToken
      initialState.isAuthenticated = !!parsedAuth.accessToken
    }
  } catch (e) {
    console.error("Failed to parse stored auth data", e)
  } finally {
    initialState.isLoading = false
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      state.error = null
      state.isLoading = false

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user,
            accessToken,
            refreshToken,
          }),
        )
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false

      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth")
      }
    },
  },
})

export const { setCredentials, setLoading, setError, logout } = authSlice.actions

export default authSlice.reducer
