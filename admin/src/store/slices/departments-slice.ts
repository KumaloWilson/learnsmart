import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { departmentsApi } from "@/lib/api"

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  schoolId: string
  schoolName?: string
  createdAt?: string
  updatedAt?: string
}

interface DepartmentsState {
  departments: Department[]
  currentDepartment: Department | null
  isLoading: boolean
  error: string | null
}

const initialState: DepartmentsState = {
  departments: [],
  currentDepartment: null,
  isLoading: false,
  error: null,
}

export const fetchDepartments = createAsyncThunk("departments/fetchDepartments", async (_, { rejectWithValue }) => {
  try {
    const response = await departmentsApi.getDepartments()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch departments")
  }
})

export const fetchDepartmentById = createAsyncThunk(
  "departments/fetchDepartmentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.getDepartmentById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch department")
    }
  },
)

export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (departmentData: Omit<Department, "id">, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.createDepartment(departmentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create department")
    }
  },
)

export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, departmentData }: { id: string; departmentData: Partial<Department> }, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.updateDepartment(id, departmentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update department")
    }
  },
)

export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      await departmentsApi.deleteDepartment(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete department")
    }
  },
)

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    clearCurrentDepartment: (state) => {
      state.currentDepartment = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.isLoading = false
        state.departments = action.payload
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Department By Id
      .addCase(fetchDepartmentById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action: PayloadAction<Department>) => {
        state.isLoading = false
        state.currentDepartment = action.payload
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Department
      .addCase(createDepartment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.isLoading = false
        state.departments.push(action.payload)
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.isLoading = false
        const index = state.departments.findIndex((department) => department.id === action.payload.id)
        if (index !== -1) {
          state.departments[index] = action.payload
        }
        state.currentDepartment = action.payload
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Department
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.departments = state.departments.filter((department) => department.id !== action.payload)
        if (state.currentDepartment?.id === action.payload) {
          state.currentDepartment = null
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentDepartment, clearError } = departmentsSlice.actions

export default departmentsSlice.reducer
