import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  getStudents,
  getStudentById,
  getStudentByUserId,
  getStudentByStudentId,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentEnrollments,
  getStudentEnrollmentsBySemester,
  enrollStudent,
  updateEnrollment,
  deleteEnrollment,
  getAcademicRecordById,
  getStudentAcademicRecords,
  createAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
} from "@/lib/student-service"
import type {
  Student,
  StudentFormData,
  Enrollment,
  EnrollmentFormData,
  AcademicRecord,
  AcademicRecordFormData,
} from "@/types/student"

interface StudentState {
  students: Student[]
  currentStudent: Student | null
  enrollments: Enrollment[]
  academicRecords: AcademicRecord[]
  currentAcademicRecord: AcademicRecord | null
  loading: boolean
  error: string | null
}

const initialState: StudentState = {
  students: [],
  currentStudent: null,
  enrollments: [],
  academicRecords: [],
  currentAcademicRecord: null,
  loading: false,
  error: null,
}

// Student Thunks
export const fetchStudents = createAsyncThunk("students/fetchStudents", async (_, { rejectWithValue }) => {
  try {
    return await getStudents()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch students")
  }
})

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getStudentById(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student")
    }
  },
)

export const fetchStudentByUserId = createAsyncThunk(
  "students/fetchStudentByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await getStudentByUserId(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student")
    }
  },
)

