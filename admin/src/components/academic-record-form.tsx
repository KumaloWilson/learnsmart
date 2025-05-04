"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { createAcademicRecord } from "@/store/slices/students-slice"
import { fetchSemesters } from "@/store/slices/semesters-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AcademicRecordFormProps {
  studentId: string
  onSuccess?: () => void
}

export function AcademicRecordForm({ studentId, onSuccess }: AcademicRecordFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const { semesters } = useSelector((state: RootState) => state.semesters)
  const { academicRecords, isLoading } = useSelector((state: RootState) => state.students)

  const [formData, setFormData] = useState({
    semesterId: "",
    gpa: 0,
    cgpa: 0,
    totalCredits: 0,
    earnedCredits: 0,
    remarks: "",
  })

  useEffect(() => {
    dispatch(fetchSemesters())
  }, [dispatch])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.semesterId) {
      toast({
        title: "Error",
        description: "Please select a semester",
        variant: "destructive",
      })
      return
    }

    // Check if record already exists for this semester
    const existingRecord = academicRecords.find((record) => record.semesterId === formData.semesterId)

    if (existingRecord) {
      toast({
        title: "Error",
        description: "An academic record already exists for this semester",
        variant: "destructive",
      })
      return
    }

    try {
      await dispatch(
        createAcademicRecord({
          studentProfileId: studentId,
          semesterId: formData.semesterId,
          gpa: formData.gpa,
          cgpa: formData.cgpa,
          totalCredits: formData.totalCredits,
          earnedCredits: formData.earnedCredits,
          remarks: formData.remarks,
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "Academic record created successfully",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create academic record",
        variant: "destructive",
      })
    }
  }

  // Filter out semesters that already have records
  const availableSemesters = semesters.filter(
    (semester) => !academicRecords.some((record) => record.semesterId === semester.id),
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="semesterId">Semester</Label>
        <Select value={formData.semesterId} onValueChange={(value) => handleChange("semesterId", value)}>
          <SelectTrigger id="semesterId">
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent>
            {availableSemesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gpa">GPA (0-4)</Label>
          <Input
            id="gpa"
            type="number"
            min={0}
            max={4}
            step={0.01}
            value={formData.gpa}
            onChange={(e) => handleChange("gpa", Number.parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cgpa">CGPA (0-4)</Label>
          <Input
            id="cgpa"
            type="number"
            min={0}
            max={4}
            step={0.01}
            value={formData.cgpa}
            onChange={(e) => handleChange("cgpa", Number.parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalCredits">Total Credits</Label>
          <Input
            id="totalCredits"
            type="number"
            min={0}
            value={formData.totalCredits}
            onChange={(e) => handleChange("totalCredits", Number.parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="earnedCredits">Earned Credits</Label>
          <Input
            id="earnedCredits"
            type="number"
            min={0}
            value={formData.earnedCredits}
            onChange={(e) => handleChange("earnedCredits", Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Record
        </Button>
      </div>
    </form>
  )
}
