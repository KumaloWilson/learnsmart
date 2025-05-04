import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { studentsApi, type StudentProfile, type CourseEnrollment, type AcademicRecord } from "@/lib/api/students-api"
import { StudentFilterDto, CreateStudentProfileDto, UpdateStudentProfileDto, EnrollStudentInCourseDto, UpdateCourseEnrollmentDto, BatchEnrollmentDto, CreateAcademicRecordDto, UpdateAcademicRecordDto } from "@/types/student"


interface StudentsState {
  students: StudentProfile[]
  currentStudent: StudentProfile | null
  enrollments: CourseEnrollment[]
  academicRecords: AcademicRecord[]
  isLoading: boolean
  error: string | null
}

const initialState: StudentsState = {
  students: [],
  currentStudent: null,
  enrollments: [],
  academicRecords: [],
  isLoading: false,
  error: null,
}

// Student profile thunks
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (filters: StudentFilterDto | undefined, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudents(filters)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch students")
    }
  },
)

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudentById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student")
    }
  },
)

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (data: CreateStudentProfileDto, { rejectWithValue }) => {
    try {
      const response = await studentsApi.createStudent(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create student")
    }
  },
)

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, data }: { id: string; data: UpdateStudentProfileDto }, { rejectWithValue }) => {
    try {
      const response = await studentsApi.updateStudent(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update student")
    }
  },
)

export const deleteStudent = createAsyncThunk("students/deleteStudent", async (id: string, { rejectWithValue }) => {
  try {
    await studentsApi.deleteStudent(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete student")
  }
})

// Course enrollment thunks
export const fetchStudentEnrollments = createAsyncThunk(
  "students/fetchStudentEnrollments",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudentEnrollments(studentId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch enrollments")
    }
  },
)

export const fetchStudentEnrollmentsBySemester = createAsyncThunk(
  "students/fetchStudentEnrollmentsBySemester",
  async ({ studentId, semesterId }: { studentId: string; semesterId: string }, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudentEnrollmentsBySemester(studentId, semesterId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch enrollments")
    }
  },
)

export const enrollStudentInCourse = createAsyncThunk(
  "students/enrollStudentInCourse",
  async (data: EnrollStudentInCourseDto, { rejectWithValue }) => {
    try {
      const response = await studentsApi.enrollStudentInCourse(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to enroll student in course")
    }
  },
)

export const updateEnrollment = createAsyncThunk(
  "students/updateEnrollment",
  async ({ id, data }: { id: string; data: UpdateCourseEnrollmentDto }, { rejectWithValue }) => {
    try {
      const response = await studentsApi.updateEnrollment(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update enrollment")
    }
  },
)

export const withdrawFromCourse = createAsyncThunk(
  "students/withdrawFromCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      await studentsApi.withdrawFromCourse(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to withdraw from course")
    }
  },
)

export const batchEnrollStudents = createAsyncThunk(
  "students/batchEnrollStudents",
  async (data: BatchEnrollmentDto, { rejectWithValue }) => {
    try {
      const response = await studentsApi.batchEnrollStudents(data.courseId, data.semesterId, data.studentIds)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to batch enroll students")
    }
  },
)

// Academic record thunks
export const fetchStudentAcademicRecords = createAsyncThunk(
  "students/fetchStudentAcademicRecords",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudentAcademicRecords(studentId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch academic records")
    }
  },
)

export const fetchAcademicRecord = createAsyncThunk(
  "students/fetchAcademicRecord",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getAcademicRecord(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch academic record")
    }
  },
)

