import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Filter, Download, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PageSection } from "@/components/page-container"

export default function StudentsPage() {
  const students = [
    {
      id: "S1001",
      name: "Alice Johnson",
      email: "alice.j@smartlearn.edu",
      course: "CS101, CS301",
      performance: "Excellent",
    },
    {
      id: "S1002",
      name: "Bob Smith",
      email: "bob.s@smartlearn.edu",
      course: "CS201, CS401",
      performance: "Good",
    },
    {
      id: "S1003",
      name: "Charlie Brown",
      email: "charlie.b@smartlearn.edu",
      course: "CS101, CS201",
      performance: "Average",
    },
    {
      id: "S1004",
      name: "Diana Prince",
      email: "diana.p@smartlearn.edu",
      course: "CS301, CS401",
      performance: "Excellent",
    },
    {
      id: "S1005",
      name: "Edward Norton",
      email: "edward.n@smartlearn.edu",
      course: "CS101, CS401",
      performance: "Good",
    },
    {
      id: "S1006",
      name: "Fiona Gallagher",
      email: "fiona.g@smartlearn.edu",
      course: "CS201, CS301",
      performance: "Needs Improvement",
    },
    {
      id: "S1007",
      name: "George Lucas",
      email: "george.l@smartlearn.edu",
      course: "CS101, CS201",
      performance: "Good",
    },
    {
      id: "S1008",
      name: "Hannah Baker",
      email: "hannah.b@smartlearn.edu",
      course: "CS301, CS401",
      performance: "Average",
    },
  ]

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
            {performance}
          </Badge>
        )
      case "Good":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
            {performance}
          </Badge>
        )
      case "Average":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800">
            {performance}
          </Badge>
        )
      default:
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800">
            {performance}
          </Badge>
        )
    }
  }

  const actions = (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" size="sm" className="gap-1">
        <Filter className="h-4 w-4" /> Filter
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <Download className="h-4 w-4" /> Export
      </Button>
      <Button size="sm" className="gap-1">
        <Plus className="h-4 w-4" /> Add Student
      </Button>
    </div>
  )

  return (
    <PageContainer title="Students" description="View and manage your students across all courses" actions={actions}>
      <PageSection title="Student Directory" description="Browse and manage all students">
        <div className="mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search students by name, ID or email..." className="pl-8" />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden data-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Courses</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-muted">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={student.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {student.course.split(", ").map((course) => (
                        <Badge key={course} variant="outline" className="bg-muted/50">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getPerformanceBadge(student.performance)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <span className="flex items-center w-full">View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="flex items-center w-full">View Performance</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="flex items-center w-full">Send Message</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="flex items-center w-full">View Attendance</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </PageContainer>
  )
}
