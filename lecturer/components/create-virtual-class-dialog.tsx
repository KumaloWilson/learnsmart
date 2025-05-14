"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useVirtualClassActions, useCourses } from "@/lib/auth/hooks"
import { useToast } from "@/components/ui/use-toast"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  courseId: z.string().min(1, "Please select a course"),
  semesterId: z.string().min(1, "Please select a semester"),
  scheduledStartTime: z.string().min(1, "Please select a start time"),
  scheduledEndTime: z.string().min(1, "Please select an end time"),
  isRecorded: z.boolean().default(true),
  platform: z.string().min(1, "Please select a platform"),
  passcode: z.string().optional(),
})

interface CreateVirtualClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lecturerId: string
}

export function CreateVirtualClassDialog({ open, onOpenChange, lecturerId }: CreateVirtualClassDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { createVirtualClass, isLoading, error, success, setError } = useVirtualClassActions()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      semesterId: "",
      scheduledStartTime: "",
      scheduledEndTime: "",
      isRecorded: true,
      platform: "Jitsi",
      passcode: "",
    },
  })

  useEffect(() => {
    if (lecturerId && open) {
      getCourses(lecturerId)
    }
  }, [lecturerId, getCourses, open])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
    if (success) {
      toast({
        title: "Success",
        description: success,
      })
      onOpenChange(false)
      router.refresh()
    }
  }, [error, success, toast, onOpenChange, router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (new Date(values.scheduledEndTime) <= new Date(values.scheduledStartTime)) {
      setError("End time must be after start time")
      return
    }

    try {
      await createVirtualClass({
        title: values.title,
        description: values.description,
        scheduledStartTime: values.scheduledStartTime,
        scheduledEndTime: values.scheduledEndTime,
        isRecorded: values.isRecorded,
        lecturerProfileId: lecturerId,
        courseId: values.courseId,
        semesterId: values.semesterId,
        meetingConfig: {
          platform: values.platform,
          passcode: values.passcode || "abc123",
        },
      })
    } catch (err) {
      console.error("Error creating virtual class:", err)
    }
  }

  // Get available semesters for the selected course
  const getAvailableSemesters = () => {
    if (!selectedCourse) return []

    const course = courses.find((c) => c.courseId === selectedCourse)
    if (!course) return []

    return [
      {
        id: course.semesterId,
        name: course.semesterName,
      },
    ]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Virtual Class</DialogTitle>
          <DialogDescription>
            Schedule a new virtual class for your students. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to AI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Jitsi">Jitsi</SelectItem>
                        <SelectItem value="Zoom">Zoom</SelectItem>
                        <SelectItem value="Google Meet">Google Meet</SelectItem>
                        <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Overview of basic AI concepts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedCourse(value)

                        // Auto-select semester if there's only one
                        const course = courses.find((c) => c.courseId === value)
                        if (course) {
                          form.setValue("semesterId", course.semesterId)
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCourses ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Loading courses...</span>
                          </div>
                        ) : (
                          courses.map((course) => (
                            <SelectItem key={course.courseId} value={course.courseId}>
                              {course.courseCode} - {course.courseName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semesterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCourse ? (
                          getAvailableSemesters().map((semester) => (
                            <SelectItem key={semester.id} value={semester.id}>
                              {semester.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            Select a course first
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="scheduledStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledEndTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isRecorded"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Record Session</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        The session will be recorded and available for students to watch later.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passcode (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter passcode for the meeting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Virtual Class"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
