"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchCurrentUser } from "@/store/slices/auth-slice"

export function useAuth(requireAdmin = false) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, isAuthenticated, isLoading])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    if (!isLoading && isAuthenticated && requireAdmin && user?.role !== "admin") {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, router, requireAdmin])

  return { user, isAuthenticated, isLoading }
}
