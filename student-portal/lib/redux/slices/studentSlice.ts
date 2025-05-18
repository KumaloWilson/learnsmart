import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface StudentProfile {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  program?: {
    name: string
  }
  currentLevel?: string
  activeSemester?: {
    name: string
  }
  currentSemesterPerformance?: {
    gpa: number
    earnedCredits: number
    totalCredits: number
  }
  learningRecommendations: LearningRecommendation[]
  currentEnrollments: any[]
  // Add other student profile fields as needed
}

interface LearningRecommendation {
  id: string
  resourceTitle: string
  courseName: string
  resourceType: string
  resourceUrl: string
  relevanceScore: number
  isViewed: boolean
  isSaved: boolean
  isCompleted: boolean
  completedAt?: string
}

interface StudentState {
  profile: StudentProfile | null
  isLoading: boolean
  error: string | null
}

const initialState: StudentState = {
  profile: null,
  isLoading: false,
  error: null,
}

// Load student profile from localStorage if available
if (typeof window !== "undefined") {
  try {
    const storedProfile = localStorage.getItem("studentProfile")
    if (storedProfile) {
      initialState.profile = JSON.parse(storedProfile)
    }
  } catch (e) {
    console.error("Failed to parse stored student profile", e)
  }
}

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentProfile: (state, action: PayloadAction<StudentProfile>) => {
      state.profile = action.payload
      state.error = null
      state.isLoading = false

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("studentProfile", JSON.stringify(action.payload))
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearStudentProfile: (state) => {
      state.profile = null
      state.error = null
      state.isLoading = false

      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("studentProfile")
      }
    },
    updateLearningRecommendation: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<LearningRecommendation> }>,
    ) => {
      if (state.profile) {
        state.profile.learningRecommendations = state.profile.learningRecommendations.map((recommendation) => {
          if (recommendation.id === action.payload.id) {
            return { ...recommendation, ...action.payload.updates }
          }
          return recommendation
        })
        localStorage.setItem("studentProfile", JSON.stringify(state.profile))
      }
    },
  },
})

export const { setStudentProfile, setLoading, setError, clearStudentProfile, updateLearningRecommendation } =
  studentSlice.actions

export default studentSlice.reducer
