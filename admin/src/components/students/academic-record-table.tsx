"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import type { AcademicRecord } from "@/types/student"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

interface AcademicRecordTableProps {
  studentId: string
}

export default function AcademicRecordTable({ studentId }: AcademicRecordTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { academicRecords, loading, error, getStudentAcademicRecords, deleteAcademicRecord } = useStudents()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecords, setFilteredRecords] = useState<AcademicRecord[]>([])

  useEffect(() => {
    getStudentAcademicRecords(studentId)
  }, [studentId, getStudentAcademicRecords])

  useEffect(() => {
    if (academicRecords) {
      setFilteredRecords(
        academicRecords.filter((record) => record.semester?.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
  }, [academicRecords, searchTerm])

  const handleDelete = async (id: string) => {
    try {
      await deleteAcademicRecord(id)
      toast({
        title: "Academic record deleted",
        description: "Academic record has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete academic record",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Records</CardTitle>
          <CardDescription>Loading academic records...</CardDescription>
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Academic Records</CardTitle>
          <CardDescription>View and manage academic records for this student</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/students/${studentId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Student
          </Button>
          <Button onClick={() => router.push(`/students/${studentId}/academic-records/create`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by semester..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Total Credits</TableHead>
                <TableHead>Earned Credits</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No academic records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.semester?.name}</TableCell>
                    <TableCell>{record.gpa}</TableCell>
                    <TableCell>{record.cgpa}</TableCell>
                    <TableCell>{record.totalCredits}</TableCell>
                    <TableCell>{record.earnedCredits}</TableCell>
                    <TableCell>{format(new Date(record.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/students/${studentId}/academic-records/${record.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/students/${studentId}/academic-records/edit/${record.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
