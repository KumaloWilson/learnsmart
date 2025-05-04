"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDepartments } from "@/store/slices/departments-slice"
import { useToast } from "@/components/ui/use-toast"
import { deleteLecturer, fetchLecturers } from "@/store/slices/lecturers-slice"
import { LecturerProfile } from "@/types/lecturer"

export function LecturersTable() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { lecturers, loading } = useAppSelector((state) => state.lecturers)
  const { departments } = useAppSelector((state) => state.departments)

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    dispatch(fetchLecturers())
    dispatch(fetchDepartments())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lecturer?")) {
      try {
        await dispatch(deleteLecturer(id)).unwrap()
        toast({
          title: "Success",
          description: "Lecturer deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete lecturer",
          variant: "destructive",
        })
      }
    }
  }

  const filteredLecturers = lecturers.filter((lecturer: LecturerProfile) => {
    const matchesSearch =
      searchTerm === "" ||
      lecturer.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.user?.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "" || lecturer.departmentId === departmentFilter
    const matchesStatus = statusFilter === "" || lecturer.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lecturers</CardTitle>
        <Button onClick={() => router.push("/lecturers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lecturer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search lecturers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredLecturers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No lecturers found
                  </TableCell>
                </TableRow>
              ) : null}
              {filteredLecturers.map((lecturer: LecturerProfile) => (
                <TableRow key={lecturer.id}>
                  <TableCell>{lecturer.staffId}</TableCell>
                  <TableCell>
                    {lecturer.title} {lecturer.user?.firstName} {lecturer.user?.lastName}
                  </TableCell>
                  <TableCell>{lecturer.user?.email}</TableCell>
                  <TableCell>
                    {departments.find((d) => d.id === lecturer.departmentId)?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(lecturer.status)}>
                      {lecturer.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(lecturer.joinDate)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/lecturers/${lecturer.id}`)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/lecturers/${lecturer.id}/edit`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(lecturer.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
