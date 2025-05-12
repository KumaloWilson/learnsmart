import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type {
  Lecturer,
  CreateLecturerDto,
  UpdateLecturerDto,
  CourseAssignment,
  CreateCourseAssignmentDto,
  UpdateCourseAssignmentDto,
} from "@/types/lecturer"
import lecturerService from "@/lib/lecturer-service"

interface LecturerState {
  lecturers: Lecturer[]
  currentLecturer: Lecturer | null
  courseAssignments: CourseAssignment[]
  isLoading: {
    lecturers: boolean
    currentLecturer: boolean
    courseAssignments: boolean
    create: boolean
    update: boolean
    delete: boolean
    createAssignment: boolean
    updateAssignment: boolean
    deleteAssignment: boolean
  }
  error: string | null
}

const initialState: LecturerState = {
  lecturers: [],
  currentLecturer: null,
  courseAssignments: [],
  isLoading: {
    lecturers: false,
    currentLecturer: false,
    courseAssignments: false,
    create: false,
    update: false,
    delete: false,
    createAssignment: false,
    updateAssignment: false,
    deleteAssignment: false,
  },
  error: null,
}

export const fetchLecturers = createAsyncThunk("lecturers/fetchLecturers", async (_, { rejectWithValue }) => {
  try {
    return await lecturerService.getLecturers()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturers")
  }
})

export const fetchLecturer = createAsyncThunk("lecturers/fetchLecturer", async (id: string, { rejectWithValue }) => {
  try {
    return await lecturerService.getLecturer(id)
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturer")
  }
})

export const fetchLecturerByUserId = createAsyncThunk(
  "lecturers/fetchLecturerByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await lecturerService.getLecturerByUserId(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturer by user ID")
    }
  },
)

