"use client"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Loader2, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/auth-context"
import { useAtRiskStudents } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDateShort, getRiskLevelColor, getInitials } from "@/lib/utils"

export default function AtRiskStudentsPage() {
  const { lecturerProfile } = useAuth()
  const { getAtRiskStudents, atRiskStudents, isLoading, error } = useAtRiskStudents()
  const [searchTerm, setSearchTerm] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && !isInitialLoading && atRiskStudents.length === 0) {
        try {
          await getAtRiskStudents(lecturerProfile.id)
        } catch (err) {
          console.error("Error fetching at-risk students:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, getAtRiskStudents, atRiskStudents.length, isInitialLoading])

  const filteredStudents = atRiskStudents.filter(
    (student) =>
      student.studentProfile.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentProfile.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentProfile.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentProfile.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isInitialLoading || isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading at-risk students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="At-Risk Students" description="Students requiring additional support">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="At-Risk Students" description="Students requiring additional support">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Create Intervention</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="hidden md:table-cell">Risk Factors</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder-32px.png?height=32&width=32`}
                          alt={`${student.studentProfile.user.firstName} ${student.studentProfile.user.lastName}`}
                        />
                        <AvatarFallback>
                          {getInitials(student.studentProfile.user.firstName, student.studentProfile.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {student.studentProfile.user.firstName} {student.studentProfile.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{student.studentProfile.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{student.course.code}</div>
                    <div className="text-sm text-muted-foreground">{student.course.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskLevelColor(student.riskLevel)}>
                      {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {student.riskFactors.map((factor: string) => (
                        <Badge key={factor} variant="outline" className="capitalize">
                          {factor.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDateShort(student.lastUpdated)}</TableCell>
                  <TableCell>
                    <Badge variant={student.isResolved ? "secondary" : "destructive"}>
                      {student.isResolved ? "Resolved" : "Unresolved"}
                    </Badge>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${student.studentProfile.id}`}>View Student</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Add Intervention</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  {searchTerm ? "No students match your search" : "No at-risk students found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  )
}
