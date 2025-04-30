"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Search, Edit2, Eye, Trash2, BarChart2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { lecturerService } from "@/lib/api-services"

interface Quiz {
  id: string
  title: string
  topic: string
  courseId: string
  courseName: string
  courseCode: string
  questionType: string
  numberOfQuestions: number
  timeLimit: number
  totalMarks: number
  passingMarks: number
  startDate: string
  endDate: string
  isActive: boolean
  attempts: number
  averageScore: number
  passRate: number
}

export function QuizzesTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const quizData = await lecturerService.getQuizzes(lecturerProfile.id)
        setQuizzes(quizData)
      } catch (error) {
        console.error("Failed to fetch quizzes:", error)
        toast({
          title: "Error",
          description: "Failed to load quizzes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [user, toast])

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return

    try {
      await lecturerService.deleteQuiz(quizToDelete)
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizToDelete))
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete quiz:", error)
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      })
    } finally {
      setQuizToDelete(null)
    }
  }

  // Get unique courses for filter dropdown
  const courses =
    quizzes.length > 0
      ? [...new Set(quizzes.map((quiz) => quiz.courseId))].map((id) => {
          const course = quizzes.find((q) => q.courseId === id)
          return { id, name: course?.courseName }
        })
      : []

  // Filter quizzes based on search term and filters
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = courseFilter === "all" || quiz.courseId === courseFilter

    const now = new Date()
    const isUpcoming = new Date(quiz.startDate) > now
    const isCompleted = new Date(quiz.endDate) < now
    const isActive = !isUpcoming && !isCompleted && quiz.isActive

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !quiz.isActive) ||
      (statusFilter === "upcoming" && isUpcoming) ||
      (statusFilter === "completed" && isCompleted)

    return matchesSearch && matchesCourse && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="course-filter" className="whitespace-nowrap">
            Course:
          </Label>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger id="course-filter" className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="whitespace-nowrap">
            Status:
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-lg font-semibold">No quizzes found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new quiz.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onDelete={() => setQuizToDelete(quiz.id)} />
          ))}
        </div>
      )}

      <AlertDialog open={!!quizToDelete} onOpenChange={(open) => !open && setQuizToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this quiz and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function QuizCard({ quiz, onDelete }: { quiz: Quiz; onDelete: () => void }) {
  const isUpcoming = new Date(quiz.startDate) > new Date()
  const isCompleted = new Date(quiz.endDate) < new Date()
  const isInProgress = !isUpcoming && !isCompleted && quiz.isActive

  let statusBadge
  if (isUpcoming) {
    statusBadge = <Badge variant="outline">Upcoming</Badge>
  } else if (isInProgress) {
    statusBadge = <Badge variant="default">Active</Badge>
  } else if (isCompleted) {
    statusBadge = <Badge variant="secondary">Completed</Badge>
  } else {
    statusBadge = <Badge variant="outline">Inactive</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
            <CardDescription>{quiz.courseName}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Topic:</span> {quiz.topic}
          </div>
          <div className="text-sm">
            <span className="font-medium">Questions:</span> {quiz.numberOfQuestions} (
            {quiz.questionType.replace("_", " ")})
          </div>
          <div className="text-sm flex items-center">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span className="font-medium">Duration:</span> {quiz.timeLimit} minutes
          </div>
          <div className="text-sm">
            <span className="font-medium">Schedule:</span> {formatDate(quiz.startDate)} to {formatDate(quiz.endDate)}
          </div>

          {!isUpcoming && quiz.attempts > 0 && (
            <div className="mt-4">
              <div className="text-sm mb-2 font-medium">Performance Overview</div>
              <div className="flex justify-between text-xs">
                <div>
                  <div className="font-medium">{quiz.attempts}</div>
                  <div className="text-muted-foreground">Attempts</div>
                </div>
                <div>
                  <div className="font-medium">{quiz.averageScore.toFixed(1)}</div>
                  <div className="text-muted-foreground">Avg. Score</div>
                </div>
                <div>
                  <div className="font-medium">{quiz.passRate}%</div>
                  <div className="text-muted-foreground">Pass Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Link href={`/quizzes/${quiz.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit2 className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <Link href={`/quizzes/${quiz.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-1 h-3.5 w-3.5" />
              View
            </Button>
          </Link>
        </div>
        {!isUpcoming && quiz.attempts > 0 ? (
          <Link href={`/quizzes/${quiz.id}/analytics`}>
            <Button size="sm" variant="secondary">
              <BarChart2 className="mr-1 h-3.5 w-3.5" />
              Analytics
            </Button>
          </Link>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this quiz and all associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  )
}
