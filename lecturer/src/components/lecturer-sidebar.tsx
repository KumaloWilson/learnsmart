"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function LecturerSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()

  // Skip rendering sidebar on login page
  if (pathname === "/login") {
    return null
  }

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>Learn Smart</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Collapse Sidebar</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/courses"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/courses" || pathname.startsWith("/courses/")
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>
            <Link
              href="/assessments"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/assessments" || pathname.startsWith("/assessments/")
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <ClipboardList className="h-4 w-4" />
              <span>Assessments</span>
            </Link>
            <Link
              href="/quizzes"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/quizzes" || pathname.startsWith("/quizzes/")
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <ClipboardList className="h-4 w-4" />
              <span>Quizzes</span>
            </Link>
            <Link
              href="/materials"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/materials" || pathname.startsWith("/materials/")
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Materials</span>
            </Link>
            <Link
              href="/virtual-classes"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/virtual-classes" || pathname.startsWith("/virtual-classes/")
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <Video className="h-4 w-4" />
              <span>Virtual Classes</span>
            </Link>
            <Link
              href="/calendar"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/calendar" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Link>
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <User className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <nav className="mt-2 grid gap-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  )
}
