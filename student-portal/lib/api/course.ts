import { api } from "@/lib/redux/api"

export interface CourseDetails {
  course: Course
  materials: Material[]
  assessments: Assessment[]
  submissions: Submission[]
  quizzes: Quiz[]
  virtualClasses: VirtualClass[]
  attendance: AttendanceRecord[]
}

export interface Course {
  id: string
  name: string
  description: string
  code: string
  level: number
  creditHours: number
  programId: string
  createdAt: string
  updatedAt: string
  program: {
    id: string
    name: string
    description: string
    code: string
    durationYears: number
    level: string
    departmentId: string
    createdAt: string
    updatedAt: string
  }
}

export interface Material {
  id: string
  title: string
  description: string
  type: string
  url: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
}

export interface Assessment {
  id: string
  title: string
  description: string
  dueDate: string
  type: string
  totalPoints: number
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  assessmentId: string
  studentProfileId: string
  submissionDate: string
  status: string
  grade: number | null
  feedback: string | null
  submissionUrl: string
  createdAt: string
  updatedAt: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  numberOfQuestions: number
  timeLimit: number
  startDate: string
  endDate: string
  totalMarks: number
  passingMarks: number
  isActive: boolean
  isRandomized: boolean
  aiPrompt: {
    focus: string
    difficulty: string
  }
  questionType: string
  instructions: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  lecturerProfile: {
    id: string
    staffId: string
    title: string
    specialization: string
    bio: string
    officeLocation: string
    officeHours: string
    phoneNumber: string
    status: string
    joinDate: string
    endDate: string | null
    userId: string
    departmentId: string
    createdAt: string
    updatedAt: string
    user: {
      firstName: string
      lastName: string
    }
  }
}

export interface VirtualClass {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  meetingId: string
  meetingLink: string
  meetingConfig: {
    passcode: string
    platform: string
  }
  status: string
  actualStartTime: string | null
  actualEndTime: string | null
  duration: number | null
  isRecorded: boolean
  recordingUrl: string | null
  lecturerProfileId: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  lecturerProfile: {
    id: string
    staffId: string
    title: string
    specialization: string
    bio: string
    officeLocation: string
    officeHours: string
    phoneNumber: string
    status: string
    joinDate: string
    endDate: string | null
    userId: string
    departmentId: string
    createdAt: string
    updatedAt: string
    user: {
      firstName: string
      lastName: string
    }
  }
  attended?: boolean
  joinTime?: string
  leaveTime?: string | null
}

export interface AttendanceRecord {
  id: string
  date: string
  topic: string
  notes: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
  studentProfileId: string
  isPresent: boolean
  createdAt: string
  updatedAt: string
}

export interface CourseTopic {
  id: string
  title: string
  description: string
  orderIndex: number
  durationHours: number
  learningObjectives: string[]
  keywords: string[]
  difficulty: string
  isActive: boolean
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
}

export interface JoinVirtualClassRequest {
  virtualClassId: string
  studentProfileId: string
}

export interface JoinVirtualClassResponse {
  success: boolean
  message: string
  attendance: {
    id: string
    virtualClassId: string
    studentProfileId: string
    joinTime: string
    leaveTime: string | null
    createdAt: string
    updatedAt: string
  }
}

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseDetails: builder.query<CourseDetails, { studentId: string; courseId: string; semesterId: string }>({
      query: ({ studentId, courseId, semesterId }) =>
        `/student-portal/${studentId}/course/${courseId}/semester/${semesterId}`,
      providesTags: (result, error, { courseId }) => [{ type: "Course", id: courseId }],
    }),

    getCourseTopics: builder.query<CourseTopic[], { studentId: string; courseId: string; semesterId: string }>({
      query: ({ studentId, courseId, semesterId }) =>
        `/student-portal/${studentId}/course-topics/course/${courseId}/semester/${semesterId}`,
      providesTags: (result, error, { courseId }) => [{ type: "CourseTopics", id: courseId }],
    }),

    getVirtualClasses: builder.query<VirtualClass[], { studentId: string; courseId?: string }>({
      query: ({ studentId, courseId }) => {
        let url = `/student-portal/${studentId}/virtual-classes/`
        if (courseId) {
          url += `?courseId=${courseId}`
        }
        return url
      },
      providesTags: ["VirtualClasses"],
    }),

    joinVirtualClass: builder.mutation<JoinVirtualClassResponse, JoinVirtualClassRequest>({
      query: (body) => ({
        url: `/student-portal/${body.studentProfileId}/virtual-class/join`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["VirtualClasses"],
    }),
  }),
})

export const {
  useGetCourseDetailsQuery,
  useGetCourseTopicsQuery,
  useGetVirtualClassesQuery,
  useJoinVirtualClassMutation,
} = courseApi
