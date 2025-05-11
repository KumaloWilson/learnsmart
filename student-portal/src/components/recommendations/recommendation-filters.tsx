"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { getEnrolledCourses } from "@/lib/api/courses-api"
import { Search, RefreshCw } from "lucide-react"

interface RecommendationFiltersProps {
  onFilterChange: (filters: any) => void
  onGenerateNew: () => void
}

export function RecommendationFilters({ onFilterChange, onGenerateNew }: RecommendationFiltersProps) {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [filters, setFilters] = useState({
    search: "",
    courseId: "",
    type: "",
    showCompleted: false,
    showSaved: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.studentProfileId) return

      try {
        const coursesData = await getEnrolledCourses(user.studentProfileId)
        setCourses(coursesData || [])
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }

    fetchCourses()
  }, [user?.studentProfileId])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleGenerateNew = () => {
    setIsLoading(true)
    onGenerateNew()
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search recommendations..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={filters.courseId} onValueChange={(value) => handleFilterChange("courseId", value)}>
              <SelectTrigger id="course">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="extension">Extension</SelectItem>
                <SelectItem value="remedial">Remedial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showCompleted"
                checked={filters.showCompleted}
                onCheckedChange={(checked) => handleFilterChange("showCompleted", !!checked)}
              />
              <Label htmlFor="showCompleted">Show Completed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showSaved"
                checked={filters.showSaved}
                onCheckedChange={(checked) => handleFilterChange("showSaved", !!checked)}
              />
              <Label htmlFor="showSaved">Show Saved</Label>
            </div>
          </div>

          <div className="flex items-end">
            <Button onClick={handleGenerateNew} disabled={isLoading} className="w-full">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Generate New
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
