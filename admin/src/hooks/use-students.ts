"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  fetchStudents,
  fetchStudentById,
  fetchStudentByUserId,
  fetchStudentByStudentId,
  addStudent,
  editStudent,
  removeStudent,
  fetchStudentEnrollments,
  fetchStudentEnrollmentsBySemester,
  addEnrollment,
  editEnrollment,
  removeEnrollment,
  fetchAcademicRecordById,
  fetchStudentAcademicRecords,
  addAcademicRecord,
  editAcademicRecord,
  removeAcademicRecord,
  clearCurrentStudent,
  clearEnrollments,
  clearAcademicRecords,
  clearErrors,
} from "@/lib/redux/studentSlice"
import type { StudentFormData, EnrollmentFormData, AcademicRecordFormData } from "@/types/student"

export const useStudents = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { students, currentStudent, enrollments, academicRecords, currentAcademicRecord, loading, error } = useSelector(
    (state: RootState) => state.students,
  )

  // Student actions
  const getStudents = useCallback(() => {
    return dispatch(fetchStudents())
  }, [dispatch])

  const getStudentById = useCallback(
    (id: string) => {
      return dispatch(fetchStudentById(id))
    },
    [dispatch],
  )

  const getStudentByUserId = useCallback(
    (userId: string) => {
      return dispatch(fetchStudentByUserId(userId))
    },
    [dispatch],
  )

  const getStudentByStudentId = useCallback(
    (studentId: string) => {
      return dispatch(fetchStudentByStudentId(studentId))
    },
    [dispatch],
  )

  const createStudent = useCallback(
    (data: StudentFormData) => {
      return dispatch(addStudent(data))
    },
    [dispatch],
  )

  const updateStudent = useCallback(
    (id: string, data: Partial<StudentFormData>) => {
      return dispatch(editStudent({ id, data }))
    },
    [dispatch],
  )

  const deleteStudent = useCallback(
    (id: string) => {
      return dispatch(removeStudent(id))
    },
    [dispatch],
  )

  const resetCurrentStudent = useCallback(() => {
    dispatch(clearCurrentStudent())
  }, [dispatch])

  // Enrollment actions
  const getStudentEnrollments = useCallback(
    (studentId: string) => {
      return dispatch(fetchStudentEnrollments(studentId))
    },
    [dispatch],
  )

  const getStudentEnrollmentsBySemester = useCallback(
    (studentId: string, semesterId: string) => {
      return dispatch(fetchStudentEnrollmentsBySemester({ studentId, semesterId }))
    },
    [dispatch],
  )

  const createEnrollment = useCallback(
    (data: EnrollmentFormData) => {
      return dispatch(addEnrollment(data))
    },
    [dispatch],
  )

  const updateEnrollment = useCallback(
    (id: string, data: Partial<EnrollmentFormData>) => {
      return dispatch(editEnrollment({ id, data }))
    },
    [dispatch],
  )

  const deleteEnrollment = useCallback(
    (id: string) => {
      return dispatch(removeEnrollment(id))
    },
    [dispatch],
  )

  const resetEnrollments = useCallback(() => {
    dispatch(clearEnrollments())
  }, [dispatch])

  // Academic Record actions
  const getAcademicRecordById = useCallback(
    (id: string) => {
      return dispatch(fetchAcademicRecordById(id))
    },
    [dispatch],
  )

  const getStudentAcademicRecords = useCallback(
    (studentId: string) => {
      return dispatch(fetchStudentAcademicRecords(studentId))
    },
    [dispatch],
  )

  const createAcademicRecord = useCallback(
    (data: AcademicRecordFormData) => {
      return dispatch(addAcademicRecord(data))
    },
    [dispatch],
  )

  const updateAcademicRecord = useCallback(
    (id: string, data: Partial<AcademicRecordFormData>) => {
      return dispatch(editAcademicRecord({ id, data }))
    },
    [dispatch],
  )

  const deleteAcademicRecord = useCallback(
    (id: string) => {
      return dispatch(removeAcademicRecord(id))
    },
    [dispatch],
  )

  const resetAcademicRecords = useCallback(() => {
    dispatch(clearAcademicRecords())
  }, [dispatch])

  // Error handling
  const resetErrors = useCallback(() => {
    dispatch(clearErrors())
  }, [dispatch])

  return {
    // State
    students,
    currentStudent,
    enrollments,
    academicRecords,
    currentAcademicRecord,
    loading,
    error,

    // Student actions
    getStudents,
    getStudentById,
    getStudentByUserId,
    getStudentByStudentId,
    createStudent,
    updateStudent,
    deleteStudent,
    resetCurrentStudent,

    // Enrollment actions
    getStudentEnrollments,
    getStudentEnrollmentsBySemester,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    resetEnrollments,

    // Academic Record actions
    getAcademicRecordById,
    getStudentAcademicRecords,
    createAcademicRecord,
    updateAcademicRecord,
    deleteAcademicRecord,
    resetAcademicRecords,

    // Error handling
    resetErrors,
  }
}
