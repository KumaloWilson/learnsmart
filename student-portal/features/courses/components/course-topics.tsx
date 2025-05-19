import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, BookOpen, Tag } from "lucide-react"
import type { CourseTopic } from "@/features/courses/types"

interface CourseTopicsProps {
  topics: CourseTopic[]
}

export function CourseTopics({ topics }: CourseTopicsProps) {
  if (!topics.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>No topics available for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Sort topics by orderIndex
  const sortedTopics = [...topics].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Topics</CardTitle>
        <CardDescription>Topics and learning objectives for this course</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {sortedTopics.map((topic, index) => (
            <AccordionItem key={topic.id} value={topic.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center text-left">
                  <span className="font-medium">
                    {index + 1}. {topic.title}
                  </span>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {topic.difficulty}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">{topic.description}</p>

                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Duration: {topic.durationHours} hours</span>
                </div>

                {topic.learningObjectives.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      Learning Objectives
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                      {topic.learningObjectives.map((objective, i) => (
                        <li key={i}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.keywords.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                      Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {topic.keywords.map((keyword, i) => (
                        <Badge key={i} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
