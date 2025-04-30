"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, addHours, parse } from "date-fns"
import { lecturerService } from "@/lib/api-service"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Please select a course"),
  date: z.date({ required_error: "Please select a date" }),
  startTime: z.string().min(1, "Please select a start time"),
  endTime: z.string().min(1, "Please select an end time"),
  meetingPlatform: z.string().min(1, "Please select a meeting platform"),
  meetingLink: z.string().url("Please enter a valid URL"),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  recurrenceEndDate: z.date().optional(),
  sendReminders: z.boolean().default(true),
  isRecorded: z.boolean().default(true),
})

export function VirtualClassForm({ virtualClass = null }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: virtualClass
      ? {
          ...virtualClass,
          date: new Date(virtualClass.scheduledStartTime),
          startTime: format(new Date(virtualClass.scheduledStartTime), "HH:mm"),
          endTime: format(new Date(virtualClass.scheduledEndTime), "HH:mm"),
          isRecurring: !!virtualClass.recurrencePattern,
          recurrenceEndDate: virtualClass.recurrenceEndDate ? new Date(virtualClass.recurrenceEndDate) : undefined,
        }
      : {
          title: "",
          description: "",
          courseId: "",
          date: undefined,
          startTime: "",
          endTime: "",
          meetingPlatform: "jitsi",
          meetingLink: "",
          isRecurring: false,
          recurrencePattern: "weekly",
          sendReminders: true,
          isRecorded: true,
        },
  })

  const isRecurring = form.watch("isRecurring")
  const selectedDate = form.watch("date")
  const selectedStartTime = form.watch("startTime")

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const lecturerCourses = await lecturerService.getLecturerCourses(lecturerProfile.id)
        setCourses(lecturerCourses)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user, toast])

  // Auto-generate meeting link when platform changes
  useEffect(() => {
    const platform = form.getValues("meetingPlatform")
    const courseId = form.getValues("courseId")

    if (platform && courseId && !virtualClass) {
      let link = ""
      const randomId = Math.random().toString(36).substring(2, 10)

      switch (platform) {
        case "jitsi":
          link = `https://meet.jit.si/${courseId}-${randomId}`
          break
        case "zoom":
          link = `https://zoom.us/j/${randomId}`
          break
        case "teams":
          link = `https://teams.microsoft.com/l/meetup-join/${randomId}`
          break
        case "google":
          link = `https://meet.google.com/${randomId}`
          break
      }

      form.setValue("meetingLink", link)
    }
  }, [form.watch("meetingPlatform"), form.watch("courseId"), virtualClass])

  // Auto-suggest end time (1 hour after start time)
  useEffect(() => {
    if (selectedStartTime && !form.getValues("endTime") && !virtualClass) {
      try {
        const startDate = parse(selectedStartTime, "HH:mm", new Date())
        const endDate = addHours(startDate, 1)
        form.setValue("endTime", format(endDate, "HH:mm"))
      } catch (error) {
        console.error("Failed to parse time:", error)
      }
    }
  }, [selectedStartTime, form, virtualClass])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      const lecturerProfile = await lecturerService.getLecturerProfile(user.id)

      // Combine date and time
      const scheduledStartTime = new Date(values.date)
      const [startHours, startMinutes] = values.startTime.split(":").map(Number)
      scheduledStartTime.setHours(startHours, startMinutes, 0, 0)

      const scheduledEndTime = new Date(values.date)
      const [endHours, endMinutes] = values.endTime.split(":").map(Number)
      scheduledEndTime.setHours(endHours, endMinutes, 0, 0)

      const virtualClassData = {
        title: values.title,
        description: values.description || "",
        courseId: values.courseId,
        scheduledStartTime: scheduledStartTime.toISOString(),
        scheduledEndTime: scheduledEndTime.toISOString(),
        meetingPlatform: values.meetingPlatform,
        meetingLink: values.meetingLink,
        isRecorded: values.isRecorded,
        lecturerProfileId: lecturerProfile.id,
        sendReminders: values.sendReminders,
        ...(values.isRecurring && {
          recurrencePattern: values.recurrencePattern,
          recurrenceEndDate: values.recurrenceEndDate?.toISOString(),
        }),
      }

      if (virtualClass) {
        // Update existing virtual class
        await lecturerService.updateVirtualClass(virtualClass.id, virtualClassData)
        toast({
          title: "Success",
          description: "Virtual class updated successfully",
        })
      } else {
        // Create new virtual class
        await lecturerService.createVirtualClass(virtualClassData)
        toast({
          title: "Success",
          description: "Virtual class scheduled successfully",
        })
      }

      router.push("/virtual-classes")
    } catch (error) {
      console.error("Failed to save virtual class:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save virtual class",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{virtualClass ? "Edit Virtual Class" : "Schedule New Virtual Class"}</CardTitle>
            <CardDescription>
              {virtualClass
                ? "Update the details of your virtual class"
                : "Create a new online class session for your students"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction to Programming - Week 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of what will be covered in this class"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code}: {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="meetingPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jitsi">Jitsi Meet</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="google">Google Meet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Recurring Class</FormLabel>
                    <FormDescription>Set this class to repeat on a regular schedule</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isRecurring && (
              <>
                <FormField
                  control={form.control}
                  name="recurrencePattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence Pattern</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurrenceEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Recurrence</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick an end date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < selectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When should this recurring class stop? If not specified, it will continue indefinitely.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sendReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send Reminders</FormLabel>
                      <FormDescription>Notify students before the class starts</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRecorded"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Record Class</FormLabel>
                      <FormDescription>Save a recording for students to review later</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/virtual-classes")}>
              Cancel
            </Button>
            <Button type="submit">{virtualClass ? "Update Class" : "Schedule Class"}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
