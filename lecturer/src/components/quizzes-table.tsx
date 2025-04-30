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

// Mock quiz data
const mockQuizzes = [
  {
    id: "1",
    title: "Midterm Assessment",
    topic: "Introduction to Programming",
    courseId: "101",
    courseName: "CS101: Programming Fundamentals",
    questionType: "multiple_choice",
    numberOfQuestions: 20,
    timeLimit: 60,
    totalMarks: 100,
    passingMarks: 60,
    startDate: "2025-05-10T10:00:00",
    endDate: "2025-05-10T11:00:00",
    isActive: true,
    attempts: 28,
    averageScore: 76.4,
    passRate: 92.8,
  },
  {
    id: "2",
    title: "Weekly Quiz 3",
    topic: "Arrays and Pointers",
    courseId: "101",
    courseName: "CS101: Programming Fundamentals",
    questionType: "mixed",
    numberOfQuestions: 10,
    timeLimit: 30,
    totalMarks: 50,
    passingMarks: 30,
    startDate: "2025-05-05T14:00:00",
    endDate: "2025-05-05T14:30:00",
    isActive: false,
    attempts: 32,
    averageScore: 42.1,
    passRate: 87.5,
  },
  {
    id: "3",
    title: "Final Quiz",
    topic: "Advanced Data Structures",
    courseId: "202",
    courseName: "CS202: Data Structures",
    questionType: "mixed",
    numberOfQuestions: 15,
    timeLimit: 45,
    totalMarks: 75,
    passingMarks: 45,
    startDate: "2025-05-20T10:00:00",
    endDate: "2025-05-20T10:45:00",
    isActive: true,
    attempts: 0,
    averageScore: 0,
    passRate: 0,
  },
  {
    id: "4",
    title: "Practice Quiz",
    topic: "Algorithms Complexity",
    courseId: "202",
    courseName: "CS202: Data Structures",
    questionType: "true_false",
    numberOfQuestions: 20,
    timeLimit: 20,
    totalMarks: 20,
    passingMarks: 14,
    startDate: "2025-05-01T10:00:00",
    endDate: "2025-05-01T10:20:00",
    isActive: false,
    attempts: 25,
    averageScore: 18.2,
    passRate: 96,
  },
  {
    id: "5",
    title: "Short Assessment",
    topic: "Machine Learning Basics",
    courseId: "303",
    courseName: "CS303: Artificial Intelligence",
    questionType: "short_answer",
    numberOfQuestions: 5,
    timeLimit: 30,
    totalMarks: 50,
    passingMarks: 25,
    startDate: "2025-05-15T10:00:00",
    endDate: "2025-05-15T10:30:00",
    isActive: true,
    attempts: 12,
    averageScore: 28.5,
    passRate: 75,
  },
]

export function QuizzesTable() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Simulate API fetch
    const fetchQuizzes = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch("/api/lecturer/quizzes")
        // const data = await response.json()

        // Using mock data for now
        setTimeout(() => {
          setQuizzes(mockQuizzes)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch quizzes:", error)
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

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
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = courseFilter === "all" || quiz.courseId === courseFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && quiz.isActive) ||
      (statusFilter === "inactive" && !quiz.isActive) ||
      (statusFilter === "upcoming" && new Date(quiz.startDate) > new Date()) ||
      (statusFilter === "completed" && new Date(quiz.endDate) < new Date())

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
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  )
}

function QuizCard({ quiz }) {
  const isUpcoming = new Date(quiz.startDate) > new Date()
  const isCompleted = new Date(quiz.endDate) < new Date()
  const isInProgress = !isUpcoming && !isCompleted && quiz.isActive

  let statusBadge
  if (isUpcoming) {
    statusBadge = <Badge variant="outline">Upcoming</Badge>
  } else if (isInProgress) {
    statusBadge = <Badge variant="success">Active</Badge>
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
          <Button size="sm" variant="destructive">
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
