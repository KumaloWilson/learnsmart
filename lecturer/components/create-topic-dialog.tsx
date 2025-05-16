"use client"

import type React from "react"

import { useState } from "react"
import { useCreateCourseTopic } from "@/lib/auth/hooks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CreateTopicPayload } from "@/lib/auth/types"

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  semesterId: string
  onSuccess?: () => void
}

export function CreateTopicDialog({ open, onOpenChange, courseId, semesterId, onSuccess }: CreateTopicDialogProps) {
  const [formData, setFormData] = useState<Omit<CreateTopicPayload, "courseId" | "semesterId">>({
    title: "",
    description: "",
    orderIndex: 1,
    durationHours: 1,
    learningObjectives: [""],
    keywords: [],
    difficulty: "beginner",
    isActive: true,
  })
  const [newKeyword, setNewKeyword] = useState("")
  const [newObjective, setNewObjective] = useState("")

  const { createTopic, loading, error } = useCreateCourseTopic()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const updateObjective = (index: number, value: string) => {
    const updatedObjectives = [...formData.learningObjectives]
    updatedObjectives[index] = value
    setFormData((prev) => ({
      ...prev,
      learningObjectives: updatedObjectives,
    }))
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData((prev) => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, newObjective.trim()],
      }))
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty objectives
    const filteredObjectives = formData.learningObjectives.filter((obj) => obj.trim() !== "")

    const success = await createTopic({
      ...formData,
      learningObjectives: filteredObjectives.length > 0 ? filteredObjectives : ["To be defined"],
      courseId,
      semesterId,
    })

    if (success && onSuccess) {
      onSuccess()
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      orderIndex: 1,
      durationHours: 1,
      learningObjectives: [""],
      keywords: [],
      difficulty: "beginner",
      isActive: true,
    })
    setNewKeyword("")
    setNewObjective("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course Topic</DialogTitle>
          <DialogDescription>Add a new topic to your course. Fill in the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                  />
                  <Button type="button" onClick={addKeyword} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords.map((keyword, index) => (
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
                {formData.learningObjectives.map((objective, index) => (
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
                  />
                  <Button type="button" onClick={addObjective} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {error && <div className="text-destructive text-sm mb-4">Failed to create topic. Please try again.</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
