import { useSelector, useDispatch } from "react-redux"
import { useCallback } from "react"
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

  // Use useCallback to prevent useEffect dependency issues
  const loadSemesters = useCallback(async () => {
    return await dispatch(fetchSemesters()).unwrap()
  }, [dispatch])

  const loadSemester = useCallback(async (id: string) => {
    return await dispatch(fetchSemester(id)).unwrap()
  }, [dispatch])

  const loadActiveSemester = useCallback(async () => {
    return await dispatch(fetchActiveSemester()).unwrap()
  }, [dispatch])

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