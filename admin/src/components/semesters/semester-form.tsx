"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSemesters } from "@/hooks/use-semesters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Semester, CreateSemesterDto, UpdateSemesterDto } from "@/types/semester"

interface SemesterFormProps {
  semester?: Semester
  isEdit?: boolean
}

export function SemesterForm({ semester, isEdit = false }: SemesterFormProps) {
  const router = useRouter()
  const { addSemester, editSemester, error, isLoading } = useSemesters()

  const [formData, setFormData] = useState<CreateSemesterDto | UpdateSemesterDto>({
    name: "",
    startDate: "",
    endDate: "",
    isActive: false,
    academicYear: new Date().getFullYear(),
  })

  useEffect(() => {
    if (isEdit && semester) {
      setFormData({
        name: semester.name,
        startDate: new Date(semester.startDate).toISOString().split("T")[0],
        endDate: new Date(semester.endDate).toISOString().split("T")[0],
        isActive: semester.isActive,
        academicYear: semester.academicYear,
      })
    } else {
      // Set default dates for new semester
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(1) // First day of current month
      const endDate = new Date(today)
      endDate.setMonth(endDate.getMonth() + 4) // 4 months later
      endDate.setDate(0) // Last day of that month

      setFormData((prev) => ({
        ...prev,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      }))
    }
  }, [isEdit, semester])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && semester) {
        await editSemester(semester.id, formData)
        router.push(`/semesters/${semester.id}`)
      } else {
        const newSemester = await addSemester(formData as CreateSemesterDto)
        router.push(`/semesters/${newSemester.id}`)
      }
    } catch (err) {
      console.error("Error saving semester:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Semester" : "Create Semester"}</CardTitle>
        <CardDescription>{isEdit ? "Update semester information" : "Add a new semester to the system"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Semester Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Fall 2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                name="academicYear"
                type="number"
                min={2000}
                max={2100}
                value={formData.academicYear}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Active Semester</Label>
            </div>
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
                ? "Update Semester"
                : "Create Semester"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
