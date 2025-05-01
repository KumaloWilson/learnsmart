import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { semestersApi } from "@/lib/api"

export interface Semester {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface SemestersState {
  semesters: Semester[]
  currentSemester: Semester | null
  isLoading: boolean
  error: string | null
}

const initialState: SemestersState = {
  semesters: [],
  currentSemester: null,
  isLoading: false,
  error: null,
}

export const fetchSemesters = createAsyncThunk("semesters/fetchSemesters", async (_, { rejectWithValue }) => {
  try {
    const response = await semestersApi.getSemesters()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch semesters")
  }
})

export const fetchSemesterById = createAsyncThunk(
  "semesters/fetchSemesterById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await semestersApi.getSemesterById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch semester")
    }
  },
)

export const createSemester = createAsyncThunk(
  "semesters/createSemester",
  async (semesterData: Omit<Semester, "id">, { rejectWithValue }) => {
    try {
      const response = await semestersApi.createSemester(semesterData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create semester")
    }
  },
)

export const updateSemester = createAsyncThunk(
  "semesters/updateSemester",
  async ({ id, semesterData }: { id: string; semesterData: Partial<Semester> }, { rejectWithValue }) => {
    try {
      const response = await semestersApi.updateSemester(id, semesterData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update semester")
    }
  },
)

export const deleteSemester = createAsyncThunk("semesters/deleteSemester", async (id: string, { rejectWithValue }) => {
  try {
    await semestersApi.deleteSemester(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete semester")
  }
})

const semestersSlice = createSlice({
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
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSemesters.fulfilled, (state, action: PayloadAction<Semester[]>) => {
        state.isLoading = false
        state.semesters = action.payload
      })
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Semester By Id
      .addCase(fetchSemesterById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSemesterById.fulfilled, (state, action: PayloadAction<Semester>) => {
        state.isLoading = false
        state.currentSemester = action.payload
      })
      .addCase(fetchSemesterById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Semester
      .addCase(createSemester.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSemester.fulfilled, (state, action: PayloadAction<Semester>) => {
        state.isLoading = false
        state.semesters.push(action.payload)
      })
      .addCase(createSemester.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Semester
      .addCase(updateSemester.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSemester.fulfilled, (state, action: PayloadAction<Semester>) => {
        state.isLoading = false
        const index = state.semesters.findIndex((semester) => semester.id === action.payload.id)
        if (index !== -1) {
          state.semesters[index] = action.payload
        }
        state.currentSemester = action.payload
      })
      .addCase(updateSemester.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Semester
      .addCase(deleteSemester.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSemester.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.semesters = state.semesters.filter((semester) => semester.id !== action.payload)
        if (state.currentSemester?.id === action.payload) {
          state.currentSemester = null
        }
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentSemester, clearError } = semestersSlice.actions

export default semestersSlice.reducer
