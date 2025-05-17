"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useVirtualClasses, useVirtualClassActions } from "@/lib/auth/hooks"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scheduledStartTime: z.string().min(1, "Please select a start time"),
  scheduledEndTime: z.string().min(1, "Please select an end time"),
  isRecorded: z.boolean().default(true),
  platform: z.string().min(1, "Please select a platform"),
  passcode: z.string().optional(),
})

export default function EditVirtualClassPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { lecturerProfile } = useAuth()
  const { getUpcomingVirtualClasses, virtualClasses, isLoading } = useVirtualClasses()
  const { updateVirtualClass, isLoading: isUpdating, error, success } = useVirtualClassActions()
  const [virtualClass, setVirtualClass] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledStartTime: "",
      scheduledEndTime: "",
      isRecorded: true,
      platform: "Jitsi",
      passcode: "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && id) {
        try {
          // Fetch virtual classes if not already loaded
          if (virtualClasses.length === 0) {
            await getUpcomingVirtualClasses(lecturerProfile.id)
          }

          // Find the current virtual class
          const currentClass = virtualClasses.find((vc) => vc.id === id)
          if (currentClass) {
            setVirtualClass(currentClass)

            // Format dates for input fields
            const startTime = new Date(currentClass.scheduledStartTime)
            const endTime = new Date(currentClass.scheduledEndTime)

            // Format to YYYY-MM-DDThh:mm
            const formatDateForInput = (date: Date) => {
              return date.toISOString().slice(0, 16)
            }

            // Set form values
            form.reset({
              title: currentClass.title,
              description: currentClass.description,
              scheduledStartTime: formatDateForInput(startTime),
              scheduledEndTime: formatDateForInput(endTime),
              isRecorded: currentClass.isRecorded,
              platform: currentClass.meetingConfig.platform,
              passcode: currentClass.meetingConfig.passcode || "",
            })
          }
        } catch (err) {
          console.error("Error fetching virtual class data:", err)
        }
      }
    }

    fetchData()
  }, [lecturerProfile, id, virtualClasses, getUpcomingVirtualClasses, form])

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
      router.push(`/virtual-classes/${id}`)
    }
  }, [error, success, toast, router, id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (new Date(values.scheduledEndTime) <= new Date(values.scheduledStartTime)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "End time must be after start time",
      })
      return
    }

    try {
      await updateVirtualClass(id as string, {
        title: values.title,
        description: values.description,
        scheduledStartTime: values.scheduledStartTime,
        scheduledEndTime: values.scheduledEndTime,
        isRecorded: values.isRecorded,
        meetingConfig: {
          platform: values.platform,
          passcode: values.passcode || "abc123",
        },
      })
    } catch (err) {
      console.error("Error updating virtual class:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading virtual class details...</p>
        </div>
      </div>
    )
  }

  if (!virtualClass) {
    return (
      <PageContainer title="Edit Virtual Class" description="Update virtual class details">
        <Alert variant="destructive">
          <AlertDescription>Virtual class not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/virtual-classes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Virtual Classes
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Edit Virtual Class" description="Update virtual class details">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-2">
          <Link href={`/virtual-classes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-xl font-semibold">Edit: {virtualClass.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Virtual Class Details</CardTitle>
          <CardDescription>Update the details of your virtual class</CardDescription>
        </CardHeader>
        <CardContent>
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
                <Button variant="outline" type="button" asChild>
                  <Link href={`/virtual-classes/${id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Virtual Class"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
