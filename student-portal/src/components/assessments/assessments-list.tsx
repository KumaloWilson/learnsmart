"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format, isAfter } from "date-fns"
import { CalendarClock, Clock, FileText, Upload, CheckCircle, AlertTriangle } from "lucide-react"

type Assessment = {
  id: string
  title: string
  description: string
  dueDate: string
  type: string
  status: string
  course: {
    id: string
    name: string
  }
  submissionStatus?: {
    submitted: boolean
    submittedAt?: string
    grade?: number
    maxGrade?: number
    feedback?: string
  }
}

type AssessmentsListProps = {
  assessments: Assessment[]
  emptyMessage?: string
}

export function AssessmentsList({ assessments, emptyMessage = "No assessments found." }: AssessmentsListProps) {
  if (!assessments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No assessments found</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} />
      ))}
    </div>
  )
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const dueDate = new Date(assessment.dueDate)
  const now = new Date()
  const isPastDue = isAfter(now, dueDate)
  const isSubmitted = assessment.submissionStatus?.submitted
  const isGraded = assessment.submissionStatus?.grade !== undefined

  const statusColors: Record<string, string> = {
    upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    graded: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  let status = assessment.status
  if (isPastDue && !isSubmitted) status = "overdue"
  if (isSubmitted) status = isGraded ? "graded" : "submitted"

  const getStatusText = () => {
    switch (status) {
      case "upcoming":
        return "Upcoming"
      case "active":
        return "Active"
      case "submitted":
        return "Submitted"
      case "graded":
        return "Graded"
      case "overdue":
        return "Overdue"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getAssessmentTypeIcon = () => {
    switch (assessment.type.toLowerCase()) {
      case "assignment":
        return <FileText className="h-5 w-5" />
      case "project":
        return <FileText className="h-5 w-5" />
      case "essay":
        return <FileText className="h-5 w-5" />
      case "presentation":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{assessment.title}</CardTitle>
          <Badge className={statusColors[status]}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{assessment.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarClock className="mr-2 h-4 w-4" />
            <span>Due: {format(dueDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Time: {format(dueDate, "h:mm a")}</span>
          </div>
        </div>

        {isGraded && assessment.submissionStatus?.grade !== undefined && assessment.submissionStatus?.maxGrade && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Grade</span>
              <span>
                {assessment.submissionStatus.grade} / {assessment.submissionStatus.maxGrade} (
                {Math.round((assessment.submissionStatus.grade / assessment.submissionStatus.maxGrade) * 100)}%)
              </span>
            </div>
            <Progress
              value={(assessment.submissionStatus.grade / assessment.submissionStatus.maxGrade) * 100}
              className="h-2"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            {getAssessmentTypeIcon()}
            <span className="ml-1">{assessment.type}</span>
          </div>
          <span>•</span>
          <span>{assessment.course.name}</span>
        </div>

        {status === "active" && (
          <Button asChild>
            <Link href={`/assessments/${assessment.id}`}>
              <Upload className="mr-2 h-4 w-4" />
              Submit
            </Link>
          </Button>
        )}

        {status === "submitted" && (
          <Button variant="outline" asChild>
            <Link href={`/assessments/${assessment.id}`}>
              <CheckCircle className="mr-2 h-4 w-4" />
              View Submission
            </Link>
          </Button>
        )}

        {status === "graded" && (
          <Button variant="outline" asChild>
            <Link href={`/assessments/${assessment.id}`}>
              <CheckCircle className="mr-2 h-4 w-4" />
              View Feedback
            </Link>
          </Button>
        )}

        {status === "overdue" && (
          <Button variant="outline" asChild disabled={isPastDue}>
            <Link href={`/assessments/${assessment.id}`}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Overdue
            </Link>
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" asChild>
            <Link href={`/assessments/${assessment.id}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
