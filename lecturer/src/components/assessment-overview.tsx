"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { CheckCircle, Clock, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Assessment {
  id: string
  title: string
  courseCode: string
  dueDate: string
  submissionCount: number
  totalStudents: number
  gradedCount: number
  type: "assignment" | "quiz" | "exam" | "project"
}

export function AssessmentOverview() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from API
    const fetchAssessments = async () => {
      try {
        // Mock data for demonstration
        const mockAssessments = [
          {
            id: "1",
            title: "Programming Assignment 1",
            courseCode: "CS101",
            dueDate: "2025-05-05T23:59:59",
            submissionCount: 28,
            totalStudents: 35,
            gradedCount: 15,
            type: "assignment" as const,
          },
          {
            id: "2",
            title: "Data Structures Quiz",
            courseCode: "CS201",
            dueDate: "2025-05-03T23:59:59",
            submissionCount: 25,
            totalStudents: 28,
            gradedCount: 25,
            type: "quiz" as const,
          },
          {
            id: "3",
            title: "Database Design Project",
            courseCode: "CS301",
            dueDate: "2025-05-15T23:59:59",
            submissionCount: 5,
            totalStudents: 22,
            gradedCount: 0,
            type: "project" as const,
          },
          {
            id: "4",
            title: "Web Development Midterm",
            courseCode: "CS401",
            dueDate: "2025-05-10T14:00:00",
            submissionCount: 0,
            totalStudents: 18,
            gradedCount: 0,
            type: "exam" as const,
          },
        ]

        // Simulate API delay
        setTimeout(() => {
          setAssessments(mockAssessments)
          setLoading(false)
        }, 1000)

        // Real API call would be:
        // const response = await fetch('/api/lecturer/assessments/overview')
        // const data = await response.json()
        // setAssessments(data)
      } catch (error) {
        console.error("Failed to fetch assessment overview:", error)
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {assessments.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No assessments found</p>
      ) : (
        assessments.map((assessment) => {
          const submissionPercentage = Math.round((assessment.submissionCount / assessment.totalStudents) * 100)
          const gradingPercentage =
            assessment.submissionCount > 0 ? Math.round((assessment.gradedCount / assessment.submissionCount) * 100) : 0

          return (
            <div key={assessment.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{assessment.title}</h3>
                <Badge variant={getAssessmentBadgeVariant(assessment.type)}>
                  {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{assessment.courseCode}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Due {format(new Date(assessment.dueDate), "MMM d, h:mm a")}</span>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Submissions</span>
                    <span>
                      {assessment.submissionCount} / {assessment.totalStudents}
                    </span>
                  </div>
                  <Progress value={submissionPercentage} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Graded</span>
                    <span>
                      {assessment.gradedCount} / {assessment.submissionCount}
                    </span>
                  </div>
                  <Progress value={gradingPercentage} className="h-2" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{assessment.submissionCount} submissions</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{assessment.gradedCount} graded</span>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function getAssessmentBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "assignment":
      return "default"
    case "quiz":
      return "secondary"
    case "exam":
      return "destructive"
    case "project":
      return "outline"
    default:
      return "default"
  }
}
