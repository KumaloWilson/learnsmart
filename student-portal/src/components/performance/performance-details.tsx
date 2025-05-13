"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getPerformance } from "@/lib/api/performance-api"

export function PerformanceDetails() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentProfileId) return

      setIsLoading(true)
      try {
        const data = await getPerformance(user.studentProfileId)
        setPerformanceData(data)
      } catch (error) {
        console.error("Error fetching performance data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load performance data. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
          <CardDescription>Loading performance details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!performanceData || !performanceData.courses || performanceData.courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No performance data is available yet. Complete assessments and quizzes to see your performance.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data for course performance
  const coursePerformance = [
    {
      id: "course1",
      name: "Introduction to Computer Science",
      code: "CS101",
      grade: "A",
      score: 92,
      status: "Completed",
    },
    {
      id: "course2",
      name: "Data Structures and Algorithms",
      code: "CS201",
      grade: "B+",
      score: 87,
      status: "In Progress",
    },
    {
      id: "course3",
      name: "Database Systems",
      code: "CS301",
      grade: "A-",
      score: 90,
      status: "In Progress",
    },
    {
      id: "course4",
      name: "Web Development",
      code: "CS401",
      grade: "B",
      score: 85,
      status: "In Progress",
    },
  ]

  // Mock data for assessment performance
  const assessmentPerformance = [
    {
      id: "assessment1",
      title: "Midterm Exam",
      course: "Introduction to Computer Science",
      score: 90,
      maxScore: 100,
      date: "2023-10-15",
      type: "Exam",
    },
    {
      id: "assessment2",
      title: "Programming Assignment 1",
      course: "Data Structures and Algorithms",
      score: 85,
      maxScore: 100,
      date: "2023-11-05",
      type: "Assignment",
    },
    {
      id: "assessment3",
      title: "Database Design Project",
      course: "Database Systems",
      score: 92,
      maxScore: 100,
      date: "2023-11-20",
      type: "Project",
    },
    {
      id: "assessment4",
      title: "Quiz 2",
      course: "Web Development",
      score: 88,
      maxScore: 100,
      date: "2023-12-01",
      type: "Quiz",
    },
  ]

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith("A")) return <Badge className="bg-green-500">A</Badge>
    if (grade.startsWith("B")) return <Badge className="bg-blue-500">B</Badge>
    if (grade.startsWith("C")) return <Badge className="bg-yellow-500">C</Badge>
    if (grade.startsWith("D")) return <Badge className="bg-orange-500">D</Badge>
    return <Badge className="bg-red-500">F</Badge>
  }

  const getStatusBadge = (status: string) => {
    if (status === "Completed") return <Badge variant="secondary">Completed</Badge>
    if (status === "In Progress") return <Badge variant="outline">In Progress</Badge>
    return <Badge variant="destructive">Not Started</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>Your performance across all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursePerformance.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{getGradeBadge(course.grade)}</TableCell>
                  <TableCell>{course.score}%</TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Performance</CardTitle>
          <CardDescription>Your performance in recent assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessmentPerformance.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.title}</TableCell>
                  <TableCell>{assessment.course}</TableCell>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>
                    {assessment.score}/{assessment.maxScore} (
                    {Math.round((assessment.score / assessment.maxScore) * 100)}%)
                  </TableCell>
                  <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
