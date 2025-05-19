"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchAcademicRecords } from "@/features/academic-records/redux/academicRecordsSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { GPAChart } from "@/features/academic-records/components/gpa-chart"
import { CreditsChart } from "@/features/academic-records/components/credits-chart"

export function AcademicRecords() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { records, isLoading, error } = useAppSelector((state) => state.academicRecords)

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        fetchAcademicRecords({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken])

  if (isLoading || !studentProfile) {
    return <AcademicRecordsSkeletonLoader />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!records.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Academic Records</h1>
        <p className="text-muted-foreground">View your academic history and achievements.</p>
        <Card>
          <CardHeader>
            <CardTitle>No Academic Records</CardTitle>
            <CardDescription>You don't have any academic records yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Sort records by semester date (newest first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.semester.startDate).getTime() - new Date(a.semester.startDate).getTime(),
  )

  // Calculate total credits earned and total credits
  const totalEarnedCredits = records.reduce((sum, record) => sum + record.earnedCredits, 0)
  const totalCredits = records.reduce((sum, record) => sum + record.totalCredits, 0)
  const creditCompletionRate = totalCredits > 0 ? (totalEarnedCredits / totalCredits) * 100 : 0

  // Get the latest CGPA
  const latestCGPA = sortedRecords[0]?.cgpa || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Academic Records</h1>
        <p className="text-muted-foreground">View your academic history and achievements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestCGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {latestCGPA >= 3.5
                ? "Excellent Standing"
                : latestCGPA >= 3.0
                  ? "Good Standing"
                  : latestCGPA >= 2.5
                    ? "Average Standing"
                    : "Needs Improvement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEarnedCredits}/{totalCredits}
            </div>
            <p className="text-xs text-muted-foreground">{creditCompletionRate.toFixed(0)}% completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Program Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Year {studentProfile.currentLevel} of {studentProfile.program.durationYears}
            </div>
            <p className="text-xs text-muted-foreground">
              {studentProfile.program.name} ({studentProfile.program.code})
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GPAChart records={records} />
        <CreditsChart records={records} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic History</CardTitle>
          <CardDescription>Your academic records across all semesters</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.semester.name}</TableCell>
                  <TableCell>{record.semester.academicYear}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        record.gpa >= 3.5
                          ? "bg-green-50 text-green-700 border-green-200"
                          : record.gpa >= 3.0
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : record.gpa >= 2.5
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {record.gpa.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.cgpa.toFixed(2)}</TableCell>
                  <TableCell>
                    {record.earnedCredits}/{record.totalCredits}
                  </TableCell>
                  <TableCell>{record.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function AcademicRecordsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-48 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1 mr-2" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-8 flex-1 mr-2" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
