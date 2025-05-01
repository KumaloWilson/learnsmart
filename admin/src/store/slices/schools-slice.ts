import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { schoolsApi } from "@/lib/api"

export interface School {
  id: string
  name: string
  code: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

interface SchoolsState {
  schools: School[]
  currentSchool: School | null
  isLoading: boolean
  error: string | null
}

const initialState: SchoolsState = {
  schools: [],
  currentSchool: null,
  isLoading: false,
  error: null,
}

export const fetchSchools = createAsyncThunk("schools/fetchSchools", async (_, { rejectWithValue }) => {
  try {
    const response = await schoolsApi.getSchools()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch schools")
  }
})

export const fetchSchoolById = createAsyncThunk("schools/fetchSchoolById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await schoolsApi.getSchoolById(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch school")
  }
})

export const createSchool = createAsyncThunk(
  "schools/createSchool",
  async (schoolData: Omit<School, "id">, { rejectWithValue }) => {
    try {
      const response = await schoolsApi.createSchool(schoolData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create school")
    }
  },
)

export const updateSchool = createAsyncThunk(
  "schools/updateSchool",
  async ({ id, schoolData }: { id: string; schoolData: Partial<School> }, { rejectWithValue }) => {
    try {
      const response = await schoolsApi.updateSchool(id, schoolData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update school")
    }
  },
)

export const deleteSchool = createAsyncThunk("schools/deleteSchool", async (id: string, { rejectWithValue }) => {
  try {
    await schoolsApi.deleteSchool(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete school")
  }
})

const schoolsSlice = createSlice({
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
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSchools.fulfilled, (state, action: PayloadAction<School[]>) => {
        state.isLoading = false
        state.schools = action.payload
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch School By Id
      .addCase(fetchSchoolById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSchoolById.fulfilled, (state, action: PayloadAction<School>) => {
        state.isLoading = false
        state.currentSchool = action.payload
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create School
      .addCase(createSchool.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSchool.fulfilled, (state, action: PayloadAction<School>) => {
        state.isLoading = false
        state.schools.push(action.payload)
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update School
      .addCase(updateSchool.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSchool.fulfilled, (state, action: PayloadAction<School>) => {
        state.isLoading = false
        const index = state.schools.findIndex((school) => school.id === action.payload.id)
        if (index !== -1) {
          state.schools[index] = action.payload
        }
        state.currentSchool = action.payload
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete School
      .addCase(deleteSchool.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSchool.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.schools = state.schools.filter((school) => school.id !== action.payload)
        if (state.currentSchool?.id === action.payload) {
          state.currentSchool = null
        }
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentSchool, clearError } = schoolsSlice.actions

export default schoolsSlice.reducer
