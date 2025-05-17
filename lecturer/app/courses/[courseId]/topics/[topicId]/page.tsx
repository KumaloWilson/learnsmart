"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCourseTopic, useUpdateCourseTopic } from "@/lib/auth/hooks"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, X } from "lucide-react"
import type { UpdateTopicPayload } from "@/lib/auth/types"

// Import the Breadcrumb component
import { Breadcrumb } from "@/components/breadcrumb"

export default function TopicDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const topicId = params.topicId as string
  const courseId = params.courseId as string

  const { topic, loading, error, refetch } = useCourseTopic(topicId)
  const { updateTopic, loading: updateLoading, error: updateError } = useUpdateCourseTopic(topicId)

  const [formData, setFormData] = useState<UpdateTopicPayload>({
    title: "",
    description: "",
    orderIndex: 1,
    durationHours: 1,
    learningObjectives: [],
    keywords: [],
    difficulty: "beginner",
    isActive: true,
  })

  const [newKeyword, setNewKeyword] = useState("")
  const [newObjective, setNewObjective] = useState("")
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title,
        description: topic.description,
        orderIndex: topic.orderIndex,
        durationHours: topic.durationHours,
        learningObjectives: [...topic.learningObjectives],
        keywords: [...topic.keywords],
        difficulty: topic.difficulty,
        isActive: topic.isActive,
      })
    }
  }, [topic])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsDirty(true)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    setIsDirty(true)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsDirty(true)
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
    setIsDirty(true)
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords?.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), newKeyword.trim()],
      }))
      setNewKeyword("")
      setIsDirty(true)
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords?.filter((k) => k !== keyword) || [],
    }))
    setIsDirty(true)
  }

  const updateObjective = (index: number, value: string) => {
    if (!formData.learningObjectives) return

    const updatedObjectives = [...formData.learningObjectives]
    updatedObjectives[index] = value
    setFormData((prev) => ({
      ...prev,
      learningObjectives: updatedObjectives,
    }))
    setIsDirty(true)
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData((prev) => ({
        ...prev,
        learningObjectives: [...(prev.learningObjectives || []), newObjective.trim()],
      }))
      setNewObjective("")
      setIsDirty(true)
    }
  }

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives?.filter((_, i) => i !== index) || [],
    }))
    setIsDirty(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty objectives
    const filteredObjectives = formData.learningObjectives?.filter((obj) => obj.trim() !== "") || []

    const success = await updateTopic({
      ...formData,
      learningObjectives: filteredObjectives.length > 0 ? filteredObjectives : undefined,
    })

    if (success) {
      toast({
        title: "Topic updated",
        description: "The course topic has been successfully updated.",
      })
      refetch()
      setIsDirty(false)
    } else {
      toast({
        title: "Error",
        description: "Failed to update the course topic. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <PageContainer title="Topic Details" loading={true}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 col-span-3" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  if (error || !topic) {
    return (
      <PageContainer title="Topic Details">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load course topic. The topic may not exist or you don't have permission to view it.
            </p>
            <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/topics`)} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Topics
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`Edit Topic: ${topic.title}`}
      description="Update the details for this course topic"
      backButton={
        <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${courseId}/topics`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>
      }
    >
      {/* Add the breadcrumb navigation before the main content */}
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: "Course", href: `/courses/${courseId}` },
          { label: "Topics", href: `/courses/${courseId}/topics` },
          { label: topic?.title || "Topic Details" },
        ]}
        className="mb-4"
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Course Topic</h1>
          <p className="text-muted-foreground">Update the details for this course topic</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Topic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="orderIndex" className="text-right">
                  Order
                </Label>
                <Input
                  id="orderIndex"
                  name="orderIndex"
                  type="number"
                  min="1"
                  value={formData.orderIndex}
                  onChange={handleNumberChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="durationHours" className="text-right">
                  Duration (hours)
                </Label>
                <Input
                  id="durationHours"
                  name="durationHours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.durationHours}
                  onChange={handleNumberChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Keywords</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add a keyword"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addKeyword()
                        }
                      }}
                    />
                    <Button type="button" onClick={addKeyword} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords?.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Learning Objectives</Label>
                <div className="col-span-3 space-y-2">
                  {formData.learningObjectives?.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder={`Objective ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => removeObjective(index)}
                        size="sm"
                        variant="outline"
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add new objective"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addObjective()
                        }
                      }}
                    />
                    <Button type="button" onClick={addObjective} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {updateError && (
            <div className="text-destructive text-sm mt-4">Failed to update topic. Please try again.</div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push(`/courses/${courseId}/topics`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading || !isDirty}>
              {updateLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
