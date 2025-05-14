export interface MasteryDistribution {
  range: string
  count: number
  percentage: number
}

export interface EngagementDistribution {
  veryHigh: number
  high: number
  moderate: number
  low: number
  veryLow: number
}

export interface StudentEngagement {
  studentProfileId: string
  studentName: string
  studentEmail: string
  overallAttendanceRate: number
  quizCompletionRate: number
  assessmentSubmissionRate: number
  overallEngagement: number
  engagementLevel: string
}
