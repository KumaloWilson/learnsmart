"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import { useSemesters } from "@/hooks/use-semesters"
import type { AcademicRecordFormData } from "@/types/student"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  semesterId: z.string().min(1, "Semester is required"),
  gpa: z.coerce.number().min(0).max(4).step(0.01),
  cgpa: z.coerce.number().min(0).max(4).step(0.01),
  totalCredits: z.coerce.number().min(0),
  earnedCredits: z.coerce.number().min(0),
  remarks: z.string().optional(),
})

interface AcademicRecordFormProps {
  studentId: string
  recordId?: string
}

export default function AcademicRecordForm({ studentId, recordId }: AcademicRecordFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    academicRecords,
    currentAcademicRecord,
    getStudentAcademicRecords,
    getAcademicRecordById,
    createAcademicRecord,
    updateAcademicRecord,
  } = useStudents()
  const { semesters, loadSemesters } = useSemesters()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      semesterId: "",
      gpa: 0,
      cgpa: 0,
      totalCredits: 0,
      earnedCredits: 0,
      remarks: "",
    },
  })

  useEffect(() => {
    loadSemesters()

    if (studentId) {
      getStudentAcademicRecords(studentId)
    }

    if (recordId) {
      getAcademicRecordById(recordId)
    }
  }, [studentId, recordId, loadSemesters, getStudentAcademicRecords, getAcademicRecordById])

  useEffect(() => {
    if (recordId && currentAcademicRecord) {
      form.reset({
        semesterId: currentAcademicRecord.semesterId,
        gpa: currentAcademicRecord.gpa,
        cgpa: currentAcademicRecord.cgpa,
        totalCredits: currentAcademicRecord.totalCredits,
        earnedCredits: currentAcademicRecord.earnedCredits,
        remarks: currentAcademicRecord.remarks || "",
      })
    }
  }, [recordId, currentAcademicRecord, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const recordData: AcademicRecordFormData = {
        studentProfileId: studentId,
        semesterId: data.semesterId,
        gpa: data.gpa,
        cgpa: data.cgpa,
        totalCredits: data.totalCredits,
        earnedCredits: data.earnedCredits,
        remarks: data.remarks,
      }

      if (recordId) {
        await updateAcademicRecord(recordId, recordData)
        toast({
          title: "Academic record updated",
          description: "Academic record has been updated successfully",
        })
      } else {
        await createAcademicRecord(recordData)
        toast({
          title: "Academic record created",
          description: "Academic record has been created successfully",
        })
      }

      router.push(`/students/${studentId}/academic-records`)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to save academic record",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{recordId ? "Edit Academic Record" : "Add Academic Record"}</CardTitle>
        <CardDescription>
          {recordId ? "Update academic record information" : "Create a new academic record"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="semesterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!recordId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" max="4" placeholder="Enter GPA" {...field} />
                    </FormControl>
                    <FormDescription>GPA for this semester (0-4 scale)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cgpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGPA</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" max="4" placeholder="Enter CGPA" {...field} />
                    </FormControl>
                    <FormDescription>Cumulative GPA (0-4 scale)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="totalCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Enter total credits" {...field} />
                    </FormControl>
                    <FormDescription>Total credits attempted</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="earnedCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Earned Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Enter earned credits" {...field} />
                    </FormControl>
                    <FormDescription>Credits successfully completed</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any remarks or comments" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/students/${studentId}/academic-records`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : recordId ? "Update Record" : "Create Record"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
