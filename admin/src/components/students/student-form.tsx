"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import { usePrograms } from "@/hooks/use-programs"
import type { StudentFormData } from "@/types/student"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  studentId: z.string().min(2, "Student ID is required"),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  programId: z.string().min(1, "Program is required"),
  enrollmentDate: z.date(),
  currentLevel: z.coerce.number().min(1, "Level is required"),
  status: z.enum(["active", "inactive", "graduated", "suspended"]).default("active"),
})

type StudentFormProps = {
  studentId?: string
}

export default function StudentForm({ studentId }: StudentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentStudent, loading, error, getStudentById, createStudent, updateStudent, resetCurrentStudent } =
    useStudents()
  const { programs, getPrograms } = usePrograms()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      gender: "",
      address: "",
      phoneNumber: "",
      programId: "",
      currentLevel: 1,
      status: "active",
    },
  })

  useEffect(() => {
    getPrograms()

    if (studentId) {
      getStudentById(studentId)
    }

    return () => {
      resetCurrentStudent()
    }
  }, [studentId, getStudentById, getPrograms, resetCurrentStudent])

  useEffect(() => {
    if (currentStudent && studentId) {
      form.reset({
        firstName: currentStudent.user?.firstName || "",
        lastName: currentStudent.user?.lastName || "",
        email: currentStudent.user?.email || "",
        studentId: currentStudent.studentId || "",
        dateOfBirth: currentStudent.dateOfBirth ? new Date(currentStudent.dateOfBirth) : undefined,
        gender: currentStudent.gender || "",
        address: currentStudent.address || "",
        phoneNumber: currentStudent.phoneNumber || "",
        programId: currentStudent.programId || "",
        enrollmentDate: currentStudent.enrollmentDate ? new Date(currentStudent.enrollmentDate) : new Date(),
        currentLevel: currentStudent.currentLevel || 1,
        status: (currentStudent.status as any) || "active",
      })
    }
  }, [currentStudent, studentId, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const studentData: StudentFormData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        studentId: data.studentId,
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined,
        gender: data.gender,
        address: data.address,
        phoneNumber: data.phoneNumber,
        programId: data.programId,
        enrollmentDate: format(data.enrollmentDate, "yyyy-MM-dd"),
        currentLevel: data.currentLevel,
        status: data.status,
      }

      if (studentId) {
        await updateStudent(studentId, studentData)
        toast({
          title: "Student updated",
          description: "Student has been updated successfully",
        })
      } else {
        await createStudent(studentData)
        toast({
          title: "Student created",
          description: "Student has been created successfully",
        })
      }

      router.push("/students")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to save student information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{studentId ? "Edit Student" : "Add New Student"}</CardTitle>
        <CardDescription>{studentId ? "Update student information" : "Create a new student record"}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
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
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Student ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
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
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Student's address" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="programId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="enrollmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Enrollment Date</FormLabel>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Level</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="1" placeholder="Current level" {...field} />
                    </FormControl>
                    <FormDescription>E.g., 1.1, 1.2, 2.1, etc.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/students")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : studentId ? "Update Student" : "Create Student"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
