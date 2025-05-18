import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"
import { logout, setCredentials } from "./slices/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const token = (getState() as RootState).auth.accessToken

    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    // Try to get a new token
    const refreshToken = (api.getState() as RootState).auth.refreshToken

    if (!refreshToken) {
      api.dispatch(logout())
      return result
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    )

    if (refreshResult?.data) {
      // Store the new token
      const user = (api.getState() as RootState).auth.user
      // Update auth state with new token
      api.dispatch(
        setCredentials({
          ...refreshResult.data,
          user,
        }),
      )
      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Student",
    "User",
    "Course",
    "Enrollment",
    "Assessment",
    "Attendance",
    "Dashboard",
    "VirtualClass",
    "Performance",
    "Recommendations",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Student", "User", "Dashboard"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getStudentProfile: builder.query({
      query: () => "/student/profile",
      providesTags: ["Student"],
    }),
    getCourses: builder.query({
      query: () => "/courses",
      providesTags: ["Course"],
    }),
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
    getEnrollments: builder.query({
      query: () => "/student/enrollments",
      providesTags: ["Enrollment"],
    }),
    getAssessments: builder.query({
      query: () => "/student/assessments",
      providesTags: ["Assessment"],
    }),
    getAttendance: builder.query({
      query: () => "/student/attendance",
      providesTags: ["Attendance"],
    }),
    // Dashboard API
    getDashboard: builder.query({
      query: (studentId) => `/student-portal/${studentId}/dashboard`,
      providesTags: ["Dashboard"],
    }),
    // Course Topics API
    getCourseTopics: builder.query({
      query: ({ studentId, courseId, semesterId }) =>
        `/student-portal/${studentId}/course-topics/course/${courseId}/semester/${semesterId}`,
      providesTags: ["Course"],
    }),
    // Virtual Classes API
    getVirtualClasses: builder.query({
      query: ({ studentId, courseId }) => {
        let url = `/student-portal/${studentId}/virtual-classes/`
        if (courseId) {
          url += `?courseId=${courseId}`
        }
        return url
      },
      providesTags: ["VirtualClass"],
    }),
    joinVirtualClass: builder.mutation({
      query: ({ studentId, virtualClassId }) => ({
        url: `/student-portal/${studentId}/virtual-class/join`,
        method: "POST",
        body: {
          virtualClassId,
          studentProfileId: studentId,
        },
      }),
      invalidatesTags: ["VirtualClass"],
    }),
    // Performance API
    getStudentPerformance: builder.query({
      query: ({ studentId, courseId, semesterId }) =>
        `/student-portal/${studentId}/performance/course/${courseId}/semester/${semesterId}`,
      providesTags: ["Performance"],
    }),
    getAcademicRecords: builder.query({
      query: (studentId) => `/student-portal/${studentId}/academic-records`,
      providesTags: ["Performance"],
    }),
    // Recommendations API
    getRecommendations: builder.query({
      query: ({ studentId, courseId }) => {
        let url = `/student-portal/${studentId}/recommendations`
        if (courseId) {
          url += `?courseId=${courseId}`
        }
        return url
      },
      providesTags: ["Recommendations"],
    }),
    generateRecommendations: builder.mutation({
      query: ({ studentId, courseId, count = 5, includeCompleted = false }) => ({
        url: `/student-portal/${studentId}/generate-recommendations`,
        method: "POST",
        body: {
          studentProfileId: studentId,
          courseId,
          count,
          includeCompleted,
        },
      }),
      invalidatesTags: ["Recommendations"],
    }),
  }),
})

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetStudentProfileQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetEnrollmentsQuery,
  useGetAssessmentsQuery,
  useGetAttendanceQuery,
  useGetDashboardQuery,
  useGetCourseTopicsQuery,
  useGetVirtualClassesQuery,
  useJoinVirtualClassMutation,
  useGetStudentPerformanceQuery,
  useGetAcademicRecordsQuery,
  useGetRecommendationsQuery,
  useGenerateRecommendationsMutation,
} = api
