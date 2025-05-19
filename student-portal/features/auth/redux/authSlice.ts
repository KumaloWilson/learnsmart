import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "@/features/auth/services/auth-service"
import type { LoginRequest, LoginResponse, User, StudentProfile } from "@/features/auth/types"

interface AuthState {
  user: User | null
  studentProfile: StudentProfile | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Check if user is already logged in - safely for SSR
const userData = typeof window !== "undefined" ? authService.getUserData() : null

const initialState: AuthState = {
  user: userData?.user || null,
  studentProfile: userData?.studentProfile || null,
  accessToken: userData?.accessToken || null,
  refreshToken: userData?.refreshToken || null,
  isAuthenticated: !!userData,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      authService.saveUserData(response)
      return response
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout()
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.studentProfile = action.payload.studentProfile
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.studentProfile = null
        state.accessToken = null
        state.refreshToken = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
