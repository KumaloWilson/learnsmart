"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { LecturerForm } from "@/components/lecturer-form"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchLecturerById } from "@/store/slices/lecturers-slice"

export default function EditLecturerPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const { currentLecturer, loading } = useAppSelector((state) => state.lecturers)

  useEffect(() => {
    dispatch(fetchLecturerById(params.id))
  }, [dispatch, params.id])

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit Lecturer" subheading="Update lecturer information" />
      {loading ? (
        <div>Loading...</div>
      ) : currentLecturer ? (
        <LecturerForm lecturer={currentLecturer} isEditing />
      ) : (
        <div>Lecturer not found</div>
      )}
    </div>
  )
}
