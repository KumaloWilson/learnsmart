"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { ProgramsTable } from "@/components/programs-table"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchPrograms, deleteProgram } from "@/store/slices/programs-slice"
import { useToast } from "@/components/ui/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function ProgramsPage() {
  const dispatch = useAppDispatch()
  const { programs, isLoading, error } = useAppSelector((state) => state.programs)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchPrograms())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProgram(id)).unwrap()
      toast({
        title: "Success",
        description: "Program deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      })
    }
  }


  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageHeader
          title="Programs"
          description="Manage academic programs across all departments"
          actions={
            <Link href="/programs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Program
              </Button>
            </Link>
          }
        />

<div className="mt-6">
        <ProgramsTable 
          programs={programs.map(p => ({ 
            ...p, 
            duration: p.durationYears || 4,
            createdAt: p.createdAt || '',
            updatedAt: p.updatedAt || ''
          }))} 
          isLoading={isLoading} 
          onDelete={handleDelete} 
        />
      </div>
      </div>

      
    
    </div>
  )
}
