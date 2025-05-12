import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Period, CreatePeriodDto, UpdatePeriodDto } from "@/types/period"
import periodService from "@/lib/period-service"

interface PeriodState {
  periods: Period[]
  semesterPeriods: Period[]
  currentPeriod: Period | null
  isLoading: {
    periods: boolean
    semesterPeriods: boolean
    currentPeriod: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
  error: string | null
}

const initialState: PeriodState = {
  periods: [],
  semesterPeriods: [],
  currentPeriod: null,
  isLoading: {
    periods: false,
    semesterPeriods: false,
    currentPeriod: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
}

export const fetchPeriods = createAsyncThunk("periods/fetchPeriods", async (_, { rejectWithValue }) => {
  try {
    return await periodService.getPeriods()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch periods")
  }
})

export const fetchPeriod = createAsyncThunk("periods/fetchPeriod", async (id: string, { rejectWithValue }) => {
  try {
    return await periodService.getPeriod(id)
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch period")
  }
})

export const fetchPeriodsBySemester = createAsyncThunk(
  "periods/fetchPeriodsBySemester",
  async (semesterId: string, { rejectWithValue }) => {
    try {
      return await periodService.getPeriodsBySemester(semesterId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch periods by semester")
    }
  },
)

export const createPeriod = createAsyncThunk(
  "periods/createPeriod",
  async (data: CreatePeriodDto, { rejectWithValue }) => {
    try {
      return await periodService.createPeriod(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create period")
    }
  },
)

export const updatePeriod = createAsyncThunk(
  "periods/updatePeriod",
  async ({ id, data }: { id: string; data: UpdatePeriodDto }, { rejectWithValue }) => {
    try {
      return await periodService.updatePeriod(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update period")
    }
  },
)

export const deletePeriod = createAsyncThunk("periods/deletePeriod", async (id: string, { rejectWithValue }) => {
  try {
    await periodService.deletePeriod(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete period")
  }
})

const periodSlice = createSlice({
  name: "periods",
  initialState,
  reducers: {
    clearCurrentPeriod: (state) => {
      state.currentPeriod = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Periods
      .addCase(fetchPeriods.pending, (state) => {
        state.isLoading.periods = true
        state.error = null
      })
      .addCase(fetchPeriods.fulfilled, (state, action) => {
        state.isLoading.periods = false
        state.periods = action.payload
      })
      .addCase(fetchPeriods.rejected, (state, action) => {
        state.isLoading.periods = false
        state.error = action.payload as string
      })

      // Fetch Period
      .addCase(fetchPeriod.pending, (state) => {
        state.isLoading.currentPeriod = true
        state.error = null
      })
      .addCase(fetchPeriod.fulfilled, (state, action) => {
        state.isLoading.currentPeriod = false
        state.currentPeriod = action.payload
      })
      .addCase(fetchPeriod.rejected, (state, action) => {
        state.isLoading.currentPeriod = false
        state.error = action.payload as string
      })

      // Fetch Periods By Semester
      .addCase(fetchPeriodsBySemester.pending, (state) => {
        state.isLoading.semesterPeriods = true
        state.error = null
      })
      .addCase(fetchPeriodsBySemester.fulfilled, (state, action) => {
        state.isLoading.semesterPeriods = false
        state.semesterPeriods = action.payload
      })
      .addCase(fetchPeriodsBySemester.rejected, (state, action) => {
        state.isLoading.semesterPeriods = false
        state.error = action.payload as string
      })

      // Create Period
      .addCase(createPeriod.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createPeriod.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.periods.push(action.payload)
        if (state.semesterPeriods.length > 0 && state.semesterPeriods[0].semesterId === action.payload.semesterId) {
          state.semesterPeriods.push(action.payload)
        }
      })
      .addCase(createPeriod.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update Period
      .addCase(updatePeriod.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updatePeriod.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.periods.findIndex((period) => period.id === action.payload.id)
        if (index !== -1) {
          state.periods[index] = action.payload
        }
        const semesterIndex = state.semesterPeriods.findIndex((period) => period.id === action.payload.id)
        if (semesterIndex !== -1) {
          state.semesterPeriods[semesterIndex] = action.payload
        }
        if (state.currentPeriod?.id === action.payload.id) {
          state.currentPeriod = action.payload
        }
      })
      .addCase(updatePeriod.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete Period
      .addCase(deletePeriod.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deletePeriod.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.periods = state.periods.filter((period) => period.id !== action.payload)
        state.semesterPeriods = state.semesterPeriods.filter((period) => period.id !== action.payload)
        if (state.currentPeriod?.id === action.payload) {
          state.currentPeriod = null
        }
      })
      .addCase(deletePeriod.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentPeriod, clearError } = periodSlice.actions
export default periodSlice.reducer
