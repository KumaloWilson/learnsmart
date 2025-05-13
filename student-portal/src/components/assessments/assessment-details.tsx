"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { submitAssessment, uploadAssessmentFile } from "@/lib/api/assessments-api"
import { Calendar, Clock, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface AssessmentDetailsProps {
  assessment: any
}

export function AssessmentDetails({ assessment }: AssessmentDetailsProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [submissionText, setSubmissionText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.studentProfileId) return

    if (!submissionText && !file) {
      toast({
        variant: "destructive",
        title: "Submission Required",
        description: "Please provide either text or a file for your submission.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      let fileData = null

      if (file) {
        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 95) {
              clearInterval(uploadInterval)
              return 95
            }
            return prev + 5
          })
        }, 100)

        // Upload file
        fileData = await uploadAssessmentFile(file)
        clearInterval(uploadInterval)
        setUploadProgress(100)
      }

      // Submit assessment
      await submitAssessment({
        assessmentId: assessment.id,
        studentProfileId: user.studentProfileId,
        submissionText: submissionText || undefined,
        fileUrl: fileData?.url,
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
      })

      toast({
        title: "Assessment Submitted",
        description: "Your assessment has been submitted successfully.",
      })

      // Reset form
      setSubmissionText("")
      setFile(null)
      setUploadProgress(0)

      // In a real app, you would redirect or update the UI to show the submission
    } catch (error) {
      console.error("Error submitting assessment:", error)
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOverdue = new Date() > new Date(assessment.dueDate)
  const isDueSoon = !isOverdue && new Date(assessment.dueDate).getTime() - new Date().getTime() < 86400000 // 24 hours

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              <CardDescription>{assessment.course?.name}</CardDescription>
            </div>
            <Badge
              variant={
                assessment.submitted ? "secondary" : isOverdue ? "destructive" : isDueSoon ? "warning" : "outline"
              }
            >
              {assessment.submitted ? "Submitted" : isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Pending"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Points: {assessment.totalPoints}</span>
            </div>
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <h3>Instructions</h3>
            <div dangerouslySetInnerHTML={{ __html: assessment.instructions }} />
          </div>

          {assessment.resources && assessment.resources.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Resources</h3>
              <ul className="space-y-2">
                {assessment.resources.map((resource: any) => (
                  <li key={resource.id} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {assessment.submitted ? (
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-medium">Submission Complete</h3>
              </div>

              {assessment.submission?.submissionText && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Your Answer:</h4>
                  <div className="bg-background p-3 rounded border">{assessment.submission.submissionText}</div>
                </div>
              )}

              {assessment.submission?.fileUrl && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Submitted File:</h4>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={assessment.submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {assessment.submission.fileName || "Download File"}
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground">
                Submitted on {new Date(assessment.submission?.submittedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isOverdue && (
                <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">This assessment is overdue</h4>
                    <p className="text-sm text-muted-foreground">
                      The deadline was {new Date(assessment.dueDate).toLocaleString()}. Late submissions may be subject
                      to penalties.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="submission">Your Answer</Label>
                <Textarea
                  id="submission"
                  placeholder="Type your answer here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Attach File (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input id="file" type="file" onChange={handleFileChange} className="flex-1" />
                  {file && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                      Clear
                    </Button>
                  )}
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {file && uploadProgress < 100 ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-pulse" />
                        Uploading... {uploadProgress}%
                      </>
                    ) : (
                      "Submitting..."
                    )}
                  </>
                ) : (
                  "Submit Assessment"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
