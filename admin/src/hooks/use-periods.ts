import { useSelector, useDispatch } from "react-redux"
import { useCallback } from "react"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchPeriods,
  fetchPeriod,
  fetchPeriodsBySemester,
  createPeriod,
  updatePeriod,
  deletePeriod,
  clearCurrentPeriod,
  clearError,
} from "@/lib/redux/periodSlice"
import type { CreatePeriodDto, UpdatePeriodDto } from "@/types/period"

export const usePeriods = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { periods, semesterPeriods, currentPeriod, isLoading, error } = useSelector((state: RootState) => state.periods)

  // Use useCallback to prevent useEffect dependency issues
  const loadPeriods = useCallback(async () => {
    return await dispatch(fetchPeriods()).unwrap()
  }, [dispatch])

  const loadPeriod = useCallback(async (id: string) => {
    return await dispatch(fetchPeriod(id)).unwrap()
  }, [dispatch])

  const loadPeriodsBySemester = useCallback(async (semesterId: string) => {
    return await dispatch(fetchPeriodsBySemester(semesterId)).unwrap()
  }, [dispatch])

  const addPeriod = async (data: CreatePeriodDto) => {
    return await dispatch(createPeriod(data)).unwrap()
  }

  const editPeriod = async (id: string, data: UpdatePeriodDto) => {
    return await dispatch(updatePeriod({ id, data })).unwrap()
  }

  const removePeriod = async (id: string) => {
    return await dispatch(deletePeriod(id)).unwrap()
  }

  const resetCurrentPeriod = () => {
    dispatch(clearCurrentPeriod())
  }

  const resetError = () => {
    dispatch(clearError())
  }

  return {
    periods,
    semesterPeriods,
    currentPeriod,
    isLoading,
    error,
    loadPeriods,
    loadPeriod,
    loadPeriodsBySemester,
    addPeriod,
    editPeriod,
    removePeriod,
    resetCurrentPeriod,
    resetError,
  }
}