"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  Home,
  LayoutDashboard,
  School,
  Settings,
  FileText,
  Video,
  CheckSquare,
  LineChart,
  UserCircle,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Schools",
      href: "/schools",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      name: "Departments",
      href: "/departments",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Programs",
      href: "/programs",
      icon: <School className="h-5 w-5" />,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Semesters",
      href: "/semesters",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Students",
      href: "/students",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      name: "Quizzes",
      href: "/quizzes",
      icon: <FileText className="h-5 w-5" />,
    },
    
    {
      name: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <UserCircle className="h-6 w-6" />
          <span>LearnSmart Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="grid gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                  isActive(item.href) ? "bg-gray-100 text-gray-900" : "text-gray-500",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
