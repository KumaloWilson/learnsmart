import { useSelector, useDispatch } from "react-redux"
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

  const loadLecturers = async () => {
    return await dispatch(fetchLecturers()).unwrap()
  }

  const loadLecturer = async (id: string) => {
    return await dispatch(fetchLecturer(id)).unwrap()
  }

  const loadLecturerByUserId = async (userId: string) => {
    return await dispatch(fetchLecturerByUserId(userId)).unwrap()
  }

  const addLecturer = async (data: CreateLecturerDto) => {
    return await dispatch(createLecturer(data)).unwrap()
  }

  const editLecturer = async (id: string, data: UpdateLecturerDto) => {
    return await dispatch(updateLecturer({ id, data })).unwrap()
  }

  const removeLecturer = async (id: string) => {
    return await dispatch(deleteLecturer(id)).unwrap()
  }

  const loadCourseAssignments = async (lecturerId: string) => {
    return await dispatch(fetchLecturerCourseAssignments(lecturerId)).unwrap()
  }

  const addCourseAssignment = async (data: CreateCourseAssignmentDto) => {
    return await dispatch(createCourseAssignment(data)).unwrap()
  }

  const editCourseAssignment = async (id: string, data: UpdateCourseAssignmentDto) => {
    return await dispatch(updateCourseAssignment({ id, data })).unwrap()
  }

  const removeCourseAssignment = async (id: string) => {
    return await dispatch(deleteCourseAssignment(id)).unwrap()
  }

  const resetCurrentLecturer = () => {
    dispatch(clearCurrentLecturer())
  }

  const resetError = () => {
    dispatch(clearError())
  }

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
