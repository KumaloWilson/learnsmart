import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Program, CreateProgramDto, UpdateProgramDto } from "@/types/program"
import programService from "@/lib/program-service"

interface ProgramState {
  programs: Program[]
  currentProgram: Program | null
  isLoading: {
    programs: boolean
    currentProgram: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
  error: string | null
}

const initialState: ProgramState = {
  programs: [],
  currentProgram: null,
  isLoading: {
    programs: false,
    currentProgram: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
}

export const fetchPrograms = createAsyncThunk("programs/fetchPrograms", async (_, { rejectWithValue }) => {
  try {
    return await programService.getPrograms()
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch programs")
  }
})

export const fetchProgram = createAsyncThunk("programs/fetchProgram", async (id: string, { rejectWithValue }) => {
  try {
    return await programService.getProgram(id)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch program")
  }
})

export const createProgram = createAsyncThunk(
  "programs/createProgram",
  async (data: CreateProgramDto, { rejectWithValue }) => {
    try {
      return await programService.createProgram(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to create program")
    }
  },
)

export const updateProgram = createAsyncThunk(
  "programs/updateProgram",
  async ({ id, data }: { id: string; data: UpdateProgramDto }, { rejectWithValue }) => {
    try {
      return await programService.updateProgram(id, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to update program")
    }
  },
)

export const deleteProgram = createAsyncThunk("programs/deleteProgram", async (id: string, { rejectWithValue }) => {
  try {
    await programService.deleteProgram(id)
    return id
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to delete program")
  }
})

const programSlice = createSlice({
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
        state.isLoading.programs = true
        state.error = null
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.isLoading.programs = false
        state.programs = action.payload
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.isLoading.programs = false
        state.error = action.payload as string
      })

      // Fetch Program
      .addCase(fetchProgram.pending, (state) => {
        state.isLoading.currentProgram = true
        state.error = null
      })
      .addCase(fetchProgram.fulfilled, (state, action) => {
        state.isLoading.currentProgram = false
        state.currentProgram = action.payload
      })
      .addCase(fetchProgram.rejected, (state, action) => {
        state.isLoading.currentProgram = false
        state.error = action.payload as string
      })

      // Create Program
      .addCase(createProgram.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.programs.push(action.payload)
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update Program
      .addCase(updateProgram.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.programs.findIndex((program) => program.id === action.payload.id)
        if (index !== -1) {
          state.programs[index] = action.payload
        }
        if (state.currentProgram?.id === action.payload.id) {
          state.currentProgram = action.payload
        }
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete Program
      .addCase(deleteProgram.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.programs = state.programs.filter((program) => program.id !== action.payload)
        if (state.currentProgram?.id === action.payload) {
          state.currentProgram = null
        }
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentProgram, clearError } = programSlice.actions
export default programSlice.reducer
