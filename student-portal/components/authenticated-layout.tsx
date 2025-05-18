"use client"

import type React from "react"

import { MainSidebar } from "@/components/main-sidebar"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAppSelector } from "@/lib/redux/hooks"

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return null // Don't render anything if not authenticated
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
        <MainSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 w-full h-full overflow-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
