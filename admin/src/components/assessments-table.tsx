"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/store"
import type { Assessment } from "@/types/lecturer"

interface AssessmentsTableProps {
  lecturerId: string
}

export function AssessmentsTable({ lecturerId }: AssessmentsTableProps) {
  const { assessments, loading } = useAppSelector((state) => state.lecturers)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-blue-100 text-blue-800"
      case "assignment":
        return "bg-purple-100 text-purple-800"
      case "exam":
        return "bg-red-100 text-red-800"
      case "project":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No assessments found
                  </TableCell>
                </TableRow>
              ) : (
                assessments.map((assessment: Assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assessment.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {assessment.description || "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(assessment.type)}>{assessment.type}</Badge>
                    </TableCell>
                    <TableCell>{assessment.course?.title}</TableCell>
                    <TableCell>{assessment.semester?.name}</TableCell>
                    <TableCell>{formatDate(assessment.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant={assessment.isPublished ? "default" : "outline"}>
                        {assessment.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
