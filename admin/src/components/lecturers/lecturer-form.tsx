"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLecturers } from "@/hooks/use-lecturers"
import { useDepartments } from "@/hooks/use-departments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Lecturer, CreateLecturerDto, UpdateLecturerDto } from "@/types/lecturer"
import { LECTURER_TITLES, LECTURER_STATUSES } from "@/types/lecturer"

interface LecturerFormProps {
  lecturer?: Lecturer
  isEdit?: boolean
}

export function LecturerForm({ lecturer, isEdit = false }: LecturerFormProps) {
  const router = useRouter()
  const { addLecturer, editLecturer, error, isLoading } = useLecturers()
  const { departments, loadDepartments } = useDepartments()

  // Separate state for create and update to properly handle field differences
  const [createFormData, setCreateFormData] = useState<CreateLecturerDto>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    specialization: "",
    bio: "",
    officeLocation: "",
    officeHours: "",
    // joinDate: new Date().toISOString().split("T")[0],
    // status removed from creation form
  })

  const [updateFormData, setUpdateFormData] = useState<UpdateLecturerDto>({
    title: "",
    specialization: "",
    bio: "",
    officeLocation: "",
    officeHours: "",
    phoneNumber: "",
    status: "active",
    departmentId: "",
  })

  useEffect(() => {
    loadDepartments()

    if (isEdit && lecturer) {
      setUpdateFormData({
        title: lecturer.title,
        specialization: lecturer.specialization,
        bio: lecturer.bio || "",
        officeLocation: lecturer.officeLocation || "",
        officeHours: lecturer.officeHours || "",
        phoneNumber: lecturer.phoneNumber || "",
        status: lecturer.status,
        departmentId: lecturer.departmentId,
      })
    }
  }, [isEdit, lecturer, loadDepartments])

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUpdateFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateSelectChange = (name: string, value: string) => {
    setCreateFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateSelectChange = (name: string, value: string) => {
    setUpdateFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && lecturer) {
        await editLecturer(lecturer.id, updateFormData)
        router.push(`/lecturers/${lecturer.id}`)
      } else {
        const newLecturer = await addLecturer(createFormData)
        router.push(`/lecturers/${newLecturer.id}`)
      }
    } catch (err) {
      console.error("Error saving lecturer:", err)
    }
  }

  // Use the appropriate form data based on the form mode
  const formData = isEdit ? updateFormData : createFormData
  const handleChange = isEdit ? handleUpdateChange : handleCreateChange
  const handleSelectChange = isEdit ? handleUpdateSelectChange : handleCreateSelectChange

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Lecturer" : "Create Lecturer"}</CardTitle>
        <CardDescription>{isEdit ? "Update lecturer information" : "Add a new lecturer to the system"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select
                name="title"
                value={formData.title}
                onValueChange={(value) => handleSelectChange("title", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a title" />
                </SelectTrigger>
                <SelectContent>
                  {LECTURER_TITLES.map((title) => (
                    <SelectItem key={title.value} value={title.value}>
                      {title.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isEdit && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={createFormData.firstName || ""}
                    onChange={handleChange}
                    placeholder="John"
                    required={!isEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={createFormData.lastName || ""}
                    onChange={handleChange}
                    placeholder="Doe"
                    required={!isEdit}
                  />
                </div>
              </>
            )}
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={createFormData.email || ""}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required={!isEdit}
              />
              <p className="text-sm text-muted-foreground">
                This email will be used to create a user account for the lecturer
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization || ""}
              onChange={handleChange}
              placeholder="Computer Science"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="officeLocation">Office Location</Label>
              <Input
                id="officeLocation"
                name="officeLocation"
                value={formData.officeLocation || ""}
                onChange={handleChange}
                placeholder="Building A, Room 101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeHours">Office Hours</Label>
              <Input
                id="officeHours"
                name="officeHours"
                value={formData.officeHours || ""}
                onChange={handleChange}
                placeholder="Mon-Wed: 10:00-12:00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                name="departmentId"
                value={formData.departmentId || ""}
                onValueChange={(value) => handleSelectChange("departmentId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status field only shown in edit mode */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={updateFormData.status || "active"}
                  onValueChange={(value) => handleUpdateSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {LECTURER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={createFormData.joinDate || ""}
                  onChange={handleChange}
                />
              </div>
            )} */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="Brief biography and professional background"
              rows={4}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading.create || isLoading.update}>
            {isLoading.create || isLoading.update
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Lecturer"
                : "Create Lecturer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}