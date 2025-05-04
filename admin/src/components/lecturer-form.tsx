"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDepartments } from "@/store/slices/departments-slice"
import { useToast } from "@/components/ui/use-toast"
import { updateLecturer, createLecturer } from "@/lib/api"
import { LecturerProfile } from "@/types/lecturer"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  staffId: z.string().min(2, "Staff ID must be at least 2 characters"),
  title: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  officeLocation: z.string().optional(),
  officeHours: z.string().optional(),
  phoneNumber: z.string().optional(),
  departmentId: z.string().uuid("Please select a department"),
  joinDate: z.string(),
  status: z.enum(["active", "on_leave", "retired", "terminated"]).default("active"),
})

type FormValues = z.infer<typeof formSchema>

interface LecturerFormProps {
  lecturer?: LecturerProfile
  isEditing?: boolean
}

export function LecturerForm({ lecturer, isEditing = false }: LecturerFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { departments } = useAppSelector((state) => state.departments)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const defaultValues: Partial<FormValues> = {
    firstName: lecturer?.user?.firstName || "",
    lastName: lecturer?.user?.lastName || "",
    email: lecturer?.user?.email || "",
    staffId: lecturer?.staffId || "",
    title: lecturer?.title || "",
    specialization: lecturer?.specialization || "",
    bio: lecturer?.bio || "",
    officeLocation: lecturer?.officeLocation || "",
    officeHours: lecturer?.officeHours || "",
    phoneNumber: lecturer?.phoneNumber || "",
    departmentId: lecturer?.departmentId || "",
    joinDate: lecturer?.joinDate
      ? new Date(lecturer.joinDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    status: lecturer?.status || "active",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      if (isEditing && lecturer) {
        await dispatch(
          updateLecturer({
            id: lecturer.id,
            lecturerData: {
              title: data.title,
              specialization: data.specialization,
              bio: data.bio,
              officeLocation: data.officeLocation,
              officeHours: data.officeHours,
              phoneNumber: data.phoneNumber,
              departmentId: data.departmentId,
              status: data.status,
              joinDate: data.joinDate,
            },
          }),
        ).unwrap()
        toast({
          title: "Success",
          description: "Lecturer updated successfully",
        })
      } else {
        await dispatch(
          createLecturer({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            staffId: data.staffId,
            title: data.title,
            specialization: data.specialization,
            bio: data.bio,
            officeLocation: data.officeLocation,
            officeHours: data.officeHours,
            phoneNumber: data.phoneNumber,
            departmentId: data.departmentId,
            joinDate: data.joinDate,
            status: data.status,
          }),
        ).unwrap()
        toast({
          title: "Success",
          description: "Lecturer created successfully",
        })
      }
      router.push("/lecturers")
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update lecturer" : "Failed to create lecturer",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Lecturer" : "Add New Lecturer"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the lecturer's information" : "Fill in the details to create a new lecturer profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff ID</FormLabel>
                    <FormControl>
                      <Input placeholder="LEC-12345" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Assoc. Prof.">Assoc. Prof.</SelectItem>
                        <SelectItem value="Asst. Prof.">Asst. Prof.</SelectItem>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Building A, Room 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Wed 10:00-12:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the lecturer's background and expertise"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/lecturers")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Lecturer" : "Create Lecturer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
