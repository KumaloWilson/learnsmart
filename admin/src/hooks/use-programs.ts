import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchPrograms,
  fetchProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  clearCurrentProgram,
  clearError,
} from "@/lib/redux/programSlice"
import type { CreateProgramDto, UpdateProgramDto } from "@/types/program"
import { useCallback } from "react"

export const usePrograms = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { programs, currentProgram, isLoading, error } = useSelector((state: RootState) => state.programs)

  // Use useCallback to prevent useEffect dependency issues
  const loadPrograms = useCallback(async () => {
    return await dispatch(fetchPrograms()).unwrap()
  }, [dispatch])

  const loadProgram = useCallback(async (id: string) => {
    return await dispatch(fetchProgram(id)).unwrap()
  }, [dispatch])

  const addProgram = async (data: CreateProgramDto) => {
    return await dispatch(createProgram(data)).unwrap()
  }

  const editProgram = async (id: string, data: UpdateProgramDto) => {
    return await dispatch(updateProgram({ id, data })).unwrap()
  }

  const removeProgram = async (id: string) => {
    return await dispatch(deleteProgram(id)).unwrap()
  }

  const resetCurrentProgram = () => {
    dispatch(clearCurrentProgram())
  }

  const resetError = () => {
    dispatch(clearError())
  }

  return {
    programs,
    currentProgram,
    isLoading,
    error,
    loadPrograms,
    loadProgram,
    addProgram,
    editProgram,
    removeProgram,
    resetCurrentProgram,
    resetError,
  }
}