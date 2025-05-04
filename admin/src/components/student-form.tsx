"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { createStudent, updateStudent, fetchStudentById } from "@/store/slices/students-slice"
import { fetchPrograms } from "@/store/slices/programs-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { CreateStudentProfileDto, UpdateStudentProfileDto } from "@/types/student"

interface StudentFormProps {
  studentId?: string
  isEdit?: boolean
}

export function StudentForm({ studentId, isEdit = false }: StudentFormProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const { currentStudent, isLoading } = useSelector((state: RootState) => state.students)
  const { programs } = useSelector((state: RootState) => state.programs)

  const [formData, setFormData] = useState<CreateStudentProfileDto | UpdateStudentProfileDto>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    programId: "",
    enrollmentDate: new Date(),
    currentLevel: 1,
  })

  useEffect(() => {
    dispatch(fetchPrograms())

    if (isEdit && studentId) {
      dispatch(fetchStudentById(studentId))
    }
  }, [dispatch, isEdit, studentId])

  useEffect(() => {
    if (isEdit && currentStudent) {
      setFormData({
        firstName: currentStudent.user?.firstName || "",
        lastName: currentStudent.user?.lastName || "",
        email: currentStudent.user?.email || "",
        programId: currentStudent.programId,
        enrollmentDate: new Date(currentStudent.enrollmentDate),
        currentLevel: currentStudent.currentLevel,
        dateOfBirth: currentStudent.dateOfBirth ? new Date(currentStudent.dateOfBirth) : undefined,
        gender: currentStudent.gender,
        address: currentStudent.address,
        phoneNumber: currentStudent.phoneNumber,
        status: currentStudent.status,
      })
    }
  }, [isEdit, currentStudent])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && studentId) {
        // Remove fields that shouldn't be in the update DTO
        const { firstName, lastName, email, password, enrollmentDate, ...updateData } = formData as any

        await dispatch(updateStudent({ id: studentId, data: updateData as UpdateStudentProfileDto })).unwrap()
        toast({
          title: "Success",
          description: "Student updated successfully",
        })
      } else {
        await dispatch(createStudent(formData as CreateStudentProfileDto)).unwrap()
        toast({
          title: "Success",
          description: "Student created successfully",
        })
      }

      router.push("/students")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save student",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Student" : "Add New Student"}</CardTitle>
          <CardDescription>
            {isEdit ? "Update student information" : "Create a new student account and profile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
              id="firstName"
              value={isEdit ? currentStudent?.user?.firstName || "" : (formData as CreateStudentProfileDto).firstName || ""}
              onChange={(e) => !isEdit && handleChange("firstName", e.target.value)}
              disabled={isEdit}
              required={!isEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={isEdit ? currentStudent?.user?.lastName || "" : (formData as CreateStudentProfileDto).lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={isEdit}
                required={!isEdit}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={isEdit ? currentStudent?.user?.email || "" : (formData as CreateStudentProfileDto).email || ""}
              onChange={(e) => !isEdit && handleChange("email", e.target.value)}
              disabled={isEdit}
              required={!isEdit}
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={(formData as CreateStudentProfileDto).password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID (Optional)</Label>
              <Input
                id="studentId"
                value={(formData as CreateStudentProfileDto).studentId || ""}
                onChange={(e) => handleChange("studentId", e.target.value)}
                disabled={isEdit}
                placeholder="Auto-generated if left blank"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programId">Program</Label>
              <Select value={formData.programId} onValueChange={(value) => handleChange("programId", value)} required>
                <SelectTrigger id="programId">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Enrollment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !(formData as CreateStudentProfileDto).enrollmentDate && "text-muted-foreground",
                    )}
                    disabled={isEdit}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {isEdit ? (
                      currentStudent?.enrollmentDate ? (
                        format(new Date(currentStudent.enrollmentDate), "PPP")
                      ) : (
                        <span>No date set</span>
                      )
                    ) : (
                      (formData as CreateStudentProfileDto).enrollmentDate ? (
                        format(new Date((formData as CreateStudentProfileDto).enrollmentDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={'enrollmentDate' in formData && formData.enrollmentDate ? new Date(formData.enrollmentDate) : undefined}
                    onSelect={(date) => handleChange("enrollmentDate", date)}
                    disabled={isEdit}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentLevel">Current Level</Label>
              <Select
                value={formData.currentLevel?.toString()}
                onValueChange={(value) => handleChange("currentLevel", Number.parseInt(value))}
              >
                <SelectTrigger id="currentLevel">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                    onSelect={(date) => handleChange("dateOfBirth", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || ""} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_specified">Not specified</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
            />
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={(formData as UpdateStudentProfileDto).status || "active"} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/students")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Student" : "Create Student"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
