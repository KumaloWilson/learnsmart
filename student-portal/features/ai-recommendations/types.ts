export interface LearningResource {
  id: string
  title: string
  description: string
  type: string
  url: string
  content: string | null
  metadata: {
    author: string
    publishedDate: string
    [key: string]: any
  }
  tags: string[]
  difficulty: number
  durationMinutes: number
  courseId: string
  semesterId: string | null
  createdAt: string
  updatedAt: string
}

export interface Recommendation {
  id: string
  studentProfileId: string
  learningResourceId: string
  courseId: string
  reason: string
  relevanceScore: number
  isViewed: boolean
  viewedAt: string | null
  isSaved: boolean
  isCompleted: boolean
  completedAt: string | null
  rating: number | null
  feedback: string | null
  createdAt: string
  updatedAt: string
  learningResource: LearningResource
  course: {
    id: string
    name: string
    description: string
    code: string
    level: number
    creditHours: number
    programId: string
    createdAt: string
    updatedAt: string
  }
  studentProfile?: {
    id: string
    studentId: string
    dateOfBirth: string
    gender: string
    address: string
    phoneNumber: string
    status: string
    currentLevel: number
    enrollmentDate: string
    graduationDate: string | null
    userId: string
    programId: string
    createdAt: string
    updatedAt: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface GenerateRecommendationsRequest {
  studentProfileId: string
  courseId: string
  count: number
  includeCompleted: boolean
}
