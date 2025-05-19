import { useSelector, useDispatch } from "react-redux"
import { useCallback } from "react"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchLecturers,
  fetchLecturer,
  fetchLecturerByUserId,
  createLecturer,
  updateLecturer,
  deleteLecturer,
  fetchLecturerCourseAssignments,
  createCourseAssignment,
  updateCourseAssignment,
  deleteCourseAssignment,
  clearCurrentLecturer,
  clearError,
} from "@/lib/redux/lecturerSlice"
import type {
  CreateLecturerDto,
  UpdateLecturerDto,
  CreateCourseAssignmentDto,
  UpdateCourseAssignmentDto,
} from "@/types/lecturer"

export const useLecturers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { lecturers, currentLecturer, courseAssignments, isLoading, error } = useSelector(
    (state: RootState) => state.lecturers,
  )

  const loadLecturers = useCallback(async () => {
    return await dispatch(fetchLecturers()).unwrap()
  }, [dispatch])

  const loadLecturer = useCallback(async (id: string) => {
    return await dispatch(fetchLecturer(id)).unwrap()
  }, [dispatch])

  const loadLecturerByUserId = useCallback(async (userId: string) => {
    return await dispatch(fetchLecturerByUserId(userId)).unwrap()
  }, [dispatch])

  const addLecturer = useCallback(async (data: CreateLecturerDto) => {
    return await dispatch(createLecturer(data)).unwrap()
  }, [dispatch])

  const editLecturer = useCallback(async (id: string, data: UpdateLecturerDto) => {
    return await dispatch(updateLecturer({ id, data })).unwrap()
  }, [dispatch])

  const removeLecturer = useCallback(async (id: string) => {
    return await dispatch(deleteLecturer(id)).unwrap()
  }, [dispatch])

  const loadCourseAssignments = useCallback(async (lecturerId: string) => {
    return await dispatch(fetchLecturerCourseAssignments(lecturerId)).unwrap()
  }, [dispatch])

  const addCourseAssignment = useCallback(async (data: CreateCourseAssignmentDto) => {
    return await dispatch(createCourseAssignment(data)).unwrap()
  }, [dispatch])

  const editCourseAssignment = useCallback(async (id: string, data: UpdateCourseAssignmentDto) => {
    return await dispatch(updateCourseAssignment({ id, data })).unwrap()
  }, [dispatch])

  const removeCourseAssignment = useCallback(async (id: string) => {
    return await dispatch(deleteCourseAssignment(id)).unwrap()
  }, [dispatch])

  const resetCurrentLecturer = useCallback(() => {
    dispatch(clearCurrentLecturer())
  }, [dispatch])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    lecturers,
    currentLecturer,
    courseAssignments,
    isLoading,
    error,
    loadLecturers,
    loadLecturer,
    loadLecturerByUserId,
    addLecturer,
    editLecturer,
    removeLecturer,
    loadCourseAssignments,
    addCourseAssignment,
    editCourseAssignment,
    removeCourseAssignment,
    resetCurrentLecturer,
    resetError,
  }
}