"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchStudents, deleteStudent } from "@/store/slices/students-slice"
import { fetchPrograms } from "@/store/slices/programs-slice"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { StudentFilterDto } from "@/types/student"

export function StudentsTable() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const { students, isLoading, error } = useSelector((state: RootState) => state.students)
  const { programs } = useSelector((state: RootState) => state.programs)

  const [filters, setFilters] = useState<StudentFilterDto>({})
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchStudents())
    dispatch(fetchPrograms())
  }, [dispatch])

  const handleFilterChange = (key: keyof StudentFilterDto, value: any) => {
    if (value === "all" || value === null) {
      const newFilters = { ...filters }
      delete newFilters[key]
      setFilters(newFilters)
    } else {
      setFilters({ ...filters, [key]: value })
    }
  }

  const applyFilters = () => {
    dispatch(fetchStudents(filters))
  }

  const resetFilters = () => {
    setFilters({})
    setSearchTerm("")
    dispatch(fetchStudents())
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        await dispatch(deleteStudent(id)).unwrap()
        toast({
          title: "Success",
          description: "Student deleted successfully",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete student",
          variant: "destructive",
        })
      }
    }
  }

  const filteredStudents = searchTerm
    ? students.filter(
        (student) =>
          student.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : students

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
        <Button onClick={() => router.push("/students/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <Select 
            value={filters.programId || "all"} 
            onValueChange={(value) => handleFilterChange("programId", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto">
          <Select 
            value={filters.status || "all"} 
            onValueChange={(value) => handleFilterChange("status", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto">
          <Select
            value={filters.currentLevel?.toString() || "all"}
            onValueChange={(value) => handleFilterChange("currentLevel", value === "all" ? null : Number.parseInt(value))}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    {student.user?.firstName} {student.user?.lastName}
                  </TableCell>
                  <TableCell>{student.user?.email}</TableCell>
                  <TableCell>{student.program?.name}</TableCell>
                  <TableCell>{student.currentLevel}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(student.status)}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/students/${student.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/students/${student.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(student.id)}>
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
    </div>
  )
}