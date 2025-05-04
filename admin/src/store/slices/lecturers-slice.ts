import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as lecturersApi from "../../lib/api/lecturers-api"
import { LecturerProfile, CourseAssignment, Assessment, TeachingMaterial } from "@/types/lecturer"

interface LecturersState {
  lecturers: LecturerProfile[]
  currentLecturer: LecturerProfile | null
  courseAssignments: CourseAssignment[]
  assessments: Assessment[]
  teachingMaterials: TeachingMaterial[]
  loading: boolean
  error: string | null
}

const initialState: LecturersState = {
  lecturers: [],
  currentLecturer: null,
  courseAssignments: [],
  assessments: [],
  teachingMaterials: [],
  loading: false,
  error: null,
}

// Lecturer profile thunks
export const fetchLecturers = createAsyncThunk("lecturers/fetchLecturers", async () => {
  return await lecturersApi.getAllLecturers()
})

export const fetchLecturerById = createAsyncThunk("lecturers/fetchLecturerById", async (id: string) => {
  return await lecturersApi.getLecturerById(id)
})

export const createLecturer = createAsyncThunk("lecturers/createLecturer", async (lecturerData: any) => {
  return await lecturersApi.createLecturer(lecturerData)
})

export const updateLecturer = createAsyncThunk(
  "lecturers/updateLecturer",
  async ({ id, lecturerData }: { id: string; lecturerData: any }) => {
    return await lecturersApi.updateLecturer(id, lecturerData)
  },
)

export const deleteLecturer = createAsyncThunk("lecturers/deleteLecturer", async (id: string) => {
  await lecturersApi.deleteLecturer(id)
  return id
})

// Course assignment thunks
export const fetchLecturerCourseAssignments = createAsyncThunk(
  "lecturers/fetchLecturerCourseAssignments",
  async (lecturerId: string) => {
    return await lecturersApi.getLecturerCourseAssignments(lecturerId)
  },
)

export const assignCourseToLecturer = createAsyncThunk(
  "lecturers/assignCourseToLecturer",
  async (assignmentData: any) => {
    return await lecturersApi.assignCourseToLecturer(assignmentData)
  },
)

export const updateCourseAssignment = createAsyncThunk(
  "lecturers/updateCourseAssignment",
  async ({ id, assignmentData }: { id: string; assignmentData: any }) => {
    return await lecturersApi.updateCourseAssignment(id, assignmentData)
  },
)

export const removeCourseAssignment = createAsyncThunk("lecturers/removeCourseAssignment", async (id: string) => {
  await lecturersApi.removeCourseAssignment(id)
  return id
})

// Assessment thunks
export const fetchLecturerAssessments = createAsyncThunk(
  "lecturers/fetchLecturerAssessments",
  async (lecturerId: string) => {
    return await lecturersApi.getLecturerAssessments(lecturerId)
  },
)

// Teaching material thunks
export const fetchTeachingMaterials = createAsyncThunk(
  "lecturers/fetchTeachingMaterials",
  async (lecturerId: string) => {
    return await lecturersApi.getTeachingMaterials(lecturerId)
  },
)

const lecturersSlice = createSlice({
  name: "lecturers",
  initialState,
  reducers: {
    clearCurrentLecturer: (state) => {
      state.currentLecturer = null
    },
    clearLecturerError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lecturers
      .addCase(fetchLecturers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLecturers.fulfilled, (state, action) => {
        state.loading = false
        state.lecturers = action.payload
      })
      .addCase(fetchLecturers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch lecturers"
      })

      // Fetch lecturer by ID
      .addCase(fetchLecturerById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLecturerById.fulfilled, (state, action) => {
        state.loading = false
        state.currentLecturer = action.payload
      })
      .addCase(fetchLecturerById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch lecturer"
      })

      // Create lecturer
      .addCase(createLecturer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLecturer.fulfilled, (state, action) => {
        state.loading = false
        state.lecturers.push(action.payload)
      })
      .addCase(createLecturer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create lecturer"
      })

      // Update lecturer
      .addCase(updateLecturer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateLecturer.fulfilled, (state, action) => {
        state.loading = false
        state.currentLecturer = action.payload
        const index = state.lecturers.findIndex((lecturer) => lecturer.id === action.payload.id)
        if (index !== -1) {
          state.lecturers[index] = action.payload
        }
      })
      .addCase(updateLecturer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update lecturer"
      })

      // Delete lecturer
      .addCase(deleteLecturer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLecturer.fulfilled, (state, action) => {
        state.loading = false
        state.lecturers = state.lecturers.filter((lecturer) => lecturer.id !== action.payload)
        if (state.currentLecturer && state.currentLecturer.id === action.payload) {
          state.currentLecturer = null
        }
      })
      .addCase(deleteLecturer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete lecturer"
      })

      // Fetch lecturer course assignments
      .addCase(fetchLecturerCourseAssignments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLecturerCourseAssignments.fulfilled, (state, action) => {
        state.loading = false
        state.courseAssignments = action.payload
      })
      .addCase(fetchLecturerCourseAssignments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch course assignments"
      })

      // Assign course to lecturer
      .addCase(assignCourseToLecturer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(assignCourseToLecturer.fulfilled, (state, action) => {
        state.loading = false
        state.courseAssignments.push(action.payload)
      })
      .addCase(assignCourseToLecturer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to assign course"
      })

      // Update course assignment
      .addCase(updateCourseAssignment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCourseAssignment.fulfilled, (state, action) => {
        state.loading = false
        const index = state.courseAssignments.findIndex((assignment) => assignment.id === action.payload.id)
        if (index !== -1) {
          state.courseAssignments[index] = action.payload
        }
      })
      .addCase(updateCourseAssignment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update course assignment"
      })

      // Remove course assignment
      .addCase(removeCourseAssignment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeCourseAssignment.fulfilled, (state, action) => {
        state.loading = false
        state.courseAssignments = state.courseAssignments.filter((assignment) => assignment.id !== action.payload)
      })
      .addCase(removeCourseAssignment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to remove course assignment"
      })

      // Fetch lecturer assessments
      .addCase(fetchLecturerAssessments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLecturerAssessments.fulfilled, (state, action) => {
        state.loading = false
        state.assessments = action.payload
      })
      .addCase(fetchLecturerAssessments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch assessments"
      })

      // Fetch teaching materials
      .addCase(fetchTeachingMaterials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeachingMaterials.fulfilled, (state, action) => {
        state.loading = false
        state.teachingMaterials = action.payload
      })
      .addCase(fetchTeachingMaterials.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch teaching materials"
      })
  },
})

export const { clearCurrentLecturer, clearLecturerError } = lecturersSlice.actions

export default lecturersSlice.reducer
