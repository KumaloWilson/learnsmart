export interface LearningResourceMetadata {
  author: string
  publishedDate: string
  [key: string]: any
}

export interface LearningResource {
  id: string
  title: string
  description: string
  type: "video" | "article" | "quiz" | "ebook" | "interactive"
  url: string
  content: string | null
  metadata: LearningResourceMetadata
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
    user: {
      firstName: string
      lastName: string
      email: string
    }
    [key: string]: any
  }
}

export interface GenerateRecommendationsRequest {
  studentProfileId: string
  courseId?: string
  count?: number
  includeCompleted?: boolean
}

export interface RecommendationsState {
  recommendations: Recommendation[]
  isLoading: boolean
  error: string | null
  generatingRecommendations: boolean
  generationError: string | null
  filters: {
    resourceType: string | null
    difficulty: number | null
    courseId: string | null
    searchQuery: string
  }
}
