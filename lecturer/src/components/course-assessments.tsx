"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, FileText, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { authService, lecturerService } from "@/lib/api-services"

interface CourseAssessmentsProps {
  courseId: string
}

interface Assessment {
  id: string
  title: string
  type: "assignment" | "quiz" | "exam" | "project"
  dueDate: string
  totalPoints: number
  submissionCount: number
  totalStudents: number
  averageScore: number | null
  status: "upcoming" | "active" | "past_due" | "completed"
}

export function CourseAssessments({ courseId }: CourseAssessmentsProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true)
        const user = authService.getCurrentUser()
        if (!user) throw new Error("User not authenticated")

        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const assessmentsData = await lecturerService.getCourseAssessments(courseId, lecturerProfile.id)
        setAssessments(assessmentsData)
      } catch (err) {
        console.error("Failed to fetch assessments:", err)
        setError("Failed to load assessment data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [courseId])

  const getAssessmentTypeBadge = (type: string) => {
    switch (type) {
      case "assignment":
        return <Badge className="bg-blue-500">Assignment</Badge>
      case "quiz":
        return <Badge className="bg-green-500">Quiz</Badge>
      case "exam":
        return <Badge className="bg-purple-500">Exam</Badge>
      case "project":
        return <Badge className="bg-amber-500">Project</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <CourseAssessmentsSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Assessments</CardTitle>
          <CardDescription>Assignments, quizzes, and exams for this course</CardDescription>
        </div>
        <Link href={`/assessments/new?courseId=${courseId}`} passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No assessments found</h3>
            <p className="mt-2 text-sm text-muted-foreground">There are no assessments created for this course yet.</p>
            <Link href={`/assessments/new?courseId=${courseId}`} passHref>
              <Button className="mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.title}</TableCell>
                    <TableCell>{getAssessmentTypeBadge(assessment.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {new Date(assessment.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex text-xs text-muted-foreground justify-between">
                          <span>
                            {assessment.submissionCount} / {assessment.totalStudents}
                          </span>
                          <span>{Math.round((assessment.submissionCount / assessment.totalStudents) * 100) || 0}%</span>
                        </div>
                        <Progress
                          value={(assessment.submissionCount / assessment.totalStudents) * 100}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {assessment.averageScore !== null ? (
                        <span>
                          {assessment.averageScore.toFixed(1)} / {assessment.totalPoints}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No grades yet</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/assessments/${assessment.id}`} passHref>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/assessments/${assessment.id}/edit`} passHref>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CourseAssessmentsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3 mt-1" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
