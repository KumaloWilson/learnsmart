"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar/sidebar"
import { UserProfile } from "@/components/user/user-profile"
import { useAppSelector } from "@/redux/hooks"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Client-side auth check
    if (!isAuthenticated && typeof window !== "undefined") {
      // Check if we have a cookie but no Redux state
      const hasCookie = document.cookie.includes("accessToken=")
      if (!hasCookie) {
        router.push("/login")
      }
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border">
        <div className="flex h-full flex-col justify-between">
          <Sidebar />
          <UserProfile />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  )
}
