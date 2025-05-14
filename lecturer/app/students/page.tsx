import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  return (
    <PageContainer title="Students" description="View and manage your students">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search students..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="rounded-md border">
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
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {student.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                <TableCell className="hidden md:table-cell">{student.course}</TableCell>
                <TableCell>
                  <span
                    className={
                      student.performance === "Excellent"
                        ? "text-green-600"
                        : student.performance === "Good"
                          ? "text-blue-600"
                          : student.performance === "Average"
                            ? "text-yellow-600"
                            : "text-red-600"
                    }
                  >
                    {student.performance}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Performance</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>View Attendance</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  )
}
