"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  UserCircle,
  Users,
  LogOut,
} from "lucide-react"
import { useAppDispatch } from "@/store"
import { logoutUser } from "@/store/slices/auth-slice"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin portal",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
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
      name: "Lecturers",
      href: "/lecturers",
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      name: "Users",
      href: "/users",
      icon: <Users className="h-5 w-5" />,
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
    <div className="flex h-full flex-col border-r bg-white shadow-sm">
      <div className="flex h-16 items-center border-b bg-indigo-600 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg">LearnSmart Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
