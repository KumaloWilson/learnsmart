import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchSchools,
  fetchSchool,
  createSchool,
  updateSchool,
  deleteSchool,
  clearCurrentSchool,
  clearError,
} from "@/lib/redux/schoolSlice"
import type { CreateSchoolDto, UpdateSchoolDto } from "@/types/school"
import { useCallback } from "react"

export const useSchools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { schools, currentSchool, isLoading, error } = useSelector((state: RootState) => state.schools)

  // Use useCallback to prevent useEffect dependency issues
  const loadSchools = useCallback(async () => {
    return await dispatch(fetchSchools()).unwrap()
  }, [dispatch])

  const loadSchool = useCallback(async (id: string) => {
    return await dispatch(fetchSchool(id)).unwrap()
  }, [dispatch])

  const addSchool = async (data: CreateSchoolDto) => {
    return await dispatch(createSchool(data)).unwrap()
  }

  const editSchool = async (id: string, data: UpdateSchoolDto) => {
    return await dispatch(updateSchool({ id, data })).unwrap()
  }

  const removeSchool = async (id: string) => {
    return await dispatch(deleteSchool(id)).unwrap()
  }

  const resetCurrentSchool = () => {
    dispatch(clearCurrentSchool())
  }

  const resetError = () => {
    dispatch(clearError())
  }

  return {
    schools,
    currentSchool,
    isLoading,
    error,
    loadSchools,
    loadSchool,
    addSchool,
    editSchool,
    removeSchool,
    resetCurrentSchool,
    resetError,
  }
}