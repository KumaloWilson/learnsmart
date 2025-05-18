"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchDashboard } from "@/lib/redux/slices/dashboardSlice"
import { MainSidebar } from "@/components/main-sidebar"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, studentProfile, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // If authentication check is complete and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    // If user is authenticated and has a student profile, fetch dashboard data
    if (isAuthenticated && studentProfile) {
      dispatch(fetchDashboard())
    }
  }, [isAuthenticated, isLoading, router, dispatch, studentProfile])

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MainSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
