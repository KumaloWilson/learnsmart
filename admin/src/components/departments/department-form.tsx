"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDepartments } from "@/hooks/use-departments"
import { useSchools } from "@/hooks/use-schools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/department"

interface DepartmentFormProps {
  department?: Department
  isEdit?: boolean
}

export function DepartmentForm({ department, isEdit = false }: DepartmentFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addDepartment, editDepartment, error, isLoading } = useDepartments()
  const { schools, loadSchools } = useSchools()

  const [formData, setFormData] = useState<CreateDepartmentDto | UpdateDepartmentDto>({
    name: "",
    description: "",
    code: "",
    schoolId: "",
  })

  useEffect(() => {
    loadSchools()

    if (isEdit && department) {
      setFormData({
        name: department.name,
        description: department.description,
        code: department.code,
        schoolId: department.schoolId,
      })
    } else {
      // Check if schoolId is provided in URL for pre-selection
      const schoolId = searchParams.get("schoolId")
      if (schoolId) {
        setFormData((prev) => ({ ...prev, schoolId }))
      }
    }
  }, [isEdit, department, loadSchools, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSchoolChange = (value: string) => {
    setFormData((prev) => ({ ...prev, schoolId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && department) {
        await editDepartment(department.id, formData)
        router.push(`/departments/${department.id}`)
      } else {
        const newDepartment = await addDepartment(formData as CreateDepartmentDto)
        router.push(`/departments/${newDepartment.id}`)
      }
    } catch (err) {
      console.error("Error saving department:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Department" : "Create Department"}</CardTitle>
        <CardDescription>
          {isEdit ? "Update department information" : "Add a new department to the system"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Department of Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Department Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="CS"
              required
              maxLength={20}
            />
            <p className="text-sm text-muted-foreground">A unique code for the department (max 20 characters)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Select value={formData.schoolId} onValueChange={handleSchoolChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a description of the department"
              rows={4}
              required
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
                ? "Update Department"
                : "Create Department"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
