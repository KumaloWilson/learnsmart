import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { virtualClassService } from "@/lib/services/virtual-class.service"
import type { VirtualClassState, JoinVirtualClassRequest } from "@/lib/types/virtual-class.types"
import type { RootState } from "@/lib/redux/store"

const initialState: VirtualClassState = {
  virtualClasses: [],
  isLoading: false,
  error: null,
  joiningClass: false,
  joinError: null,
}

export const fetchVirtualClasses = createAsyncThunk(
  "virtualClass/fetchVirtualClasses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const virtualClasses = await virtualClassService.getVirtualClasses(studentProfile.id, accessToken)
      return virtualClasses
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch virtual classes")
    }
  },
)

export const joinVirtualClass = createAsyncThunk(
  "virtualClass/joinVirtualClass",
  async (virtualClassId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const request: JoinVirtualClassRequest = {
        virtualClassId,
        studentProfileId: studentProfile.id,
      }

      const response = await virtualClassService.joinVirtualClass(studentProfile.id, request, accessToken)

      // Find the virtual class to get the meeting link
      const virtualClass = state.virtualClass.virtualClasses.find((vc) => vc.id === virtualClassId)

      if (!virtualClass) {
        return rejectWithValue("Virtual class not found")
      }

      return {
        response,
        meetingLink: virtualClass.meetingLink,
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to join virtual class")
    }
  },
)

const virtualClassSlice = createSlice({
  name: "virtualClass",
  initialState,
  reducers: {
    clearVirtualClassError: (state) => {
      state.error = null
      state.joinError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch virtual classes
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

      // Join virtual class
      .addCase(joinVirtualClass.pending, (state) => {
        state.joiningClass = true
        state.joinError = null
      })
      .addCase(joinVirtualClass.fulfilled, (state) => {
        state.joiningClass = false
      })
      .addCase(joinVirtualClass.rejected, (state, action) => {
        state.joiningClass = false
        state.joinError = action.payload as string
      })
  },
})

export const { clearVirtualClassError } = virtualClassSlice.actions
export default virtualClassSlice.reducer
