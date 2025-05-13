"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock } from "lucide-react"

interface CourseAssessmentsProps {
  assessments: any[]
  isLoading: boolean
}

export function CourseAssessments({ assessments, isLoading }: CourseAssessmentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Assessments Available</CardTitle>
          <CardDescription>There are no assessments available for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getStatusBadge = (assessment: any) => {
    const now = new Date()
    const dueDate = new Date(assessment.dueDate)

    if (assessment.submitted) {
      return <Badge variant="secondary">Submitted</Badge>
    } else if (dueDate < now) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (dueDate.getTime() - now.getTime() < 86400000) {
      // Less than 24 hours
      return <Badge variant="destructive">Due Soon</Badge>
    } else {
      return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <Card key={assessment.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </div>
              {getStatusBadge(assessment)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Points: {assessment.totalPoints}</span>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href={`/assessments/${assessment.id}`}>
                  {assessment.submitted ? "View Submission" : "Submit"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
