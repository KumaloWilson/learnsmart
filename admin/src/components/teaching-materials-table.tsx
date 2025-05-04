"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/store"
import { TeachingMaterial } from "@/types/lecturer"

interface TeachingMaterialsTableProps {
  lecturerId: string
}

export function TeachingMaterialsTable({ lecturerId }: TeachingMaterialsTableProps) {
  const { teachingMaterials, loading } = useAppSelector((state) => state.lecturers)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "lecture_note":
        return "bg-blue-100 text-blue-800"
      case "assignment":
        return "bg-purple-100 text-purple-800"
      case "resource":
        return "bg-green-100 text-green-800"
      case "syllabus":
        return "bg-yellow-100 text-yellow-800"
      case "video":
        return "bg-red-100 text-red-800"
      case "youtube":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teaching Materials</CardTitle>
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
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : teachingMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No teaching materials found
                  </TableCell>
                </TableRow>
              ) : (
                teachingMaterials.map((material: TeachingMaterial) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{material.description || "No description"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(material.type)}>{material.type.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>{material.course?.title}</TableCell>
                    <TableCell>{material.semester?.name}</TableCell>
                    <TableCell>
                      <Badge variant={material.isPublished ? "default" : "outline"}>
                        {material.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(material.createdAt)}</TableCell>
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
