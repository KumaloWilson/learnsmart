"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentInfo() {
  const { profile, isLoading } = useAppSelector((state) => state.student)

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) return null

  const { studentId, currentLevel, program, activeSemester, currentSemesterPerformance } = profile

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Academic Information</CardTitle>
            <CardDescription>Current semester: {activeSemester.name}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Level {currentLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Student ID</p>
            <p className="text-sm text-muted-foreground">{studentId}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Program</p>
            <p className="text-sm text-muted-foreground">{program.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Current GPA</p>
            <div className="flex justify-between text-sm mb-1">
              <span>{currentSemesterPerformance.gpa.toFixed(2)}/4.0</span>
            </div>
            <Progress value={(currentSemesterPerformance.gpa / 4) * 100} className="h-2" />
          </div>

          <div>
            <p className="text-sm font-medium">Credits</p>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {currentSemesterPerformance.earnedCredits}/{currentSemesterPerformance.totalCredits}
              </span>
            </div>
            <Progress
              value={(currentSemesterPerformance.earnedCredits / currentSemesterPerformance.totalCredits) * 100}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
