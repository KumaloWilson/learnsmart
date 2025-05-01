import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { virtualClassesApi } from "@/lib/api/virtual-classes-api"

export interface VirtualClass {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  meetingLink: string
  isActive: boolean
  courseId: string
  courseName?: string
  lecturerId: string
  lecturerName?: string
  createdAt?: string
  updatedAt?: string
}

interface VirtualClassesState {
  virtualClasses: VirtualClass[]
  currentVirtualClass: VirtualClass | null
  isLoading: boolean
  error: string | null
}

const initialState: VirtualClassesState = {
  virtualClasses: [],
  currentVirtualClass: null,
  isLoading: false,
  error: null,
}

export const fetchVirtualClasses = createAsyncThunk(
  "virtualClasses/fetchVirtualClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.getVirtualClasses()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch virtual classes")
    }
  },
)

export const fetchVirtualClassesByCourse = createAsyncThunk(
  "virtualClasses/fetchVirtualClassesByCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.getVirtualClassesByCourse(courseId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch virtual classes for this course")
    }
  },
)

export const fetchVirtualClassById = createAsyncThunk(
  "virtualClasses/fetchVirtualClassById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.getVirtualClassById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch virtual class")
    }
  },
)

export const createVirtualClass = createAsyncThunk(
  "virtualClasses/createVirtualClass",
  async (virtualClassData: Omit<VirtualClass, "id">, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.createVirtualClass(virtualClassData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create virtual class")
    }
  },
)

export const updateVirtualClass = createAsyncThunk(
  "virtualClasses/updateVirtualClass",
  async ({ id, virtualClassData }: { id: string; virtualClassData: Partial<VirtualClass> }, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.updateVirtualClass(id, virtualClassData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update virtual class")
    }
  },
)

export const deleteVirtualClass = createAsyncThunk(
  "virtualClasses/deleteVirtualClass",
  async (id: string, { rejectWithValue }) => {
    try {
      await virtualClassesApi.deleteVirtualClass(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete virtual class")
    }
  },
)

export const startVirtualClass = createAsyncThunk(
  "virtualClasses/startVirtualClass",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.startVirtualClass(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to start virtual class")
    }
  },
)

export const endVirtualClass = createAsyncThunk(
  "virtualClasses/endVirtualClass",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await virtualClassesApi.endVirtualClass(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to end virtual class")
    }
  },
)

const virtualClassesSlice = createSlice({
  name: "virtualClasses",
  initialState,
  reducers: {
    clearCurrentVirtualClass: (state) => {
      state.currentVirtualClass = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Virtual Classes
      .addCase(fetchVirtualClasses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchVirtualClasses.fulfilled, (state, action: PayloadAction<VirtualClass[]>) => {
        state.isLoading = false
        state.virtualClasses = action.payload
      })
      .addCase(fetchVirtualClasses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Virtual Classes By Course
      .addCase(fetchVirtualClassesByCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchVirtualClassesByCourse.fulfilled, (state, action: PayloadAction<VirtualClass[]>) => {
        state.isLoading = false
        state.virtualClasses = action.payload
      })
      .addCase(fetchVirtualClassesByCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Virtual Class By Id
      .addCase(fetchVirtualClassById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchVirtualClassById.fulfilled, (state, action: PayloadAction<VirtualClass>) => {
        state.isLoading = false
        state.currentVirtualClass = action.payload
      })
      .addCase(fetchVirtualClassById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Virtual Class
      .addCase(createVirtualClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createVirtualClass.fulfilled, (state, action: PayloadAction<VirtualClass>) => {
        state.isLoading = false
        state.virtualClasses.push(action.payload)
        state.currentVirtualClass = action.payload
      })
      .addCase(createVirtualClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Virtual Class
      .addCase(updateVirtualClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateVirtualClass.fulfilled, (state, action: PayloadAction<VirtualClass>) => {
        state.isLoading = false
        const index = state.virtualClasses.findIndex((virtualClass) => virtualClass.id === action.payload.id)
        if (index !== -1) {
          state.virtualClasses[index] = action.payload
        }
        state.currentVirtualClass = action.payload
      })
      .addCase(updateVirtualClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Virtual Class
      .addCase(deleteVirtualClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteVirtualClass.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.virtualClasses = state.virtualClasses.filter((virtualClass) => virtualClass.id !== action.payload)
        if (state.currentVirtualClass?.id === action.payload) {
          state.currentVirtualClass = null
        }
      })
      .addCase(deleteVirtualClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Start Virtual Class
      .addCase(startVirtualClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(startVirtualClass.fulfilled, (state, action: PayloadAction<VirtualClass>) => {
        state.isLoading = false
        const index = state.virtualClasses.findIndex((virtualClass) => virtualClass.id === action.payload.id)
        if (index !== -1) {
          state.virtualClasses[index] = action.payload
        }
        if (state.currentVirtualClass?.id === action.payload.id) {
          state.currentVirtualClass = action.payload
        }
      })
      .addCase(startVirtualClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // End Virtual Class
      .addCase(endVirtualClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(endVirtualClass.fulfilled, (state, action: PayloadAction<VirtualClass>) => {
        state.isLoading = false
        const index = state.virtualClasses.findIndex((virtualClass) => virtualClass.id === action.payload.id)
        if (index !== -1) {
          state.virtualClasses[index] = action.payload
        }
        if (state.currentVirtualClass?.id === action.payload.id) {
          state.currentVirtualClass = action.payload
        }
      })
      .addCase(endVirtualClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentVirtualClass, clearError } = virtualClassesSlice.actions

export default virtualClassesSlice.reducer
