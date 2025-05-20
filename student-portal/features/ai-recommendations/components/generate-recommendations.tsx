"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { generateRecommendations } from "@/features/ai-recommendations/redux/aiRecommendationsSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Lightbulb, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function GenerateRecommendations() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { isGenerating } = useAppSelector((state) => state.aiRecommendations)
  const { toast } = useToast()

  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [count, setCount] = useState<number>(5)
  const [includeCompleted, setIncludeCompleted] = useState<boolean>(false)

  const handleGenerateRecommendations = async () => {
    if (!studentProfile?.id || !accessToken || !selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select a course to generate recommendations",
        variant: "destructive",
      })
      return
    }

    const result = await dispatch(
      generateRecommendations({
        request: {
          studentProfileId: studentProfile.id,
          courseId: selectedCourseId,
          count,
          includeCompleted,
        },
        token: accessToken,
      }),
    )

    if (generateRecommendations.fulfilled.match(result)) {
      toast({
        title: "Recommendations Generated",
        description: `${result.payload.length} new recommendations have been generated`,
      })
    }
  }

  return (
    <Card> 
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Generate New Recommendations
        </CardTitle>
        <CardDescription>Get personalized learning resources based on your performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger id="course">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {studentProfile?.currentEnrollments.map((enrollment) => (
                <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
                  {enrollment.courseName} ({enrollment.courseCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="count">Number of Recommendations</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number.parseInt(e.target.value) || 5)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-completed"
            checked={includeCompleted}
            onCheckedChange={(checked) => setIncludeCompleted(checked as boolean)}
          />
          <Label htmlFor="include-completed">Include resources you've already completed</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateRecommendations} disabled={isGenerating || !selectedCourseId} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Recommendations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
