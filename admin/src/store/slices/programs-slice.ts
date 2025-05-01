import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { programsApi } from "@/lib/api"

export interface Program {
  id: string
  name: string
  code: string
  description?: string
  level: "undergraduate" | "postgraduate" | "doctorate"
  durationYears: number
  departmentId: string
  departmentName?: string
  createdAt?: string
  updatedAt?: string
}

interface ProgramsState {
  programs: Program[]
  currentProgram: Program | null
  isLoading: boolean
  error: string | null
}

const initialState: ProgramsState = {
  programs: [],
  currentProgram: null,
  isLoading: false,
  error: null,
}

export const fetchPrograms = createAsyncThunk("programs/fetchPrograms", async (_, { rejectWithValue }) => {
  try {
    const response = await programsApi.getPrograms()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch programs")
  }
})

export const fetchProgramById = createAsyncThunk(
  "programs/fetchProgramById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await programsApi.getProgramById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch program")
    }
  },
)

export const createProgram = createAsyncThunk(
  "programs/createProgram",
  async (programData: Omit<Program, "id">, { rejectWithValue }) => {
    try {
      const response = await programsApi.createProgram(programData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create program")
    }
  },
)

export const updateProgram = createAsyncThunk(
  "programs/updateProgram",
  async ({ id, programData }: { id: string; programData: Partial<Program> }, { rejectWithValue }) => {
    try {
      const response = await programsApi.updateProgram(id, programData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update program")
    }
  },
)

export const deleteProgram = createAsyncThunk("programs/deleteProgram", async (id: string, { rejectWithValue }) => {
  try {
    await programsApi.deleteProgram(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete program")
  }
})

const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    clearCurrentProgram: (state) => {
      state.currentProgram = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Programs
      .addCase(fetchPrograms.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPrograms.fulfilled, (state, action: PayloadAction<Program[]>) => {
        state.isLoading = false
        state.programs = action.payload
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Program By Id
      .addCase(fetchProgramById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProgramById.fulfilled, (state, action: PayloadAction<Program>) => {
        state.isLoading = false
        state.currentProgram = action.payload
      })
      .addCase(fetchProgramById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Program
      .addCase(createProgram.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProgram.fulfilled, (state, action: PayloadAction<Program>) => {
        state.isLoading = false
        state.programs.push(action.payload)
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Program
      .addCase(updateProgram.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProgram.fulfilled, (state, action: PayloadAction<Program>) => {
        state.isLoading = false
        const index = state.programs.findIndex((program) => program.id === action.payload.id)
        if (index !== -1) {
          state.programs[index] = action.payload
        }
        state.currentProgram = action.payload
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Program
      .addCase(deleteProgram.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProgram.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.programs = state.programs.filter((program) => program.id !== action.payload)
        if (state.currentProgram?.id === action.payload) {
          state.currentProgram = null
        }
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentProgram, clearError } = programsSlice.actions

export default programsSlice.reducer
