export interface QuizAttempt {
  id: string
  quizId: string
  quizTitle: string
  courseId: string
  date: string
  score: number
  totalQuestions: number
  timeSpent: number
}
