import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Calendar, AlertTriangle, ExternalLink, Award } from "lucide-react"
import type { Quiz, QuizAttempt } from "@/features/courses/types"

interface CourseQuizzesProps {
  quizzes: Quiz[]
  quizAttempts: QuizAttempt[]
}

export function CourseQuizzes({ quizzes, quizAttempts }: CourseQuizzesProps) {
  if (!quizzes.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quizzes</CardTitle>
          <CardDescription>No quizzes available for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Sort quizzes by start date (newest first)
  const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  // Get attempted quiz IDs
  const attemptedQuizIds = quizAttempts.map((attempt) => attempt.quizId)

  // Filter upcoming and past quizzes
  const now = new Date()
  const upcomingQuizzes = sortedQuizzes.filter((quiz) => new Date(quiz.endDate) > now)
  const pastQuizzes = sortedQuizzes.filter((quiz) => new Date(quiz.endDate) <= now)

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Upcoming ({upcomingQuizzes.length})</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Past ({pastQuizzes.length})</span>
        </TabsTrigger>
        <TabsTrigger value="attempts" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>My Attempts ({quizAttempts.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingQuizzes.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Quizzes</CardTitle>
              <CardDescription>No upcoming quizzes at this time.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingQuizzes.map((quiz) => {
              const startDate = new Date(quiz.startDate)
              const endDate = new Date(quiz.endDate)
              const isAttempted = attemptedQuizIds.includes(quiz.id)
              const isAvailable = now >= startDate && now <= endDate

              return (
                <Card key={quiz.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </div>
                      <Badge variant={isAvailable ? "default" : "outline"}>
                        {isAvailable ? "Available" : "Upcoming"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>Start: {startDate.toLocaleDateString()}</div>
                          <div>End: {endDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>Time Limit: {quiz.timeLimit} minutes</div>
                          <div>Questions: {quiz.numberOfQuestions}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>Total Marks: {quiz.totalMarks}</div>
                          <div>Passing: {quiz.passingMarks}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {isAttempted ? "You have already attempted this quiz" : "You haven't attempted this quiz yet"}
                      </div>
                      <Button disabled={!isAvailable || isAttempted}>
                        {isAttempted ? "Attempted" : isAvailable ? "Start Quiz" : "Not Available Yet"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {pastQuizzes.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Past Quizzes</CardTitle>
              <CardDescription>No past quizzes available.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastQuizzes.map((quiz) => {
              const isAttempted = attemptedQuizIds.includes(quiz.id)

              return (
                <Card key={quiz.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </div>
                      <Badge variant={isAttempted ? "default" : "destructive"}>
                        {isAttempted ? "Attempted" : "Missed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>Start: {new Date(quiz.startDate).toLocaleDateString()}</div>
                          <div>End: {new Date(quiz.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>Time Limit: {quiz.timeLimit} minutes</div>
                          <div>Questions: {quiz.numberOfQuestions}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>Total Marks: {quiz.totalMarks}</div>
                          <div>Passing: {quiz.passingMarks}</div>
                        </div>
                      </div>
                    </div>

                    {!isAttempted && (
                      <div className="flex items-center text-sm text-destructive">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>You missed this quiz</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="attempts" className="space-y-4">
        {quizAttempts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>My Attempts</CardTitle>
              <CardDescription>You haven't attempted any quizzes yet.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {quizAttempts.map((attempt) => (
              <Card key={attempt.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{attempt.quiz.title}</CardTitle>
                      <CardDescription>{attempt.quiz.description}</CardDescription>
                    </div>
                    <Badge variant={attempt.isPassed ? "default" : "destructive"}>
  {attempt.isPassed ? "Passed" : "Failed"}
</Badge>

                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Score: {attempt.score}%</span>
                      <span className="text-sm text-muted-foreground">
                        {attempt.aiAnalysis.correctAnswers}/{attempt.aiAnalysis.totalQuestions} correct
                      </span>
                    </div>
                    <Progress value={attempt.score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {attempt.aiAnalysis.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Areas for Improvement</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {attempt.aiAnalysis.weaknesses.length > 0 ? (
                          attempt.aiAnalysis.weaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)
                        ) : (
                          <li>No specific weaknesses identified</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {attempt.aiAnalysis.recommendations.map((recommendation, i) => (
                        <li key={i}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Attempted on {new Date(attempt.startTime).toLocaleDateString()}
                    </div>
                    <Button variant="outline" className="flex items-center gap-1">
                      <span>View Detailed Results</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
