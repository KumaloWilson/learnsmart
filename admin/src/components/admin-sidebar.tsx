"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store"
import { logoutUser } from "@/store/slices/auth-slice"
import { useToast } from "./ui/use-toast"


export function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Schools", href: "/schools", icon: Building2 },
    { name: "Departments", href: "/departments", icon: Building2 },
    { name: "Programs", href: "/programs", icon: GraduationCap },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Users", href: "/users", icon: Users },
    { name: "Semesters", href: "/semesters", icon: Calendar },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span>LearnSmart Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
