"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  School2,
  Settings,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../hooks/use-auth"
import { cn } from "../lib/utils"

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  title: string
}

function SidebarItem({ href, icon: Icon, title }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  )
}

export function AdminSidebar() {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen w-64 flex-col border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <School2 className="h-6 w-6" />
          <span>Learn Smart Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          <SidebarItem href="/" icon={LayoutDashboard} title="Dashboard" />
          <SidebarItem href="/schools" icon={Building2} title="Schools" />
          <SidebarItem href="/departments" icon={Library} title="Departments" />
          <SidebarItem href="/programs" icon={GraduationCap} title="Programs" />
          <SidebarItem href="/courses" icon={BookOpen} title="Courses" />
          <SidebarItem href="/semesters" icon={Calendar} title="Semesters" />
          <SidebarItem href="/users" icon={Users} title="Users" />
          <SidebarItem href="/reports" icon={BarChart3} title="Reports" />
          <SidebarItem href="/settings" icon={Settings} title="Settings" />
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
