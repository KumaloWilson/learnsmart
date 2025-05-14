import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AttendancePage() {
  const students = [
    { id: "S1001", name: "Alice Johnson", attendance: [true, true, true, false, true] },
    { id: "S1002", name: "Bob Smith", attendance: [true, true, false, true, true] },
    { id: "S1003", name: "Charlie Brown", attendance: [false, true, true, true, true] },
    { id: "S1004", name: "Diana Prince", attendance: [true, true, true, true, true] },
    { id: "S1005", name: "Edward Norton", attendance: [true, false, true, false, true] },
    { id: "S1006", name: "Fiona Gallagher", attendance: [false, false, true, true, false] },
    { id: "S1007", name: "George Lucas", attendance: [true, true, true, false, true] },
    { id: "S1008", name: "Hannah Baker", attendance: [true, true, false, true, true] },
  ]

  const dates = ["May 1, 2025", "May 3, 2025", "May 5, 2025", "May 8, 2025", "May 10, 2025"]

  return (
    <PageContainer title="Attendance" description="Track and manage student attendance">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select defaultValue="cs101">
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs101">CS101: Intro to CS</SelectItem>
            <SelectItem value="cs201">CS201: Data Structures</SelectItem>
            <SelectItem value="cs301">CS301: Database Systems</SelectItem>
            <SelectItem value="cs401">CS401: Web Development</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <span className="text-sm">May 10, 2025</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline">Export</Button>
          <Button>Take Attendance</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <CardDescription>All courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CS101 Attendance</CardTitle>
            <CardDescription>Introduction to CS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Highest among all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lowest Attendance</CardTitle>
            <CardDescription>Students requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Below 75% attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student ID</TableHead>
              <TableHead>Name</TableHead>
              {dates.map((date, index) => (
                <TableHead key={index} className="text-center">
                  {date}
                </TableHead>
              ))}
              <TableHead className="text-center">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                {student.attendance.map((present, index) => (
                  <TableCell key={index} className="text-center">
                    <Checkbox checked={present} disabled className="mx-auto" />
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {Math.round((student.attendance.filter(Boolean).length / student.attendance.length) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  )
}
