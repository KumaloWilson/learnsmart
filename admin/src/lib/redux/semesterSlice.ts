import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Semester, CreateSemesterDto, UpdateSemesterDto } from "@/types/semester"
import semesterService from "@/lib/semester-service"

interface SemesterState {
  semesters: Semester[]
  currentSemester: Semester | null
  activeSemester: Semester | null
  isLoading: {
    semesters: boolean
    currentSemester: boolean
    activeSemester: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
  error: string | null
}

const initialState: SemesterState = {
  semesters: [],
  currentSemester: null,
  activeSemester: null,
  isLoading: {
    semesters: false,
    currentSemester: false,
    activeSemester: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
}

export const fetchSemesters = createAsyncThunk("semesters/fetchSemesters", async (_, { rejectWithValue }) => {
  try {
    return await semesterService.getSemesters()
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch semesters")
  }
})

export const fetchSemester = createAsyncThunk("semesters/fetchSemester", async (id: string, { rejectWithValue }) => {
  try {
    return await semesterService.getSemester(id)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch semester")
  }
})

export const fetchActiveSemester = createAsyncThunk("semesters/fetchActiveSemester", async (_, { rejectWithValue }) => {
  try {
    return await semesterService.getActiveSemester()
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch active semester")
  }
})

export const createSemester = createAsyncThunk(
  "semesters/createSemester",
  async (data: CreateSemesterDto, { rejectWithValue }) => {
    try {
      return await semesterService.createSemester(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to create semester")
    }
  },
)

export const updateSemester = createAsyncThunk(
  "semesters/updateSemester",
  async ({ id, data }: { id: string; data: UpdateSemesterDto }, { rejectWithValue }) => {
    try {
      return await semesterService.updateSemester(id, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to update semester")
    }
  },
)

export const deleteSemester = createAsyncThunk("semesters/deleteSemester", async (id: string, { rejectWithValue }) => {
  try {
    await semesterService.deleteSemester(id)
    return id
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to delete semester")
  }
})

const semesterSlice = createSlice({
  name: "semesters",
  initialState,
  reducers: {
    clearCurrentSemester: (state) => {
      state.currentSemester = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Semesters
      .addCase(fetchSemesters.pending, (state) => {
        state.isLoading.semesters = true
        state.error = null
      })
      .addCase(fetchSemesters.fulfilled, (state, action) => {
        state.isLoading.semesters = false
        state.semesters = action.payload
      })
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.isLoading.semesters = false
        state.error = action.payload as string
      })

      // Fetch Semester
      .addCase(fetchSemester.pending, (state) => {
        state.isLoading.currentSemester = true
        state.error = null
      })
      .addCase(fetchSemester.fulfilled, (state, action) => {
        state.isLoading.currentSemester = false
        state.currentSemester = action.payload
      })
      .addCase(fetchSemester.rejected, (state, action) => {
        state.isLoading.currentSemester = false
        state.error = action.payload as string
      })

      // Fetch Active Semester
      .addCase(fetchActiveSemester.pending, (state) => {
        state.isLoading.activeSemester = true
        state.error = null
      })
      .addCase(fetchActiveSemester.fulfilled, (state, action) => {
        state.isLoading.activeSemester = false
        state.activeSemester = action.payload
      })
      .addCase(fetchActiveSemester.rejected, (state, action) => {
        state.isLoading.activeSemester = false
        state.error = action.payload as string
      })

      // Create Semester
      .addCase(createSemester.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createSemester.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.semesters.push(action.payload)
        if (action.payload.isActive) {
          state.activeSemester = action.payload
        }
      })
      .addCase(createSemester.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update Semester
      .addCase(updateSemester.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.semesters.findIndex((semester) => semester.id === action.payload.id)
        if (index !== -1) {
          state.semesters[index] = action.payload
        }
        if (state.currentSemester?.id === action.payload.id) {
          state.currentSemester = action.payload
        }
        if (action.payload.isActive) {
          state.activeSemester = action.payload
        } else if (state.activeSemester?.id === action.payload.id) {
          state.activeSemester = null
        }
      })
      .addCase(updateSemester.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete Semester
      .addCase(deleteSemester.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.semesters = state.semesters.filter((semester) => semester.id !== action.payload)
        if (state.currentSemester?.id === action.payload) {
          state.currentSemester = null
        }
        if (state.activeSemester?.id === action.payload) {
          state.activeSemester = null
        }
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentSemester, clearError } = semesterSlice.actions
export default semesterSlice.reducer
