"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSchools } from "@/hooks/use-schools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { School, CreateSchoolDto, UpdateSchoolDto } from "@/types/school"

interface SchoolFormProps {
  school?: School
  isEdit?: boolean
}

export function SchoolForm({ school, isEdit = false }: SchoolFormProps) {
  const router = useRouter()
  const { addSchool, editSchool, error, isLoading } = useSchools()

  const [formData, setFormData] = useState<CreateSchoolDto | UpdateSchoolDto>({
    name: "",
    description: "",
    code: "",
  })

  useEffect(() => {
    if (isEdit && school) {
      setFormData({
        name: school.name,
        description: school.description,
        code: school.code,
      })
    }
  }, [isEdit, school])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && school) {
        await editSchool(school.id, formData)
        router.push(`/school/${school.id}`)
      } else {
        const newSchool = await addSchool(formData as CreateSchoolDto)
        router.push(`/school/${newSchool.id}`)
      }
    } catch (err) {
      console.error("Error saving school:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit School" : "Create School"}</CardTitle>
        <CardDescription>{isEdit ? "Update school information" : "Add a new school to the system"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="School of Engineering"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">School Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="ENG"
              required
              maxLength={20}
            />
            <p className="text-sm text-muted-foreground">A unique code for the school (max 20 characters)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a description of the school"
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
                ? "Update School"
                : "Create School"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
