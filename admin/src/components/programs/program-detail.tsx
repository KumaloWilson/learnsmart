"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrograms } from "@/hooks/use-programs"
import { useCourses } from "@/hooks/use-courses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Plus } from "lucide-react"

interface ProgramDetailProps {
  id: string
}

export function ProgramDetail({ id }: ProgramDetailProps) {
  const router = useRouter()
  const { currentProgram, loadProgram, isLoading, error } = usePrograms()
  const { loadCoursesByProgram, programCourses, isLoading: courseIsLoading } = useCourses()

  useEffect(() => {
    const fetchData = async () => {
      await loadProgram(id)
      await loadCoursesByProgram(id)
    }
    fetchData()
  }, [id, loadProgram, loadCoursesByProgram])

  if (isLoading.currentProgram) {
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

  if (!currentProgram) {
    return (
      <Alert>
        <AlertDescription>Program not found</AlertDescription>
      </Alert>
    )
  }

  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentProgram.name}</h1>
          <p className="text-muted-foreground">Code: {currentProgram.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/programs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>
          <Button size="sm" onClick={() => router.push(`/programs/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Program
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Information</CardTitle>
          <CardDescription>Detailed information about the program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{currentProgram.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Level</h3>
              <Badge variant="outline" className="mt-1 capitalize">
                {formatLevel(currentProgram.level)}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium">Duration</h3>
              <p className="text-sm text-muted-foreground">{currentProgram.durationYears} years</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Department</h3>
            <p className="text-sm text-muted-foreground">{currentProgram.department?.name || "Unknown Department"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentProgram.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentProgram.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Courses within this program</CardDescription>
          </div>
          <Button size="sm" onClick={() => router.push(`/courses/create?programId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          {courseIsLoading.programCourses ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b pb-2">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : programCourses && programCourses.length > 0 ? (
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
                {programCourses.map((course) => (
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
            <p className="text-center py-6 text-muted-foreground">No courses found for this program.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
