"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, BookOpen, FileText, Video } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { markTopicCompleted } from "@/lib/api/student-portal-api"
import { useAuth } from "@/hooks/use-auth"

interface CourseTopicsProps {
  topics: any[]
  isLoading: boolean
}

export function CourseTopics({ topics, isLoading }: CourseTopicsProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [updatingTopic, setUpdatingTopic] = useState<string | null>(null)
  const [localTopics, setLocalTopics] = useState(topics)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!topics || topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Topics Available</CardTitle>
          <CardDescription>There are no topics available for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleMarkCompleted = async (topicId: string) => {
    if (!user?.studentProfileId) return

    setUpdatingTopic(topicId)
    try {
      await markTopicCompleted(user.studentProfileId, topicId)

      // Update local state
      setLocalTopics((prevTopics) =>
        prevTopics.map((topic) => (topic.id === topicId ? { ...topic, completed: true } : topic)),
      )

      toast({
        title: "Topic Completed",
        description: "Your progress has been updated.",
      })
    } catch (error) {
      console.error("Error marking topic as completed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update topic progress. Please try again.",
      })
    } finally {
      setUpdatingTopic(null)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "document":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {localTopics.map((topic) => (
        <Card key={topic.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </div>
              <Badge variant={topic.completed ? "secondary" : "outline"}>
                {topic.completed ? "Completed" : "In Progress"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{topic.progress || 0}%</span>
              </div>
              <Progress value={topic.progress || 0} className="h-2" />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="resources">
                <AccordionTrigger>Resources ({topic.resources?.length || 0})</AccordionTrigger>
                <AccordionContent>
                  {topic.resources && topic.resources.length > 0 ? (
                    <ul className="space-y-2">
                      {topic.resources.map((resource: any) => (
                        <li key={resource.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <span>{resource.title}</span>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No resources available for this topic.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {!topic.completed && (
              <Button
                className="mt-4 w-full"
                onClick={() => handleMarkCompleted(topic.id)}
                disabled={updatingTopic === topic.id}
              >
                {updatingTopic === topic.id ? (
                  <>Loading...</>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
