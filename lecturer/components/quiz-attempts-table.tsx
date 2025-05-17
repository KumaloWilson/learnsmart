"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, formatTime, getInitials } from "@/lib/utils"
import Link from "next/link"
import type { QuizAttempt } from "@/lib/auth/types"

interface QuizAttemptsTableProps {
  attempts: QuizAttempt[]
}

export function QuizAttemptsTable({ attempts }: QuizAttemptsTableProps) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No attempts data available</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "in_progress":
        return <Badge variant="outline">In Progress</Badge>
      case "abandoned":
        return <Badge variant="destructive">Abandoned</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={attempt.studentProfile.user.firstName}
                    />
                    <AvatarFallback>
                      {getInitials(attempt.studentProfile.user.firstName, attempt.studentProfile.user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {attempt.studentProfile.user.firstName} {attempt.studentProfile.user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{attempt.studentProfile.studentId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatDate(attempt.startTime)} {formatTime(attempt.startTime)}
              </TableCell>
              <TableCell>
                {attempt.endTime ? `${formatDate(attempt.endTime)} ${formatTime(attempt.endTime)}` : "In progress"}
              </TableCell>
              <TableCell>
                {attempt.score !== null ? (
                  <span className="font-medium">{attempt.score}%</span>
                ) : (
                  <span className="text-muted-foreground">Not graded</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(attempt.status)}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/students/${attempt.studentProfileId}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
