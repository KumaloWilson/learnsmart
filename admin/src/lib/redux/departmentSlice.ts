import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/department"
import departmentService from "@/lib/department-service"

interface DepartmentState {
  departments: Department[]
  currentDepartment: Department | null
  isLoading: {
    departments: boolean
    currentDepartment: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
  error: string | null
}

const initialState: DepartmentState = {
  departments: [],
  currentDepartment: null,
  isLoading: {
    departments: false,
    currentDepartment: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
}

export const fetchDepartments = createAsyncThunk("departments/fetchDepartments", async (_, { rejectWithValue }) => {
  try {
    return await departmentService.getDepartments()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch departments")
  }
})

export const fetchDepartment = createAsyncThunk(
  "departments/fetchDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      return await departmentService.getDepartment(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch department")
    }
  },
)

export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (data: CreateDepartmentDto, { rejectWithValue }) => {
    try {
      return await departmentService.createDepartment(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create department")
    }
  },
)

export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, data }: { id: string; data: UpdateDepartmentDto }, { rejectWithValue }) => {
    try {
      return await departmentService.updateDepartment(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update department")
    }
  },
)

export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      await departmentService.deleteDepartment(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete department")
    }
  },
)

const departmentSlice = createSlice({
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
        state.isLoading.departments = true
        state.error = null
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoading.departments = false
        state.departments = action.payload
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading.departments = false
        state.error = action.payload as string
      })

      // Fetch Department
      .addCase(fetchDepartment.pending, (state) => {
        state.isLoading.currentDepartment = true
        state.error = null
      })
      .addCase(fetchDepartment.fulfilled, (state, action) => {
        state.isLoading.currentDepartment = false
        state.currentDepartment = action.payload
      })
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.isLoading.currentDepartment = false
        state.error = action.payload as string
      })

      // Create Department
      .addCase(createDepartment.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.departments.push(action.payload)
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.departments.findIndex((department) => department.id === action.payload.id)
        if (index !== -1) {
          state.departments[index] = action.payload
        }
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete Department
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.departments = state.departments.filter((department) => department.id !== action.payload)
        if (state.currentDepartment?.id === action.payload) {
          state.currentDepartment = null
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentDepartment, clearError } = departmentSlice.actions
export default departmentSlice.reducer
