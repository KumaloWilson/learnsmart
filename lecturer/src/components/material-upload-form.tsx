"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { lecturerService } from "@/lib/api-services"


export function MaterialUploadForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    semesterId: "",
    topic: "",
    isPublic: true,
    file: null as File | null,
  })
  const [courses, setCourses] = useState([
    { id: "101", name: "CS101: Programming Fundamentals" },
    { id: "202", name: "CS202: Data Structures" },
    { id: "303", name: "CS303: Artificial Intelligence" },
  ])
  const [semesters, setSemesters] = useState([
    { id: "S2025", name: "Spring 2025" },
    { id: "F2025", name: "Fall 2025" },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      if (!formData.file) {
        throw new Error("Please select a file to upload")
      }

      const lecturerProfile = await lecturerService.getLecturerProfile(user.id)

      // Create form data for file upload
      const uploadFormData = new FormData()
      uploadFormData.append("file", formData.file)
      uploadFormData.append("title", formData.title)
      uploadFormData.append("description", formData.description)
      uploadFormData.append("courseId", formData.courseId)
      uploadFormData.append("semesterId", formData.semesterId)
      uploadFormData.append("topic", formData.topic)
      uploadFormData.append("isPublic", formData.isPublic.toString())
      uploadFormData.append("lecturerProfileId", lecturerProfile.id)

      // Determine if it's a video or other material
      const isVideo = formData.file.type.startsWith("video/")

      let response
      if (isVideo) {
        response = await lecturerService.uploadVideo(uploadFormData)
      } else {
        // For other file types
        response = await lecturerService.createTeachingMaterial({
          title: formData.title,
          description: formData.description,
          courseId: formData.courseId,
          semesterId: formData.semesterId,
          topic: formData.topic,
          isPublic: formData.isPublic,
          lecturerProfileId: lecturerProfile.id,
          file: formData.file,
        })
      }

      toast({
        title: "Success",
        description: "Material uploaded successfully",
      })

      router.push("/materials")
    } catch (error) {
      console.error("Failed to upload material:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload material",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Upload Teaching Material</CardTitle>
          <CardDescription>Add a new resource for your students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter material title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the material"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={formData.courseId} onValueChange={(value) => handleSelectChange("courseId", value)}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semesterId} onValueChange={(value) => handleSelectChange("semesterId", value)}>
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Select semester" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="Enter topic or module"
              value={formData.topic}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input id="file" type="file" onChange={handleFileChange} required />
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, PPTX, MP4, ZIP (max 100MB)</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="isPublic">Make this material public to all students</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Uploading..." : "Upload Material"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