export const createLecturer = createAsyncThunk(
  "lecturers/createLecturer",
  async (data: CreateLecturerDto, { rejectWithValue }) => {
    try {
      return await lecturerService.createLecturer(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create lecturer")
    }
  },
)

export const updateLecturer = createAsyncThunk(
  "lecturers/updateLecturer",
  async ({ id, data }: { id: string; data: UpdateLecturerDto }, { rejectWithValue }) => {
    try {
      return await lecturerService.updateLecturer(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update lecturer")
    }
  },
)

export const deleteLecturer = createAsyncThunk("lecturers/deleteLecturer", async (id: string, { rejectWithValue }) => {
  try {
    await lecturerService.deleteLecturer(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete lecturer")
  }
})

export const fetchLecturerCourseAssignments = createAsyncThunk(
  "lecturers/fetchLecturerCourseAssignments",
  async (lecturerId: string, { rejectWithValue }) => {
    try {
      return await lecturerService.getLecturerCourseAssignments(lecturerId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch course assignments")
    }
  },
)

export const createCourseAssignment = createAsyncThunk(
  "lecturers/createCourseAssignment",
  async (data: CreateCourseAssignmentDto, { rejectWithValue }) => {
    try {
      return await lecturerService.createCourseAssignment(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create course assignment")
    }
  },
)

export const updateCourseAssignment = createAsyncThunk(
  "lecturers/updateCourseAssignment",
  async ({ id, data }: { id: string; data: UpdateCourseAssignmentDto }, { rejectWithValue }) => {
    try {
      return await lecturerService.updateCourseAssignment(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update course assignment")
    }
  },
)

export const deleteCourseAssignment = createAsyncThunk(
  "lecturers/deleteCourseAssignment",
  async (id: string, { rejectWithValue }) => {
    try {
      await lecturerService.deleteCourseAssignment(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete course assignment")
    }
  },
)

const lecturerSlice = createSlice({
  name: "lecturers",
  initialState,
  reducers: {
    clearCurrentLecturer: (state) => {
      state.currentLecturer = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lecturers
      .addCase(fetchLecturers.pending, (state) => {
        state.isLoading.lecturers = true
        state.error = null
      })
      .addCase(fetchLecturers.fulfilled, (state, action) => {
        state.isLoading.lecturers = false
        state.lecturers = action.payload
      })
      .addCase(fetchLecturers.rejected, (state, action) => {
        state.isLoading.lecturers = false
        state.error = action.payload as string
      })

      // Fetch Lecturer
      .addCase(fetchLecturer.pending, (state) => {
        state.isLoading.currentLecturer = true
        state.error = null
      })
      .addCase(fetchLecturer.fulfilled, (state, action) => {
        state.isLoading.currentLecturer = false
        state.currentLecturer = action.payload
      })
      .addCase(fetchLecturer.rejected, (state, action) => {
        state.isLoading.currentLecturer = false
        state.error = action.payload as string
      })

      // Fetch Lecturer By User ID
      .addCase(fetchLecturerByUserId.pending, (state) => {
        state.isLoading.currentLecturer = true
        state.error = null
      })
      .addCase(fetchLecturerByUserId.fulfilled, (state, action) => {
        state.isLoading.currentLecturer = false
        state.currentLecturer = action.payload
      })
      .addCase(fetchLecturerByUserId.rejected, (state, action) => {
        state.isLoading.currentLecturer = false
        state.error = action.payload as string
      })

      // Create Lecturer
      .addCase(createLecturer.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createLecturer.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.lecturers.push(action.payload)
      })
      .addCase(createLecturer.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update Lecturer
      .addCase(updateLecturer.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updateLecturer.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.lecturers.findIndex((lecturer) => lecturer.id === action.payload.id)
        if (index !== -1) {
          state.lecturers[index] = action.payload
        }
        if (state.currentLecturer?.id === action.payload.id) {
          state.currentLecturer = action.payload
        }
      })
      .addCase(updateLecturer.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete Lecturer
      .addCase(deleteLecturer.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deleteLecturer.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.lecturers = state.lecturers.filter((lecturer) => lecturer.id !== action.payload)
        if (state.currentLecturer?.id === action.payload) {
          state.currentLecturer = null
        }
      })
      .addCase(deleteLecturer.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })

      // Fetch Lecturer Course Assignments
      .addCase(fetchLecturerCourseAssignments.pending, (state) => {
        state.isLoading.courseAssignments = true
        state.error = null
      })
      .addCase(fetchLecturerCourseAssignments.fulfilled, (state, action) => {
        state.isLoading.courseAssignments = false
        state.courseAssignments = action.payload
      })
      .addCase(fetchLecturerCourseAssignments.rejected, (state, action) => {
        state.isLoading.courseAssignments = false
        state.error = action.payload as string
      })

      // Create Course Assignment
      .addCase(createCourseAssignment.pending, (state) => {
        state.isLoading.createAssignment = true
        state.error = null
      })
      .addCase(createCourseAssignment.fulfilled, (state, action) => {
        state.isLoading.createAssignment = false
        state.courseAssignments.push(action.payload)
      })
      .addCase(createCourseAssignment.rejected, (state, action) => {
        state.isLoading.createAssignment = false
        state.error = action.payload as string
      })

      // Update Course Assignment
      .addCase(updateCourseAssignment.pending, (state) => {
        state.isLoading.updateAssignment = true
        state.error = null
      })
      .addCase(updateCourseAssignment.fulfilled, (state, action) => {
        state.isLoading.updateAssignment = false
        const index = state.courseAssignments.findIndex((assignment) => assignment.id === action.payload.id)
        if (index !== -1) {
          state.courseAssignments[index] = action.payload
        }
      })
      .addCase(updateCourseAssignment.rejected, (state, action) => {
        state.isLoading.updateAssignment = false
        state.error = action.payload as string
      })

      // Delete Course Assignment
      .addCase(deleteCourseAssignment.pending, (state) => {
        state.isLoading.deleteAssignment = true
        state.error = null
      })
      .addCase(deleteCourseAssignment.fulfilled, (state, action) => {
        state.isLoading.deleteAssignment = false
        state.courseAssignments = state.courseAssignments.filter((assignment) => assignment.id !== action.payload)
      })
      .addCase(deleteCourseAssignment.rejected, (state, action) => {
        state.isLoading.deleteAssignment = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentLecturer, clearError } = lecturerSlice.actions
export default lecturerSlice.reducer
