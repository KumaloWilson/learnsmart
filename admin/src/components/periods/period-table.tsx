"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { usePeriods } from "@/hooks/use-periods"
import { MoreHorizontal, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Period } from "@/types/period"

export function PeriodTable() {
  const router = useRouter()
  const { toast } = useToast()
  const { periods, isLoading, error, removePeriod } = usePeriods()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const filteredPeriods = periods.filter(
    (period) =>
      period.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (period.semester?.name && period.semester.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDelete = async (id: string) => {
    try {
      await removePeriod(id)
      toast({
        title: "Success",
        description: "Period deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete period",
        variant: "destructive",
      })
      console.error("Error deleting period:", err)
    }
  }

  const getPeriodStatus = (period: Period) => {
    const now = new Date()
    const startDate = new Date(period.startTime)
    const endDate = new Date(period.endTime)

    if (now < startDate) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (now > endDate) {
      return <Badge variant="secondary">Completed</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  if (isLoading?.periods) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[40px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search periods..."
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
              <TableHead>Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeriods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No periods found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPeriods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="font-medium">{period.name}</TableCell>
                  <TableCell>{period.semester?.name || "N/A"}</TableCell>
                  <TableCell>{format(new Date(`1970-01-01T${period.startTime}Z`), "hh:mm a")}</TableCell>
                  <TableCell>{format(new Date(`1970-01-01T${period.endTime}Z`), "hh:mm a")}</TableCell>
                  <TableCell>{getPeriodStatus(period)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/periods/${period.id}`)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/periods/edit/${period.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(period.id)}>Delete</DropdownMenuItem>
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