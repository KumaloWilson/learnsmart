"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCourses } from "@/hooks/use-courses"
import { usePrograms } from "@/hooks/use-programs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Course, CreateCourseDto, UpdateCourseDto } from "@/types/course"

interface CourseFormProps {
  course?: Course
  isEdit?: boolean
}

export function CourseForm({ course, isEdit = false }: CourseFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addCourse, editCourse, error, isLoading } = useCourses()
  const { programs, loadPrograms } = usePrograms()

  const [formData, setFormData] = useState<CreateCourseDto | UpdateCourseDto>({
    name: "",
    description: "",
    code: "",
    level: "",
    creditHours: 0,
    programId: "",
  })

  useEffect(() => {
    loadPrograms()

    if (isEdit && course) {
      setFormData({
        name: course.name,
        description: course.description,
        code: course.code,
        level: course.level,
        creditHours: course.creditHours,
        programId: course.programId,
      })
    } else {
      // Check if programId is provided in URL for pre-selection
      const programId = searchParams.get("programId")
      if (programId) {
        setFormData((prev) => ({ ...prev, programId }))
      }
    }
  }, [isEdit, course, loadPrograms, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && course) {
        await editCourse(course.id, formData)
        router.push(`/courses/${course.id}`)
      } else {
        const newCourse = await addCourse(formData as CreateCourseDto)
        router.push(`/courses/${newCourse.id}`)
      }
    } catch (err) {
      console.error("Error saving course:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Course" : "Create Course"}</CardTitle>
        <CardDescription>{isEdit ? "Update course information" : "Add a new course to the system"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Introduction to Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="CS101"
              required
              maxLength={20}
            />
            <p className="text-sm text-muted-foreground">A unique code for the course (max 20 characters)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Course Level</Label>
              <Input
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                placeholder="1.1"
                required
              />
              <p className="text-sm text-muted-foreground">e.g., 1.1, 2.2, 3.1</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditHours">Credit Hours</Label>
              <Input
                id="creditHours"
                name="creditHours"
                type="number"
                min={1}
                max={100}
                value={formData.creditHours}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Program</Label>
            <Select
              name="programId"
              value={formData.programId}
              onValueChange={(value) => handleSelectChange("programId", value)}
              required
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a description of the course"
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
                ? "Update Course"
                : "Create Course"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
