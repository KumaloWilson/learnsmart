import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchCourses,
  fetchCourse,
  fetchCoursesByProgram,
  createCourse,
  updateCourse,
  deleteCourse,
  assignCourseToSemester,
  removeCourseFromSemester,
  clearCurrentCourse,
  clearError,
} from "@/lib/redux/courseSlice"
import type { CreateCourseDto, UpdateCourseDto } from "@/types/course"

export const useCourses = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { courses, programCourses, currentCourse, isLoading, error } = useSelector((state: RootState) => state.courses)

  const loadCourses = async () => {
    return await dispatch(fetchCourses()).unwrap()
  }

  const loadCourse = async (id: string) => {
    return await dispatch(fetchCourse(id)).unwrap()
  }

  const loadCoursesByProgram = async (programId: string) => {
    return await dispatch(fetchCoursesByProgram(programId)).unwrap()
  }

  const addCourse = async (data: CreateCourseDto) => {
    return await dispatch(createCourse(data)).unwrap()
  }

  const editCourse = async (id: string, data: UpdateCourseDto) => {
    return await dispatch(updateCourse({ id, data })).unwrap()
  }

  const removeCourse = async (id: string) => {
    return await dispatch(deleteCourse(id)).unwrap()
  }

  const assignToSemester = async (courseId: string, semesterId: string) => {
    return await dispatch(assignCourseToSemester({ courseId, semesterId })).unwrap()
  }

  const removeFromSemester = async (courseId: string, semesterId: string) => {
    return await dispatch(removeCourseFromSemester({ courseId, semesterId })).unwrap()
  }

  const resetCurrentCourse = () => {
    dispatch(clearCurrentCourse())
  }

  const resetError = () => {
    dispatch(clearError())
  }

  return {
    courses,
    programCourses,
    currentCourse,
    isLoading,
    error,
    loadCourses,
    loadCourse,
    loadCoursesByProgram,
    addCourse,
    editCourse,
    removeCourse,
    assignToSemester,
    removeFromSemester,
    resetCurrentCourse,
    resetError,
  }
}