export const createAcademicRecord = createAsyncThunk(
  "students/createAcademicRecord",
  async (data: CreateAcademicRecordDto, { rejectWithValue }) => {
    try {
      const response = await studentsApi.createAcademicRecord(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create academic record")
    }
  },
)

export const updateAcademicRecord = createAsyncThunk(
  "students/updateAcademicRecord",
  async ({ id, data }: { id: string; data: UpdateAcademicRecordDto }, { rejectWithValue }) => {
    try {
      const response = await studentsApi.updateAcademicRecord(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update academic record")
    }
  },
)

export const deleteAcademicRecord = createAsyncThunk(
  "students/deleteAcademicRecord",
  async (id: string, { rejectWithValue }) => {
    try {
      await studentsApi.deleteAcademicRecord(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete academic record")
    }
  },
)

const studentsSlice = createSlice({
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
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<StudentProfile[]>) => {
        state.isLoading = false
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch Student By Id
      .addCase(fetchStudentById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentById.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
        state.isLoading = false
        state.currentStudent = action.payload
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create Student
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createStudent.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
        state.isLoading = false
        state.students.push(action.payload)
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStudent.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
        state.isLoading = false
        const index = state.students.findIndex((student) => student.id === action.payload.id)
        if (index !== -1) {
          state.students[index] = action.payload
        }
        state.currentStudent = action.payload
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteStudent.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.students = state.students.filter((student) => student.id !== action.payload)
        if (state.currentStudent?.id === action.payload) {
          state.currentStudent = null
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch Student Enrollments
      .addCase(fetchStudentEnrollments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentEnrollments.fulfilled, (state, action: PayloadAction<CourseEnrollment[]>) => {
        state.isLoading = false
        state.enrollments = action.payload
      })
      .addCase(fetchStudentEnrollments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch Student Enrollments By Semester
      .addCase(fetchStudentEnrollmentsBySemester.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentEnrollmentsBySemester.fulfilled, (state, action: PayloadAction<CourseEnrollment[]>) => {
        state.isLoading = false
        state.enrollments = action.payload
      })
      .addCase(fetchStudentEnrollmentsBySemester.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Enroll Student In Course
      .addCase(enrollStudentInCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(enrollStudentInCourse.fulfilled, (state, action: PayloadAction<CourseEnrollment>) => {
        state.isLoading = false
        state.enrollments.push(action.payload)
      })
      .addCase(enrollStudentInCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update Enrollment
      .addCase(updateEnrollment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateEnrollment.fulfilled, (state, action: PayloadAction<CourseEnrollment>) => {
        state.isLoading = false
        const index = state.enrollments.findIndex((enrollment) => enrollment.id === action.payload.id)
        if (index !== -1) {
          state.enrollments[index] = action.payload
        }
      })
      .addCase(updateEnrollment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Withdraw From Course
      .addCase(withdrawFromCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(withdrawFromCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        const index = state.enrollments.findIndex((enrollment) => enrollment.id === action.payload)
        if (index !== -1) {
          state.enrollments[index] = {
            ...state.enrollments[index],
            status: "withdrawn",
          }
        }
      })
      .addCase(withdrawFromCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch Student Academic Records
      .addCase(fetchStudentAcademicRecords.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentAcademicRecords.fulfilled, (state, action: PayloadAction<AcademicRecord[]>) => {
        state.isLoading = false
        state.academicRecords = action.payload
      })
      .addCase(fetchStudentAcademicRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create Academic Record
      .addCase(createAcademicRecord.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAcademicRecord.fulfilled, (state, action: PayloadAction<AcademicRecord>) => {
        state.isLoading = false
        state.academicRecords.push(action.payload)
      })
      .addCase(createAcademicRecord.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update Academic Record
      .addCase(updateAcademicRecord.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateAcademicRecord.fulfilled, (state, action: PayloadAction<AcademicRecord>) => {
        state.isLoading = false
        const index = state.academicRecords.findIndex((record) => record.id === action.payload.id)
        if (index !== -1) {
          state.academicRecords[index] = action.payload
        }
      })
      .addCase(updateAcademicRecord.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete Academic Record
      .addCase(deleteAcademicRecord.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAcademicRecord.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.academicRecords = state.academicRecords.filter((record) => record.id !== action.payload)
      })
      .addCase(deleteAcademicRecord.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentStudent, clearEnrollments, clearAcademicRecords, clearError } = studentsSlice.actions

export default studentsSlice.reducer
