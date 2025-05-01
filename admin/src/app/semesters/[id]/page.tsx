"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { SemesterForm } from "@/components/semester-form"

import { Skeleton } from "@/components/ui/skeleton"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchSemesterById, updateSemester } from "@/store/slices/semesters-slice"
import { useToast } from "@/components/ui/use-toast"

export default function EditSemesterPage({ params }: { params: { id: string } }) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentSemester, isLoading, error } = useAppSelector((state) => state.semesters)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchSemesterById(params.id))
  }, [dispatch, params.id])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      router.push("/semesters")
    }
  }, [error, router, toast])

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await dispatch(updateSemester({ id: params.id, semesterData: data })).unwrap()

      toast({
        title: "Success",
        description: "Semester updated successfully",
      })

      router.push("/semesters")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update semester",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-2xl" />
          <Skeleton className="h-10 w-full max-w-2xl" />
          <Skeleton className="h-32 w-full max-w-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title={`Edit Semester: ${currentSemester?.name}`} description="Update semester information" />
      <div className="mt-6">
        <SemesterForm semester={currentSemester ?? undefined} />
      </div>
    </div>
  )
}
