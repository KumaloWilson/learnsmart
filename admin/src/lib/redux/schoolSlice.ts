import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { School, CreateSchoolDto, UpdateSchoolDto } from "@/types/school"
import schoolService from "@/lib/school-service"

interface SchoolState {
  schools: School[]
  currentSchool: School | null
  isLoading: {
    schools: boolean
    currentSchool: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
  error: string | null
}

const initialState: SchoolState = {
  schools: [],
  currentSchool: null,
  isLoading: {
    schools: false,
    currentSchool: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
}

export const fetchSchools = createAsyncThunk("schools/fetchSchools", async (_, { rejectWithValue }) => {
  try {
    return await schoolService.getSchools()
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch schools")
  }
})

export const fetchSchool = createAsyncThunk("schools/fetchSchool", async (id: string, { rejectWithValue }) => {
  try {
    return await schoolService.getSchool(id)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch school")
  }
})

export const createSchool = createAsyncThunk(
  "schools/createSchool",
  async (data: CreateSchoolDto, { rejectWithValue }) => {
    try {
      return await schoolService.createSchool(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to create school")
    }
  },
)

export const updateSchool = createAsyncThunk(
  "schools/updateSchool",
  async ({ id, data }: { id: string; data: UpdateSchoolDto }, { rejectWithValue }) => {
    try {
      return await schoolService.updateSchool(id, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to update school")
    }
  },
)

export const deleteSchool = createAsyncThunk("schools/deleteSchool", async (id: string, { rejectWithValue }) => {
  try {
    await schoolService.deleteSchool(id)
    return id
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to delete school")
  }
})

const schoolSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {
    clearCurrentSchool: (state) => {
      state.currentSchool = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Schools
      .addCase(fetchSchools.pending, (state) => {
        state.isLoading.schools = true
        state.error = null
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.isLoading.schools = false
        state.schools = action.payload
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.isLoading.schools = false
        state.error = action.payload as string
      })

      // Fetch School
      .addCase(fetchSchool.pending, (state) => {
        state.isLoading.currentSchool = true
        state.error = null
      })
      .addCase(fetchSchool.fulfilled, (state, action) => {
        state.isLoading.currentSchool = false
        state.currentSchool = action.payload
      })
      .addCase(fetchSchool.rejected, (state, action) => {
        state.isLoading.currentSchool = false
        state.error = action.payload as string
      })

      // Create School
      .addCase(createSchool.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.schools.push(action.payload)
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update School
      .addCase(updateSchool.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.schools.findIndex((school) => school.id === action.payload.id)
        if (index !== -1) {
          state.schools[index] = action.payload
        }
        if (state.currentSchool?.id === action.payload.id) {
          state.currentSchool = action.payload
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete School
      .addCase(deleteSchool.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.schools = state.schools.filter((school) => school.id !== action.payload)
        if (state.currentSchool?.id === action.payload) {
          state.currentSchool = null
        }
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentSchool, clearError } = schoolSlice.actions
export default schoolSlice.reducer
