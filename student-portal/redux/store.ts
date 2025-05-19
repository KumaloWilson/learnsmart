import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/auth/redux/authSlice"
import dashboardReducer from "@/features/dashboard/redux/dashboardSlice"
import userReducer from "@/features/user/redux/userSlice"
import coursesReducer from "@/features/courses/redux/coursesSlice"
import assessmentsReducer from "@/features/assessments/redux/assessmentsSlice"
import virtualClassesReducer from "@/features/virtual-classes/redux/virtualClassesSlice"
import performanceReducer from "@/features/performance/redux/performanceSlice"
import courseMaterialsReducer from "@/features/course-materials/redux/courseMaterialsSlice"
import quizHistoryReducer from "@/features/quiz-history/redux/quizHistorySlice"
import attendanceReducer from "@/features/attendance/redux/attendanceSlice"
import academicRecordsReducer from "@/features/academic-records/redux/academicRecordsSlice"
import aiRecommendationsReducer from "@/features/ai-recommendations/redux/aiRecommendationsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    courses: coursesReducer,
    assessments: assessmentsReducer,
    virtualClasses: virtualClassesReducer,
    performance: performanceReducer,
    courseMaterials: courseMaterialsReducer,
    quizHistory: quizHistoryReducer,
    attendance: attendanceReducer,
    academicRecords: academicRecordsReducer,
    aiRecommendations: aiRecommendationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
