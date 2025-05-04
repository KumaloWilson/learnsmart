"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"
import { updateAcademicRecord, deleteAcademicRecord } from "@/store/slices/students-slice"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import type { AcademicRecord } from "@/lib/api/students-api"
import { AcademicRecordForm } from "./academic-record-form"

interface AcademicRecordsTableProps {
  studentId: string
  academicRecords: AcademicRecord[]
}

export function AcademicRecordsTable({ studentId, academicRecords }: AcademicRecordsTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(null)
  const [formData, setFormData] = useState({
    gpa: 0,
    cgpa: 0,
    totalCredits: 0,
    earnedCredits: 0,
    remarks: "",
  })

  const handleEditClick = (record: AcademicRecord) => {
    setSelectedRecord(record)
    setFormData({
      gpa: record.gpa,
      cgpa: record.cgpa,
      totalCredits: record.totalCredits,
      earnedCredits: record.earnedCredits,
      remarks: record.remarks || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return

    try {
      await dispatch(
        updateAcademicRecord({
          id: selectedRecord.id,
          data: formData,
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "Academic record updated successfully",
      })

      setIsEditDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update academic record",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (recordId: string) => {
    if (confirm("Are you sure you want to delete this academic record? This action cannot be undone.")) {
      try {
        await dispatch(deleteAcademicRecord(recordId)).unwrap()
        toast({
          title: "Success",
          description: "Academic record deleted successfully",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete academic record",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Academic Records</CardTitle>
          <CardDescription>Manage student academic records by semester</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Academic Record</DialogTitle>
              <DialogDescription>Add a new academic record for a specific semester.</DialogDescription>
            </DialogHeader>
            <AcademicRecordForm studentId={studentId} onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No academic records found
                  </TableCell>
                </TableRow>
              ) : (
                academicRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.semester?.name}</p>
                        <p className="text-sm text-gray-500">
                          {record.semester?.startDate && format(new Date(record.semester.startDate), "MMM yyyy")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{record.gpa.toFixed(2)}</TableCell>
                    <TableCell>{record.cgpa.toFixed(2)}</TableCell>
                    <TableCell>
                      {record.earnedCredits} / {record.totalCredits}
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-1">{record.remarks || "N/A"}</span>
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
                          <DropdownMenuItem onClick={() => handleEditClick(record)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(record.id)}>
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Academic Record</DialogTitle>
              <DialogDescription>Update the academic record for {selectedRecord?.semester?.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA (0-4)</Label>
                  <Input
                    id="gpa"
                    type="number"
                    min={0}
                    max={4}
                    step={0.01}
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA (0-4)</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    min={0}
                    max={4}
                    step={0.01}
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCredits">Total Credits</Label>
                  <Input
                    id="totalCredits"
                    type="number"
                    min={0}
                    value={formData.totalCredits}
                    onChange={(e) => setFormData({ ...formData, totalCredits: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earnedCredits">Earned Credits</Label>
                  <Input
                    id="earnedCredits"
                    type="number"
                    min={0}
                    value={formData.earnedCredits}
                    onChange={(e) => setFormData({ ...formData, earnedCredits: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRecord}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