export const fetchStudentByStudentId = createAsyncThunk(
  "students/fetchStudentByStudentId",
  async (studentId: string, { rejectWithValue }) => {
    try {
      return await getStudentByStudentId(studentId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student")
    }
  },
)

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (data: StudentFormData, { rejectWithValue }) => {
    try {
      return await createStudent(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create student")
    }
  },
)

export const editStudent = createAsyncThunk(
  "students/editStudent",
  async ({ id, data }: { id: string; data: Partial<StudentFormData> }, { rejectWithValue }) => {
    try {
      return await updateStudent(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update student")
    }
  },
)

export const removeStudent = createAsyncThunk("students/removeStudent", async (id: string, { rejectWithValue }) => {
  try {
    await deleteStudent(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete student")
  }
})

// Enrollment Thunks
export const fetchStudentEnrollments = createAsyncThunk(
  "students/fetchStudentEnrollments",
  async (studentId: string, { rejectWithValue }) => {
    try {
      return await getStudentEnrollments(studentId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch enrollments")
    }
  },
)

export const fetchStudentEnrollmentsBySemester = createAsyncThunk(
  "students/fetchStudentEnrollmentsBySemester",
  async ({ studentId, semesterId }: { studentId: string; semesterId: string }, { rejectWithValue }) => {
    try {
      return await getStudentEnrollmentsBySemester(studentId, semesterId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch enrollments")
    }
  },
)

export const addEnrollment = createAsyncThunk(
  "students/addEnrollment",
  async (data: EnrollmentFormData, { rejectWithValue }) => {
    try {
      return await enrollStudent(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to enroll student")
    }
  },
)

export const editEnrollment = createAsyncThunk(
  "students/editEnrollment",
  async ({ id, data }: { id: string; data: Partial<EnrollmentFormData> }, { rejectWithValue }) => {
    try {
      return await updateEnrollment(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update enrollment")
    }
  },
)

export const removeEnrollment = createAsyncThunk(
  "students/removeEnrollment",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEnrollment(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete enrollment")
    }
  },
)

// Academic Record Thunks
export const fetchAcademicRecordById = createAsyncThunk(
  "students/fetchAcademicRecordById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getAcademicRecordById(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch academic record")
    }
  },
)

export const fetchStudentAcademicRecords = createAsyncThunk(
  "students/fetchStudentAcademicRecords",
  async (studentId: string, { rejectWithValue }) => {
    try {
      return await getStudentAcademicRecords(studentId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch academic records")
    }
  },
)

export const addAcademicRecord = createAsyncThunk(
  "students/addAcademicRecord",
  async (data: AcademicRecordFormData, { rejectWithValue }) => {
    try {
      return await createAcademicRecord(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create academic record")
    }
  },
)

export const editAcademicRecord = createAsyncThunk(
  "students/editAcademicRecord",
  async ({ id, data }: { id: string; data: Partial<AcademicRecordFormData> }, { rejectWithValue }) => {
    try {
      return await updateAcademicRecord(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update academic record")
    }
  },
)

export const removeAcademicRecord = createAsyncThunk(
  "students/removeAcademicRecord",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAcademicRecord(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete academic record")
    }
  },
)

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null
    },
    clearEnrollments: (state) => {
      state.enrollments = []
    },
    clearAcademicRecords: (state) => {
      state.academicRecords = []
      state.currentAcademicRecord = null
    },
    clearErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Student reducers
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentById.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        state.currentStudent = action.payload
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStudentByUserId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentByUserId.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        state.currentStudent = action.payload
      })
      .addCase(fetchStudentByUserId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStudentByStudentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentByStudentId.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        state.currentStudent = action.payload
      })
      .addCase(fetchStudentByStudentId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        state.students.push(action.payload)
        state.currentStudent = action.payload
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(editStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        const index = state.students.findIndex((student) => student.id === action.payload.id)
        if (index !== -1) {
          state.students[index] = action.payload
        }
        state.currentStudent = action.payload
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(removeStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeStudent.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.students = state.students.filter((student) => student.id !== action.payload)
        if (state.currentStudent && state.currentStudent.id === action.payload) {
          state.currentStudent = null
        }
      })
      .addCase(removeStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Enrollment reducers
      .addCase(fetchStudentEnrollments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentEnrollments.fulfilled, (state, action: PayloadAction<Enrollment[]>) => {
        state.loading = false
        state.enrollments = action.payload
      })
      .addCase(fetchStudentEnrollments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStudentEnrollmentsBySemester.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentEnrollmentsBySemester.fulfilled, (state, action: PayloadAction<Enrollment[]>) => {
        state.loading = false
        state.enrollments = action.payload
      })
      .addCase(fetchStudentEnrollmentsBySemester.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addEnrollment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addEnrollment.fulfilled, (state, action: PayloadAction<Enrollment>) => {
        state.loading = false
        state.enrollments.push(action.payload)
      })
      .addCase(addEnrollment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(editEnrollment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editEnrollment.fulfilled, (state, action: PayloadAction<Enrollment>) => {
        state.loading = false
        const index = state.enrollments.findIndex((enrollment) => enrollment.id === action.payload.id)
        if (index !== -1) {
          state.enrollments[index] = action.payload
        }
      })
      .addCase(editEnrollment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(removeEnrollment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeEnrollment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.enrollments = state.enrollments.filter((enrollment) => enrollment.id !== action.payload)
      })
      .addCase(removeEnrollment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Academic Record reducers
      .addCase(fetchAcademicRecordById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAcademicRecordById.fulfilled, (state, action: PayloadAction<AcademicRecord>) => {
        state.loading = false
        state.currentAcademicRecord = action.payload
      })
      .addCase(fetchAcademicRecordById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStudentAcademicRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentAcademicRecords.fulfilled, (state, action: PayloadAction<AcademicRecord[]>) => {
        state.loading = false
        state.academicRecords = action.payload
      })
      .addCase(fetchStudentAcademicRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addAcademicRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addAcademicRecord.fulfilled, (state, action: PayloadAction<AcademicRecord>) => {
        state.loading = false
        state.academicRecords.push(action.payload)
        state.currentAcademicRecord = action.payload
      })
      .addCase(addAcademicRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(editAcademicRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editAcademicRecord.fulfilled, (state, action: PayloadAction<AcademicRecord>) => {
        state.loading = false
        const index = state.academicRecords.findIndex((record) => record.id === action.payload.id)
        if (index !== -1) {
          state.academicRecords[index] = action.payload
        }
        state.currentAcademicRecord = action.payload
      })
      .addCase(editAcademicRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(removeAcademicRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeAcademicRecord.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.academicRecords = state.academicRecords.filter((record) => record.id !== action.payload)
        if (state.currentAcademicRecord && state.currentAcademicRecord.id === action.payload) {
          state.currentAcademicRecord = null
        }
      })
      .addCase(removeAcademicRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentStudent, clearEnrollments, clearAcademicRecords, clearErrors } = studentSlice.actions
export default studentSlice.reducer
