"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCourses } from "@/hooks/use-courses"
import { useSemesters } from "@/hooks/use-semesters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Pencil, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseDetailProps {
  id: string
}

export function CourseDetail({ id }: CourseDetailProps) {
  const router = useRouter()
  const { currentCourse, loadCourse, isLoading, error, assignToSemester, removeFromSemester } = useCourses()
  const { semesters, loadSemesters, isLoading: semestersLoading } = useSemesters()
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadCourse(id)
    loadSemesters()
  }, [id, loadCourse, loadSemesters])

  const handleAssignToSemester = async () => {
    if (!selectedSemesterId) return

    setIsAssigning(true)
    try {
      await assignToSemester(id, selectedSemesterId)
      await loadCourse(id)
      setDialogOpen(false)
    } catch (error) {
      console.error("Error assigning course to semester:", error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleRemoveFromSemester = async (semesterId: string) => {
    setIsRemoving(true)
    try {
      await removeFromSemester(id, semesterId)
      await loadCourse(id)
    } catch (error) {
      console.error("Error removing course from semester:", error)
    } finally {
      setIsRemoving(false)
    }
  }

  if (isLoading.currentCourse) {
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

  if (!currentCourse) {
    return (
      <Alert>
        <AlertDescription>Course not found</AlertDescription>
      </Alert>
    )
  }

  // Filter out semesters that the course is already assigned to
  const availableSemesters = semesters.filter((semester) => !currentCourse.semesters?.some((s) => s.id === semester.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentCourse.name}</h1>
          <p className="text-muted-foreground">Code: {currentCourse.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/courses")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          <Button size="sm" onClick={() => router.push(`/courses/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Course
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Detailed information about the course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{currentCourse.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Level</h3>
              <p className="text-sm text-muted-foreground">{currentCourse.level}</p>
            </div>
            <div>
              <h3 className="font-medium">Credit Hours</h3>
              <p className="text-sm text-muted-foreground">{currentCourse.creditHours}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Program</h3>
            <p className="text-sm text-muted-foreground">{currentCourse.program?.name || "Unknown Program"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentCourse.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentCourse.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Semesters</CardTitle>
            <CardDescription>Semesters this course is offered in</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={availableSemesters.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Assign to Semester
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign to Semester</DialogTitle>
                <DialogDescription>Select a semester to assign this course to.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSemesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignToSemester} disabled={!selectedSemesterId || isAssigning}>
                  {isAssigning ? "Assigning..." : "Assign"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {semestersLoading.semesters ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b pb-2">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : currentCourse.semesters && currentCourse.semesters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCourse.semesters.map((semester) => (
                  <TableRow key={semester.id}>
                    <TableCell className="font-medium">{semester.name}</TableCell>
                    <TableCell>{new Date(semester.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(semester.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{semester.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromSemester(semester.id)}
                        disabled={isRemoving}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">This course is not assigned to any semesters yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
