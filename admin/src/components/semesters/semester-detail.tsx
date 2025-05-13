"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSemesters } from "@/hooks/use-semesters"
import { usePeriods } from "@/hooks/use-periods"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Plus } from "lucide-react"

interface SemesterDetailProps {
  id: string
}

export function SemesterDetail({ id }: SemesterDetailProps) {
  const router = useRouter()
  const { currentSemester, loadSemester, isLoading, error } = useSemesters()
  const { loadPeriodsBySemester, semesterPeriods, isLoading: periodsLoading } = usePeriods()

  useEffect(() => {
    const fetchData = async () => {
      await loadSemester(id)
      await loadPeriodsBySemester(id)
    }
    fetchData()
  }, [id, loadSemester, loadPeriodsBySemester])

  if (isLoading.currentSemester) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!currentSemester) {
    return (
      <Alert>
        <AlertDescription>Semester not found</AlertDescription>
      </Alert>
    )
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const formatDayOfWeek = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentSemester.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Academic Year: {currentSemester.academicYear}</p>
            <Badge variant={currentSemester.isActive ? "default" : "outline"}>
              {currentSemester.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/semesters")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semesters
          </Button>
          <Button size="sm" onClick={() => router.push(`/semesters/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Semester
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester Information</CardTitle>
          <CardDescription>Detailed information about the semester</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Start Date</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(currentSemester.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-medium">End Date</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentSemester.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(currentSemester.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(currentSemester.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Periods</CardTitle>
            <CardDescription>Class periods for this semester</CardDescription>
          </div>
          <Button size="sm" onClick={() => router.push(`/periods/create?semesterId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Period
          </Button>
        </CardHeader>
        <CardContent>
          {periodsLoading.semesterPeriods ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b pb-2">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : semesterPeriods && semesterPeriods.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesterPeriods.map((period) => (
                  <TableRow
                    key={period.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/periods/${period.id}`)}
                  >
                    <TableCell className="font-medium">{period.name}</TableCell>
                    <TableCell className="capitalize">{formatDayOfWeek(period.dayOfWeek)}</TableCell>
                    <TableCell>{formatTime(period.startTime)}</TableCell>
                    <TableCell>{formatTime(period.endTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">No periods found for this semester.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Courses offered in this semester</CardDescription>
        </CardHeader>
        <CardContent>
          {currentSemester.courses && currentSemester.courses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Credit Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSemester.courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell>{course.creditHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">No courses assigned to this semester yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
