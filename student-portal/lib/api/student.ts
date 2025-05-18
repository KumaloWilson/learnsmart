import { api } from "@/lib/redux/api"

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollments: builder.query({
      query: () => "/student/enrollments",
      providesTags: ["Student"],
    }),
    getAcademicRecords: builder.query({
      query: () => "/student/academic-records",
      providesTags: ["Student"],
    }),
    getRecommendations: builder.query({
      query: () => "/student/recommendations",
      providesTags: ["Student"],
    }),
    updateRecommendation: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/student/recommendations/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Student"],
    }),
  }),
})

export const {
  useGetEnrollmentsQuery,
  useGetAcademicRecordsQuery,
  useGetRecommendationsQuery,
  useUpdateRecommendationMutation,
} = studentApi
