import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { VirtualClass, JoinVirtualClassResponse } from "@/features/virtual-classes/types"
import { virtualClassesService } from "../services/virtual-classes-service"

interface VirtualClassesState {
  virtualClasses: VirtualClass[]
  isLoading: boolean
  isJoining: boolean
  error: string | null
  joinError: string | null
}

const initialState: VirtualClassesState = {
  virtualClasses: [],
  isLoading: false,
  isJoining: false,
  error: null,
  joinError: null,
}

export const fetchVirtualClasses = createAsyncThunk<VirtualClass[], { studentProfileId: string; token: string }>(
  "virtualClasses/fetchAll",
  async ({ studentProfileId, token }, { rejectWithValue }) => {
    try {
      const data = await virtualClassesService.getVirtualClasses(studentProfileId, token)
      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const joinVirtualClass = createAsyncThunk<
  JoinVirtualClassResponse,
  { studentProfileId: string; virtualClassId: string; token: string }
>("virtualClasses/join", async ({ studentProfileId, virtualClassId, token }, { rejectWithValue }) => {
  try {
    const data = await virtualClassesService.joinVirtualClass(studentProfileId, virtualClassId, token)
    return data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

const virtualClassesSlice = createSlice({
  name: "virtualClasses",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null
      state.joinError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVirtualClasses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchVirtualClasses.fulfilled, (state, action) => {
        state.isLoading = false
        state.virtualClasses = action.payload
      })
      .addCase(fetchVirtualClasses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(joinVirtualClass.pending, (state) => {
        state.isJoining = true
        state.joinError = null
      })
      .addCase(joinVirtualClass.fulfilled, (state) => {
        state.isJoining = false
      })
      .addCase(joinVirtualClass.rejected, (state, action) => {
        state.isJoining = false
        state.joinError = action.payload as string
      })
  },
})

export const { clearErrors } = virtualClassesSlice.actions
export default virtualClassesSlice.reducer
