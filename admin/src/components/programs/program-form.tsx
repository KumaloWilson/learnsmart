"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePrograms } from "@/hooks/use-programs"
import { useDepartments } from "@/hooks/use-departments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Program, CreateProgramDto, UpdateProgramDto } from "@/types/program"
import { PROGRAM_LEVELS } from "@/types/program"

interface ProgramFormProps {
  program?: Program
  isEdit?: boolean
}

export function ProgramForm({ program, isEdit = false }: ProgramFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addProgram, editProgram, error, isLoading } = usePrograms()
  const { departments, loadDepartments } = useDepartments()

  const [formData, setFormData] = useState<CreateProgramDto | UpdateProgramDto>({
    name: "",
    description: "",
    code: "",
    durationYears: 4,
    level: "undergraduate",
    departmentId: "",
  })

  useEffect(() => {
    loadDepartments()

    if (isEdit && program) {
      setFormData({
        name: program.name,
        description: program.description,
        code: program.code,
        durationYears: program.durationYears,
        level: program.level,
        departmentId: program.departmentId,
      })
    } else {
      // Check if departmentId is provided in URL for pre-selection
      const departmentId = searchParams.get("departmentId")
      if (departmentId) {
        setFormData((prev) => ({ ...prev, departmentId }))
      }
    }
  }, [isEdit, program, loadDepartments, searchParams])

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
      if (isEdit && program) {
        await editProgram(program.id, formData)
        router.push(`/programs/${program.id}`)
      } else {
        const newProgram = await addProgram(formData as CreateProgramDto)
        router.push(`/programs/${newProgram.id}`)
      }
    } catch (err) {
      console.error("Error saving program:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Program" : "Create Program"}</CardTitle>
        <CardDescription>{isEdit ? "Update program information" : "Add a new program to the system"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Program Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="BSc (Hons) in Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Program Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="CS"
              required
              maxLength={20}
            />
            <p className="text-sm text-muted-foreground">A unique code for the program (max 20 characters)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Program Level</Label>
              <Select
                name="level"
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationYears">Duration (Years)</Label>
              <Input
                id="durationYears"
                name="durationYears"
                type="number"
                min={1}
                max={10}
                value={formData.durationYears}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              name="departmentId"
              value={formData.departmentId}
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a description of the program"
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
                ? "Update Program"
                : "Create Program"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
