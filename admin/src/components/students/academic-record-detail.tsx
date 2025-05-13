"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useStudents } from "@/hooks/use-students"
import { format } from "date-fns"
import { Edit, ArrowLeft } from "lucide-react"

interface AcademicRecordDetailProps {
  studentId: string
  recordId: string
}

export default function AcademicRecordDetail({ studentId, recordId }: AcademicRecordDetailProps) {
  const router = useRouter()
  const { currentAcademicRecord, loading, error, getAcademicRecordById } = useStudents()

  useEffect(() => {
    getAcademicRecordById(recordId)
  }, [recordId, getAcademicRecordById])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Record Details</CardTitle>
          <CardDescription>Loading academic record information...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!currentAcademicRecord) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Record Not Found</CardTitle>
          <CardDescription>The requested academic record could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push(`/students/${studentId}/academic-records`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Academic Records
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Academic Record Details</CardTitle>
          <CardDescription>Semester: {currentAcademicRecord.semester?.name}</CardDescription>
        </div>
        <Button size="sm" onClick={() => router.push(`/students/${studentId}/academic-records/edit/${recordId}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Student Information</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Student Name</dt>
              <dd>
                {currentAcademicRecord.studentProfile?.user?.firstName}{" "}
                {currentAcademicRecord.studentProfile?.user?.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Student ID</dt>
              <dd>{currentAcademicRecord.studentProfile?.studentId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Program</dt>
              <dd>{currentAcademicRecord.studentProfile?.program?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Current Level</dt>
              <dd>{currentAcademicRecord.studentProfile?.currentLevel}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium">Academic Performance</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">GPA</dt>
              <dd>{currentAcademicRecord.gpa}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">CGPA</dt>
              <dd>{currentAcademicRecord.cgpa}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Credits</dt>
              <dd>{currentAcademicRecord.totalCredits}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Earned Credits</dt>
              <dd>{currentAcademicRecord.earnedCredits}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Remarks</dt>
              <dd>{currentAcademicRecord.remarks || "No remarks provided"}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium">Record Information</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created Date</dt>
              <dd>{format(new Date(currentAcademicRecord.createdAt), "MMMM d, yyyy")}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd>{format(new Date(currentAcademicRecord.updatedAt), "MMMM d, yyyy")}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push(`/students/${studentId}/academic-records`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Academic Records
        </Button>
      </CardFooter>
    </Card>
  )
}
