"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { getStudentDashboard } from "@/lib/api/student-portal-api"
import { formatDistanceToNow } from "date-fns"
import { CalendarClock, ArrowRight } from "lucide-react"

export function UpcomingAssessments() {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user?.studentProfileId) return

      try {
        const dashboardData = await getStudentDashboard(user.studentProfileId)
        setAssessments(dashboardData.upcomingAssessments || [])
      } catch (error) {
        console.error("Error fetching upcoming assessments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [user?.studentProfileId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
          <CardDescription>Assessments due in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Upcoming Assessments</CardTitle>
          <CardDescription>Assessments due in the next 7 days</CardDescription>
        </div>
        <Link href="/assessments" className="ml-auto">
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <CalendarClock className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No upcoming assessments</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You don't have any assessments due in the next 7 days.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                  <Link href={`/assessments/${assessment.id}`}>
                    <h3 className="font-semibold hover:underline">{assessment.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{assessment.course?.name}</p>
                    <Badge variant={getDueDateVariant(assessment.dueDate)}>
                      Due {formatDistanceToNow(new Date(assessment.dueDate), { addSuffix: true })}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getDueDateVariant(dueDate: string): "default" | "outline" | "secondary" | "destructive" {
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) return "destructive"
  if (diffDays <= 3) return "outline"
  return "secondary"
}
