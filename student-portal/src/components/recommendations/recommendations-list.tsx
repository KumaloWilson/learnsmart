"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getRecommendations, generateRecommendations } from "@/lib/api/student-portal-api"
import { RecommendationCard } from "@/components/recommendations/recommendation-card"
import { RecommendationFilters } from "@/components/recommendations/recommendation-filters"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Lightbulb, Loader2 } from "lucide-react"

export function RecommendationsList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [filteredRecommendations, setFilteredRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    courseId: "",
    type: "",
    showCompleted: false,
    showSaved: true,
  })

  useEffect(() => {
    fetchRecommendations()
  }, [user?.studentProfileId])

  useEffect(() => {
    applyFilters()
  }, [recommendations, filters])

  const fetchRecommendations = async () => {
    if (!user?.studentProfileId) return

    setIsLoading(true)
    try {
      const data = await getRecommendations(user.studentProfileId)
      setRecommendations(data || [])
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recommendations. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateNew = async () => {
    if (!user?.studentProfileId) return

    setIsGenerating(true)
    try {
      const data = await generateRecommendations({
        studentProfileId: user.studentProfileId,
        courseId: filters.courseId || undefined,
        count: 5,
        includeCompleted: false,
      })

      // Add new recommendations to the list
      setRecommendations((prev) => [...data, ...prev])

      toast({
        title: "New Recommendations Generated",
        description: "We've created new personalized recommendations for you.",
      })
    } catch (error) {
      console.error("Error generating recommendations:", error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate new recommendations. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...recommendations]

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (rec) =>
          rec.title.toLowerCase().includes(searchTerm) ||
          rec.description.toLowerCase().includes(searchTerm) ||
          (rec.tags && rec.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))),
      )
    }

    // Filter by course
    if (filters.courseId) {
      filtered = filtered.filter((rec) => rec.courseId === filters.courseId)
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((rec) => rec.type.toLowerCase() === filters.type.toLowerCase())
    }

    // Filter by completion status
    if (!filters.showCompleted) {
      filtered = filtered.filter((rec) => !rec.isCompleted)
    }

    // Filter by saved status
    if (filters.showSaved) {
      filtered = filtered.filter((rec) => rec.isSaved || !rec.isSaved)
    } else {
      filtered = filtered.filter((rec) => !rec.isSaved)
    }

    setFilteredRecommendations(filtered)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleRecommendationUpdate = (id: string, action: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          if (action === "save") {
            return { ...rec, isSaved: true }
          } else if (action === "complete") {
            return { ...rec, isCompleted: true }
          } else if (action === "feedback") {
            return { ...rec, hasRated: true }
          }
        }
        return rec
      }),
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RecommendationFilters onFilterChange={handleFilterChange} onGenerateNew={handleGenerateNew} />

      {isGenerating && (
        <div className="bg-muted p-4 rounded-md flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>Generating new personalized recommendations...</p>
        </div>
      )}

      {filteredRecommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No recommendations found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {recommendations.length === 0
              ? "We don't have any recommendations for you yet."
              : "No recommendations match your current filters."}
          </p>
          {recommendations.length === 0 ? (
            <Button onClick={handleGenerateNew} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Recommendations"}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setFilters({ ...filters, search: "", courseId: "", type: "" })}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onUpdate={handleRecommendationUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
