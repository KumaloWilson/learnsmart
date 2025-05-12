import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchSemesters,
  fetchSemester,
  fetchActiveSemester,
  createSemester,
  updateSemester,
  deleteSemester,
  clearCurrentSemester,
  clearError,
} from "@/lib/redux/semesterSlice"
import type { CreateSemesterDto, UpdateSemesterDto } from "@/types/semester"

export const useSemesters = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { semesters, currentSemester, activeSemester, isLoading, error } = useSelector(
    (state: RootState) => state.semesters,
  )

  const loadSemesters = async () => {
    return await dispatch(fetchSemesters()).unwrap()
  }

  const loadSemester = async (id: string) => {
    return await dispatch(fetchSemester(id)).unwrap()
  }

  const loadActiveSemester = async () => {
    return await dispatch(fetchActiveSemester()).unwrap()
  }

  const addSemester = async (data: CreateSemesterDto) => {
    return await dispatch(createSemester(data)).unwrap()
  }

  const editSemester = async (id: string, data: UpdateSemesterDto) => {
    return await dispatch(updateSemester({ id, data })).unwrap()
  }

  const removeSemester = async (id: string) => {
    return await dispatch(deleteSemester(id)).unwrap()
  }

  const resetCurrentSemester = () => {
    dispatch(clearCurrentSemester())
  }

  const resetError = () => {
    dispatch(clearError())
  }

  return {
    semesters,
    currentSemester,
    activeSemester,
    isLoading,
    error,
    loadSemesters,
    loadSemester,
    loadActiveSemester,
    addSemester,
    editSemester,
    removeSemester,
    resetCurrentSemester,
    resetError,
  }
}
