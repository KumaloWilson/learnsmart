"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/lib/axios"

export default function AttendanceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const attendanceId = params.id as string

  const [attendance, setAttendance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [topic, setTopic] = useState("")
  const [notes, setNotes] = useState("")
  const [isPresent, setIsPresent] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(`/attendance/${attendanceId}`)
        setAttendance(response.data)

        // Initialize form state
        setDate(new Date(response.data.date))
        setTopic(response.data.topic)
        setNotes(response.data.notes || "")
        setIsPresent(response.data.isPresent)
      } catch (err) {
        console.error("Failed to fetch attendance record:", err)
        setError("Failed to load attendance record. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (attendanceId) {
      fetchAttendance()
    }
  }, [attendanceId])

  const handleUpdate = async () => {
    if (!date || !topic) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        date: date.toISOString(),
        topic,
        notes,
        isPresent,
      }

      await axiosInstance.put(`/attendance/${attendanceId}`, payload)

      toast({
        title: "Success",
        description: "Attendance record has been updated successfully",
      })

      // Refresh the data
      const response = await axiosInstance.get(`/attendance/${attendanceId}`)
      setAttendance(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update attendance:", error)
      toast({
        title: "Error",
        description: "Failed to update attendance record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)

    try {
      await axiosInstance.delete(`/attendance/${attendanceId}`)

      toast({
        title: "Success",
        description: "Attendance record has been deleted successfully",
      })

      router.push("/attendance")
    } catch (error) {
      console.error("Failed to delete attendance:", error)
      toast({
        title: "Error",
        description: "Failed to delete attendance record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <PageContainer title="Attendance Record" description="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (error || !attendance) {
    return (
      <PageContainer title="Attendance Record" description="Error">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Failed to load attendance record"}</p>
              <Button onClick={() => router.push("/attendance")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Attendance Record"
      description={`${attendance.studentProfile.user.firstName} ${attendance.studentProfile.user.lastName} - ${format(new Date(attendance.date), "PPP")}`}
      actions={
        <Button variant="outline" onClick={() => router.push("/attendance")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendance
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Details</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this attendance record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Student</Label>
              <div className="p-2 border rounded-md bg-muted/20">
                <p className="font-medium">
                  {attendance.studentProfile.user.firstName} {attendance.studentProfile.user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">ID: {attendance.studentProfile.studentId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <div className="p-2 border rounded-md bg-muted/20">
                <p className="font-medium">
                  {attendance.course.code}: {attendance.course.name}
                </p>
                <p className="text-sm text-muted-foreground">Semester: {attendance.semester.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="p-2 border rounded-md bg-muted/20">{format(new Date(attendance.date), "PPP")}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              {isEditing ? (
                <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
              ) : (
                <div className="p-2 border rounded-md bg-muted/20">{attendance.topic}</div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this attendance record"
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/20 min-h-[80px]">
                  {attendance.notes || "No notes provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Attendance Status</Label>
              {isEditing ? (
                <div className="flex items-center space-x-2 p-2">
                  <Checkbox
                    id="isPresent"
                    checked={isPresent}
                    onCheckedChange={(checked) => setIsPresent(checked === true)}
                  />
                  <label
                    htmlFor="isPresent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as present
                  </label>
                </div>
              ) : (
                <div className="p-2 border rounded-md bg-muted/20">
                  <div className="flex items-center">
                    <Checkbox checked={attendance.isPresent} disabled className="mr-2" />
                    <span>{attendance.isPresent ? "Present" : "Absent"}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Recorded By</Label>
              <div className="p-2 border rounded-md bg-muted/20">
                <p className="font-medium">
                  {attendance.lecturerProfile.user.firstName} {attendance.lecturerProfile.user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {attendance.lecturerProfile.title} {attendance.lecturerProfile.specialization}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
