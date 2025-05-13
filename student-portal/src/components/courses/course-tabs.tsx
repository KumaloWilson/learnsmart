"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseMaterials } from "@/components/courses/course-materials"
import { CourseAssessments } from "@/components/courses/course-assessments"
import { CourseQuizzes } from "@/components/courses/course-quizzes"
import { CourseVirtualClasses } from "@/components/courses/course-virtual-classes"
import { CourseTopics } from "@/components/courses/course-topics"
import { CourseDiscussions } from "@/components/courses/course-discussions"
import { useToast } from "@/components/ui/use-toast"
import {
  getCourseMaterials,
  getCourseAssessments,
  getCourseQuizzes,
  getCourseVirtualClasses,
  getCourseTopics,
} from "@/lib/api/courses-api"

interface CourseTabsProps {
  courseId: string
}

export function CourseTabs({ courseId }: CourseTabsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("materials")
  const [materials, setMaterials] = useState([])
  const [assessments, setAssessments] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [virtualClasses, setVirtualClasses] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState({
    materials: true,
    assessments: true,
    quizzes: true,
    virtualClasses: true,
    topics: true,
  })

  // For demo purposes, we're using a fixed semesterId
  // In a real application, this would come from the course details or user selection
  const semesterId = "current-semester-id"

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "materials" && loading.materials) {
          const data = await getCourseMaterials(courseId, semesterId)
          setMaterials(data)
          setLoading((prev) => ({ ...prev, materials: false }))
        } else if (activeTab === "assessments" && loading.assessments) {
          const data = await getCourseAssessments(courseId, semesterId)
          setAssessments(data)
          setLoading((prev) => ({ ...prev, assessments: false }))
        } else if (activeTab === "quizzes" && loading.quizzes) {
          const data = await getCourseQuizzes(courseId, semesterId)
          setQuizzes(data)
          setLoading((prev) => ({ ...prev, quizzes: false }))
        } else if (activeTab === "virtual-classes" && loading.virtualClasses) {
          const data = await getCourseVirtualClasses(courseId, semesterId)
          setVirtualClasses(data)
          setLoading((prev) => ({ ...prev, virtualClasses: false }))
        } else if (activeTab === "topics" && loading.topics) {
          const data = await getCourseTopics(courseId, semesterId)
          setTopics(data)
          setLoading((prev) => ({ ...prev, topics: false }))
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load ${activeTab}. Please try again.`,
        })
      }
    }

    fetchData()
  }, [activeTab, courseId, loading, toast])

  return (
    <Tabs defaultValue="materials" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="assessments">Assessments</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        <TabsTrigger value="virtual-classes">Virtual Classes</TabsTrigger>
        <TabsTrigger value="topics">Topics</TabsTrigger>
        <TabsTrigger value="discussions">Discussions</TabsTrigger>
      </TabsList>
      <TabsContent value="materials">
        <CourseMaterials materials={materials} isLoading={loading.materials} />
      </TabsContent>
      <TabsContent value="assessments">
        <CourseAssessments assessments={assessments} isLoading={loading.assessments} />
      </TabsContent>
      <TabsContent value="quizzes">
        <CourseQuizzes quizzes={quizzes} isLoading={loading.quizzes} />
      </TabsContent>
      <TabsContent value="virtual-classes">
        <CourseVirtualClasses virtualClasses={virtualClasses} isLoading={loading.virtualClasses} />
      </TabsContent>
      <TabsContent value="topics">
        <CourseTopics topics={topics} isLoading={loading.topics} />
      </TabsContent>
      <TabsContent value="discussions">
        <CourseDiscussions courseId={courseId} />
      </TabsContent>
    </Tabs>
  )
}
