import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authApi } from '../../lib/api/auth-api';
import Cookies from 'js-cookie';

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive?: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,
  isLoading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      return response.data // Adjusted to return response.data directly
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to login")
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout()
    return null
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to logout")
  }
})

export const fetchCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch current user")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.accessToken
      state.isAuthenticated = true
      
      // Store token in both localStorage and cookies
      localStorage.setItem("accessToken", action.payload.accessToken)
      localStorage.setItem("admin_user", JSON.stringify(action.payload.user))
      Cookies.set("token", action.payload.accessToken, { path: "/" }) // Changed to "token" to match middleware
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("accessToken")
      localStorage.removeItem("admin_user")
      Cookies.remove("token", { path: "/" }) // Changed to "token" to match middleware
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
        
        // Store token in both localStorage and cookies with consistent names
        localStorage.setItem("accessToken", action.payload.accessToken)
        localStorage.setItem("admin_user", JSON.stringify(action.payload.user))
        Cookies.set("token", action.payload.accessToken, { path: "/" }) // Changed to "token" to match middleware
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem("accessToken")
        localStorage.removeItem("admin_user")
        Cookies.remove("token", { path: "/" }) // Changed to "token" to match middleware
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem("admin_user", JSON.stringify(action.payload))
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer