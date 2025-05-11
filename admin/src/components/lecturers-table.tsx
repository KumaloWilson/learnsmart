"use client"

import { useState, useCallback, memo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface LecturerData {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string
  department: string
  specialization: string
  status: string
  staffId: string
  [key: string]: any // Allow for additional properties
}

interface LecturersTableProps {
  data: LecturerData[]
  isLoading?: boolean
  onDelete: (id: string) => Promise<void>
}

// Use memo to prevent unnecessary re-renders
export const LecturersTable = memo(function LecturersTable({ 
  data, 
  isLoading = false, 
  onDelete 
}: LecturersTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Extract unique departments for filtering
  const departments = Array.from(new Set(data
    .map((lecturer) => lecturer.department)
    .filter(Boolean)
  ))

  // Memoize action handlers to prevent unnecessary re-renders
  const handleViewDetails = useCallback((id: string) => {
    router.push(`/lecturers/${id}`)
  }, [router])

  const handleEdit = useCallback((id: string) => {
    router.push(`/lecturers/${id}/edit`)
  }, [router])

  const handleDeleteAction = useCallback(async (id: string) => {
    try {
      await onDelete(id)
      toast({
        title: "Lecturer deleted",
        description: "The lecturer has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lecturer. Please try again.",
        variant: "destructive",
      })
    }
  }, [onDelete, toast])

  // Action cell renderer as a memoized component
  const ActionCell = useCallback(({ row }: { row: any }) => {
    const lecturer = row.original
    
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button"
              variant="ghost" 
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewDetails(lecturer.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(lecturer.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => handleDeleteAction(lecturer.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }, [handleViewDetails, handleEdit, handleDeleteAction])

  // Define columns with memoized cell renderers
  const columns: ColumnDef<LecturerData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const lecturer = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              {lecturer.firstName?.charAt(0) || '?'}
              {lecturer.lastName?.charAt(0) || '?'}
            </div>
            <div>
              <div className="font-medium">
                {lecturer.title} {lecturer.firstName} {lecturer.lastName}
              </div>
              <div className="text-sm text-gray-500">{lecturer.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <div>{row.getValue("department") || "—"}</div>,
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => <div>{row.getValue("specialization") || "—"}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant="outline"
            className={
              status === "active"
                ? "border-green-200 bg-green-50 text-green-700"
                : status === "on_leave"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
            }
          >
            {status === "active"
              ? "Active"
              : status === "on_leave"
                ? "On Leave"
                : status === "retired"
                  ? "Retired"
                  : "Terminated"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ActionCell
    },
  ]

  // Apply department and status filters
  const filteredData = data.filter((lecturer) => {
    const departmentMatch = departmentFilter === "all" || lecturer.department === departmentFilter
    const statusMatch = statusFilter === "all" || lecturer.status === statusFilter
    return departmentMatch && statusMatch
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
          <div className="text-sm text-gray-500">Please wait while we fetch lecturer data.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search lecturers..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Departments</SelectLabel>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem 
                    key={`dept-${department}`} 
                    value={department || ""}
                  >
                    {department || "Unassigned"}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/lecturers/new">
              <Plus className="mr-2 h-4 w-4" /> Add Lecturer
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewDetails(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      data-cell-actions={cell.column.id === "actions" ? "true" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No lecturers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} lecturers
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
})