"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { updateLearningRecommendation } from "@/lib/redux/slices/studentSlice"
import { useUpdateRecommendationMutation } from "@/lib/api/student"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Video, Bookmark, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function RecommendationsPage() {
  const { profile } = useAppSelector((state) => state.student)
  const dispatch = useAppDispatch()
  const [updateRecommendation] = useUpdateRecommendationMutation()
  const [searchTerm, setSearchTerm] = useState("")

  if (!profile) return null

  const { learningRecommendations } = profile

  const filteredRecommendations = learningRecommendations.filter(
    (rec) =>
      rec.resourceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.resourceType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleMarkAsViewed = async (id: string) => {
    try {
      dispatch(
        updateLearningRecommendation({
          id,
          updates: { isViewed: true },
        }),
      )

      await updateRecommendation({
        id,
        updates: { isViewed: true },
      }).unwrap()
    } catch (error) {
      console.error("Failed to update recommendation:", error)
    }
  }

  const handleToggleSaved = async (id: string, currentStatus: boolean) => {
    try {
      dispatch(
        updateLearningRecommendation({
          id,
          updates: { isSaved: !currentStatus },
        }),
      )

      await updateRecommendation({
        id,
        updates: { isSaved: !currentStatus },
      }).unwrap()
    } catch (error) {
      console.error("Failed to update recommendation:", error)
    }
  }

  const handleMarkAsCompleted = async (id: string) => {
    try {
      dispatch(
        updateLearningRecommendation({
          id,
          updates: {
            isCompleted: true,
            completedAt: new Date().toISOString(),
          },
        }),
      )

      await updateRecommendation({
        id,
        updates: {
          isCompleted: true,
          completedAt: new Date().toISOString(),
        },
      }).unwrap()
    } catch (error) {
      console.error("Failed to update recommendation:", error)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-600" />
      case "article":
        return <FileText className="h-5 w-5 text-purple-600" />
      case "quiz":
        return <BookOpen className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Learning Recommendations</h1>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search recommendations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((recommendation) => (
                  <Card key={recommendation.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-md bg-blue-50">{getResourceIcon(recommendation.resourceType)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{recommendation.resourceTitle}</h3>
                              <p className="text-sm text-muted-foreground">{recommendation.courseName}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {Math.round(recommendation.relevanceScore * 100)}% match
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <Badge variant="outline">
                              {recommendation.resourceType.charAt(0).toUpperCase() +
                                recommendation.resourceType.slice(1)}
                            </Badge>
                            {recommendation.isViewed && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Viewed
                              </Badge>
                            )}
                            {recommendation.isCompleted && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <Button
                              onClick={() => {
                                window.open(recommendation.resourceUrl, "_blank")
                                if (!recommendation.isViewed) {
                                  handleMarkAsViewed(recommendation.id)
                                }
                              }}
                            >
                              View Resource
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleToggleSaved(recommendation.id, recommendation.isSaved)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${recommendation.isSaved ? "fill-yellow-500 text-yellow-500" : ""}`}
                              />
                            </Button>

                            {!recommendation.isCompleted && (
                              <Button variant="outline" onClick={() => handleMarkAsCompleted(recommendation.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No recommendations found matching your search.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {filteredRecommendations.filter((r) => r.isSaved).length > 0 ? (
                filteredRecommendations
                  .filter((r) => r.isSaved)
                  .map((recommendation) => (
                    <Card key={recommendation.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-md bg-blue-50">
                            {getResourceIcon(recommendation.resourceType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{recommendation.resourceTitle}</h3>
                                <p className="text-sm text-muted-foreground">{recommendation.courseName}</p>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {Math.round(recommendation.relevanceScore * 100)}% match
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <Badge variant="outline">
                                {recommendation.resourceType.charAt(0).toUpperCase() +
                                  recommendation.resourceType.slice(1)}
                              </Badge>
                              {recommendation.isViewed && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Viewed
                                </Badge>
                              )}
                              {recommendation.isCompleted && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Completed
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <Button
                                onClick={() => {
                                  window.open(recommendation.resourceUrl, "_blank")
                                  if (!recommendation.isViewed) {
                                    handleMarkAsViewed(recommendation.id)
                                  }
                                }}
                              >
                                View Resource
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleToggleSaved(recommendation.id, recommendation.isSaved)}
                              >
                                <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              </Button>

                              {!recommendation.isCompleted && (
                                <Button variant="outline" onClick={() => handleMarkAsCompleted(recommendation.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Completed
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No saved recommendations found.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredRecommendations.filter((r) => r.isCompleted).length > 0 ? (
                filteredRecommendations
                  .filter((r) => r.isCompleted)
                  .map((recommendation) => (
                    <Card key={recommendation.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-md bg-blue-50">
                            {getResourceIcon(recommendation.resourceType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{recommendation.resourceTitle}</h3>
                                <p className="text-sm text-muted-foreground">{recommendation.courseName}</p>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <Badge variant="outline">
                                {recommendation.resourceType.charAt(0).toUpperCase() +
                                  recommendation.resourceType.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Completed on {new Date(recommendation.completedAt || "").toLocaleDateString()}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  window.open(recommendation.resourceUrl, "_blank")
                                }}
                              >
                                Review Again
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleToggleSaved(recommendation.id, recommendation.isSaved)}
                              >
                                <Bookmark
                                  className={`h-4 w-4 ${recommendation.isSaved ? "fill-yellow-500 text-yellow-500" : ""}`}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed recommendations found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
