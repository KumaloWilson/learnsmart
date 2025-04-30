"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  School2,
  LayoutDashboard,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Settings,
  BarChart3,
  Menu,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Schools",
    href: "/schools",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Departments",
    href: "/departments",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Programs",
    href: "/programs",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Semesters",
    href: "/semesters",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData))
      } catch (e) {
        console.error("Failed to parse user data:", e)
      }
    }
  }, [])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userData")

    // Redirect to login
    router.push("/login")
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                <School2 className="h-6 w-6" />
                Learn Smart Admin
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-1 overflow-auto py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
                    pathname === item.href ? "bg-muted" : "transparent",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
            {userData && (
              <div className="border-t p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{userData.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <School2 className="h-6 w-6" />
          <span className="font-semibold">Learn Smart Admin</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-10">
        <div className="flex flex-col h-full border-r bg-background">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <School2 className="h-6 w-6" />
            <span className="font-semibold">Learn Smart Admin</span>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
                  pathname === item.href ? "bg-muted" : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
          {userData && (
            <div className="border-t p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
