import type React from "react"
import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden lg:flex" />
        <main className="flex-1 p-4 md:p-6">
          <MobileNav className="lg:hidden mb-6" />
          <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
