import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User, LoginCredentials, ProfileUpdateRequest } from "@/types/auth"
import authService from "@/lib/auth-service"
import { getSession, clearSession } from "@/lib/auth-utils"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: getSession()?.user || null,
  isAuthenticated: !!getSession()?.accessToken,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials)
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed")
  }
})

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getSession()?.refreshToken || ""
    await authService.logout(refreshToken)
    clearSession()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed")
  }
})

export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to get profile")
  }
})

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: ProfileUpdateRequest, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
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
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer
