import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Student {
  id: string
  name: string
  email: string
  course: string
  performance: string
}

interface StudentsState {
  students: Student[]
  loading: boolean
  error: string | null
}

const initialState: StudentsState = {
  students: [
    {
      id: "S1001",
      name: "Alice Johnson",
      email: "alice.j@smartlearn.edu",
      course: "CS101, CS301",
      performance: "Excellent",
    },
    {
      id: "S1002",
      name: "Bob Smith",
      email: "bob.s@smartlearn.edu",
      course: "CS201, CS401",
      performance: "Good",
    },
    {
      id: "S1003",
      name: "Charlie Brown",
      email: "charlie.b@smartlearn.edu",
      course: "CS101, CS201",
      performance: "Average",
    },
    {
      id: "S1004",
      name: "Diana Prince",
      email: "diana.p@smartlearn.edu",
      course: "CS301, CS401",
      performance: "Excellent",
    },
  ],
  loading: false,
  error: null,
}

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    fetchStudentsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchStudentsSuccess: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload
      state.loading = false
    },
    fetchStudentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload)
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex((student) => student.id === action.payload.id)
      if (index !== -1) {
        state.students[index] = action.payload
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((student) => student.id !== action.payload)
    },
  },
})

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  addStudent,
  updateStudent,
  deleteStudent,
} = studentsSlice.actions

export const studentsReducer = studentsSlice.reducer
