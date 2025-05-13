"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePeriods } from "@/hooks/use-periods"
import { useSemesters } from "@/hooks/use-semesters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Period, CreatePeriodDto, UpdatePeriodDto } from "@/types/period"
import { DAYS_OF_WEEK } from "@/types/period"

interface PeriodFormProps {
  period?: Period
  isEdit?: boolean
}

export function PeriodForm({ period, isEdit = false }: PeriodFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addPeriod, editPeriod, error, isLoading } = usePeriods()
  const { semesters, loadSemesters } = useSemesters()

  const [formData, setFormData] = useState<CreatePeriodDto | UpdatePeriodDto>({
    name: "",
    startTime: "08:00",
    endTime: "09:30",
    dayOfWeek: "monday",
    semesterId: "",
  })

  useEffect(() => {
    loadSemesters()

    if (isEdit && period) {
      setFormData({
        name: period.name,
        startTime: period.startTime.substring(0, 5), // Format HH:MM
        endTime: period.endTime.substring(0, 5), // Format HH:MM
        dayOfWeek: period.dayOfWeek,
        semesterId: period.semesterId,
      })
    } else {
      // Check if semesterId is provided in URL for pre-selection
      const semesterId = searchParams.get("semesterId")
      if (semesterId) {
        setFormData((prev) => ({ ...prev, semesterId }))
      }
    }
  }, [isEdit, period, loadSemesters, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && period) {
        await editPeriod(period.id, formData)
        router.push(`/periods/${period.id}`)
      } else {
        const newPeriod = await addPeriod(formData as CreatePeriodDto)
        router.push(`/periods/${newPeriod.id}`)
      }
    } catch (err) {
      console.error("Error saving period:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Period" : "Create Period"}</CardTitle>
        <CardDescription>{isEdit ? "Update period information" : "Add a new period to the system"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Period Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Period 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day of Week</Label>
            <Select
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onValueChange={(value) => handleSelectChange("dayOfWeek", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select
              name="semesterId"
              value={formData.semesterId}
              onValueChange={(value) => handleSelectChange("semesterId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                ? "Update Period"
                : "Create Period"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
