"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { getNotificationSettings, updateNotificationSettings } from "@/lib/api/profile-api"

const formSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  emailDigest: z.enum(["daily", "weekly", "never"]),
  notificationTypes: z.object({
    assessments: z.boolean(),
    grades: z.boolean(),
    announcements: z.boolean(),
    courseUpdates: z.boolean(),
    virtualClasses: z.boolean(),
  }),
})

type NotificationSettingsProps = {
  userId: string
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      emailDigest: "daily",
      notificationTypes: {
        assessments: true,
        grades: true,
        announcements: true,
        courseUpdates: true,
        virtualClasses: true,
      },
    },
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsInitialLoading(true)
        const settings = await getNotificationSettings(userId)

        form.reset({
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          smsNotifications: settings.smsNotifications,
          emailDigest: settings.emailDigest,
          notificationTypes: {
            assessments: settings.notificationTypes?.assessments ?? true,
            grades: settings.notificationTypes?.grades ?? true,
            announcements: settings.notificationTypes?.announcements ?? true,
            courseUpdates: settings.notificationTypes?.courseUpdates ?? true,
            virtualClasses: settings.notificationTypes?.virtualClasses ?? true,
          },
        })
      } catch (error) {
        console.error("Failed to load notification settings:", error)
        toast({
          title: "Failed to load settings",
          description: "Could not load your notification settings. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadSettings()
  }, [userId, form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      await updateNotificationSettings(userId, values)

      toast({
        title: "Settings updated",
        description: "Your notification settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update notification settings:", error)
      toast({
        title: "Failed to update settings",
        description: "Could not update your notification settings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Loading your notification preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-6 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-6 w-full animate-pulse rounded bg-muted"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications from Learn Smart.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>

              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>Receive notifications via email</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pushNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Push Notifications</FormLabel>
                      <FormDescription>Receive notifications in your browser</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS Notifications</FormLabel>
                      <FormDescription>Receive important notifications via SMS</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailDigest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Digest Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How often you want to receive email digests</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Types</h3>

              <FormField
                control={form.control}
                name="notificationTypes.assessments"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Assessment Notifications</FormLabel>
                      <FormDescription>Notifications about new and upcoming assessments</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationTypes.grades"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Grade Notifications</FormLabel>
                      <FormDescription>Notifications when grades are posted</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationTypes.announcements"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Announcement Notifications</FormLabel>
                      <FormDescription>Notifications about course announcements</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationTypes.courseUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Course Update Notifications</FormLabel>
                      <FormDescription>Notifications about course content updates</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationTypes.virtualClasses"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Virtual Class Notifications</FormLabel>
                      <FormDescription>Notifications about upcoming virtual classes</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
