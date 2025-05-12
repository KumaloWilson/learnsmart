import { useSelector, useDispatch } from "react-redux"
import { useCallback } from "react"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchDepartments,
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  clearCurrentDepartment,
  clearError,
} from "@/lib/redux/departmentSlice"
import type { CreateDepartmentDto, UpdateDepartmentDto } from "@/types/department"

export const useDepartments = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { departments, currentDepartment, isLoading, error } = useSelector((state: RootState) => state.departments)

  // Use useCallback to prevent useEffect dependency issues
  const loadDepartments = useCallback(async () => {
    return await dispatch(fetchDepartments()).unwrap()
  }, [dispatch])

  const loadDepartment = useCallback(async (id: string) => {
    return await dispatch(fetchDepartment(id)).unwrap()
  }, [dispatch])

  const addDepartment = async (data: CreateDepartmentDto) => {
    return await dispatch(createDepartment(data)).unwrap()
  }

  const editDepartment = async (id: string, data: UpdateDepartmentDto) => {
    return await dispatch(updateDepartment({ id, data })).unwrap()
  }

  const removeDepartment = async (id: string) => {
    return await dispatch(deleteDepartment(id)).unwrap()
  }

  const resetCurrentDepartment = () => {
    dispatch(clearCurrentDepartment())
  }

  const resetError = () => {
    dispatch(clearError())
  }

  return {
    departments,
    currentDepartment,
    isLoading,
    error,
    loadDepartments,
    loadDepartment,
    addDepartment,
    editDepartment,
    removeDepartment,
    resetCurrentDepartment,
    resetError,
  }
}