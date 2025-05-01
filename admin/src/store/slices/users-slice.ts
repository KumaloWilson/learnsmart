import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { User, usersApi } from "@/lib/api/users-api"

interface UsersState {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await usersApi.getUsers()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users")
  }
})

export const fetchUserById = createAsyncThunk("users/fetchUserById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await usersApi.getUserById(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user")
  }
})

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: Omit<User, "id">, { rejectWithValue }) => {
    try {
      const response = await usersApi.createUser(userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create user")
    }
  },
)

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateUser(id, userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user")
    }
  },
)

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateUserStatus(id, isActive)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user status")
    }
  },
)

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user")
    }
  },
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        state.currentUser = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserStatus.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.users = state.users.filter(user => user.id !== action.payload)
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentUser, clearError } = usersSlice.actions

export default usersSlice.reducer