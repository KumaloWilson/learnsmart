"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

export function PerformanceFilters() {
  const [courseId, setCourseId] = useState("")
  const [semesterId, setSemesterId] = useState("")
  const [assessmentType, setAssessmentType] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleReset = () => {
    setCourseId("")
    setSemesterId("")
    setAssessmentType("")
  }

  // Mock data for filters
  const courses = [
    { id: "course1", name: "Introduction to Computer Science" },
    { id: "course2", name: "Data Structures and Algorithms" },
    { id: "course3", name: "Database Systems" },
    { id: "course4", name: "Web Development" },
  ]

  const semesters = [
    { id: "sem1", name: "Fall 2023" },
    { id: "sem2", name: "Spring 2024" },
    { id: "sem3", name: "Summer 2024" },
  ]

  const assessmentTypes = [
    { id: "quiz", name: "Quizzes" },
    { id: "assignment", name: "Assignments" },
    { id: "exam", name: "Exams" },
    { id: "project", name: "Projects" },
  ]

  return (
    <div className="mb-6">
      <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="mb-4">
        {showFilters ? (
          <>
            <X className="h-4 w-4 mr-2" />
            Hide Filters
          </>
        ) : (
          <>
            <Filter className="h-4 w-4 mr-2" />
            Show Filters
          </>
        )}
      </Button>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
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
                <Select value={semesterId} onValueChange={setSemesterId}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessmentType">Assessment Type</Label>
                <Select value={assessmentType} onValueChange={setAssessmentType}>
                  <SelectTrigger id="assessmentType">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {assessmentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={handleReset} className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
