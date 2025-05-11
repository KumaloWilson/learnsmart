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

// Helper function to ensure consistent state management
const persistAuthState = (token: string, user: User) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("admin_user", JSON.stringify(user));
  Cookies.set("token", token, { path: "/" });
};

const clearAuthState = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("admin_user");
  Cookies.remove("token", { path: "/" });
};

// Initialize auth state properly
const initialState: AuthState = {
  user: typeof window !== "undefined" ? 
    JSON.parse(localStorage.getItem("admin_user") || "null") : null,
  token: typeof window !== "undefined" ? 
    localStorage.getItem("accessToken") : null,
  isAuthenticated: typeof window !== "undefined" ? 
    !!localStorage.getItem("accessToken") : false,
  isLoading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      
      // Ensure the data has the expected structure
      if (!response.data?.accessToken || !response.data?.user) {
        return rejectWithValue("Invalid response format from server")
      }
      
      // Persist auth state right after successful API call
      persistAuthState(response.data.accessToken, response.data.user);
      
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to login")
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout()
    clearAuthState();
    return null
  } catch (error: any) {
    // Even if the logout API fails, we should clear local auth state
    clearAuthState();
    return rejectWithValue(error.message || "Failed to logout")
  }
})

export const fetchCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser()
    
    if (!response.data) {
      return rejectWithValue("Invalid response format from server")
    }
    
    return response.data
  } catch (error: any) {
    // If fetching user fails, clear auth state
    clearAuthState();
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
      persistAuthState(action.payload.accessToken, action.payload.user);
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      clearAuthState();
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
        // Persistence already handled in thunk
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        // Persistence already handled in thunk
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        state.token = null
        // Persistence already handled in thunk
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
        state.user = null
        state.token = null
        // Clear auth state when fetching user fails
        clearAuthState();
      })
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer