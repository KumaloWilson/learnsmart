"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Recommendation } from "@/features/ai-recommendations/types"

interface RecommendationFiltersProps {
  recommendations: Recommendation[]
  onFilterChange: (filtered: Recommendation[]) => void
}

export function RecommendationFilters({ recommendations, onFilterChange }: RecommendationFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minRelevance, setMinRelevance] = useState(0)
  const [showCompleted, setShowCompleted] = useState(true)
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "difficulty">("relevance")

  // Extract all unique resource types
  const resourceTypes = Array.from(new Set(recommendations.map((rec) => rec.learningResource.type)))

  // Extract all unique tags
  const allTags = recommendations.reduce((tags, rec) => {
    rec.learningResource.tags.forEach((tag) => tags.add(tag))
    return tags
  }, new Set<string>())

  const applyFilters = () => {
    let filtered = [...recommendations]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (rec) =>
          rec.learningResource.title.toLowerCase().includes(term) ||
          rec.learningResource.description.toLowerCase().includes(term) ||
          rec.reason.toLowerCase().includes(term),
      )
    }

    // Filter by resource type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((rec) => selectedTypes.includes(rec.learningResource.type))
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((rec) => rec.learningResource.tags.some((tag) => selectedTags.includes(tag)))
    }

    // Filter by relevance score
    if (minRelevance > 0) {
      filtered = filtered.filter((rec) => rec.relevanceScore >= minRelevance / 100)
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter((rec) => !rec.isCompleted)
    }

    // Sort results
    switch (sortBy) {
      case "relevance":
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore)
        break
      case "date":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "difficulty":
        filtered.sort((a, b) => a.learningResource.difficulty - b.learningResource.difficulty)
        break
    }

    onFilterChange(filtered)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedTags([])
    setMinRelevance(0)
    setShowCompleted(true)
    setSortBy("relevance")
    onFilterChange(recommendations)
  }

  // Apply filters whenever any filter changes
  const handleFilterChange = () => {
    applyFilters()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by title, description..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleFilterChange()
              }}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => {
                  setSearchTerm("")
                  handleFilterChange()
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Resource Type</Label>
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => {
                  setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
                  handleFilterChange()
                }}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {Array.from(allTags).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                  handleFilterChange()
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Minimum Relevance</Label>
            <span className="text-sm">{minRelevance}%</span>
          </div>
          <Slider
            value={[minRelevance]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => {
              setMinRelevance(value[0])
              handleFilterChange()
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={(checked) => {
              setShowCompleted(checked as boolean)
              handleFilterChange()
            }}
          />
          <Label htmlFor="show-completed">Show completed resources</Label>
        </div>

        <div className="space-y-2">
          <Label>Sort By</Label>
          <RadioGroup
            value={sortBy}
            onValueChange={(value: "relevance" | "date" | "difficulty") => {
              setSortBy(value)
              handleFilterChange()
            }}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relevance" id="sort-relevance" />
              <Label htmlFor="sort-relevance">Relevance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="date" id="sort-date" />
              <Label htmlFor="sort-date">Newest First</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="difficulty" id="sort-difficulty" />
              <Label htmlFor="sort-difficulty">Difficulty (Easiest First)</Label>
            </div>
          </RadioGroup>
        </div>

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
