"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  type LucideIcon,
  School,
  Users,
  UserCog,
  Bell,
  Building2,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "School Management",
    href: "/school",
    icon: School,
  },
  {
    title: "Departments",
    href: "/departments",
    icon: Building2,
  },
  {
    title: "Programs",
    href: "/programs",
    icon: Home,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Periods",
    href: "/periods",
    icon: Calendar,
  },
  {
    title: "Semesters",
    href: "/semesters",
    icon: Calendar,
  },
  {
    title: "Students",
    href: "/students",
    icon: GraduationCap,
  },
  {
    title: "Lecturers",
    href: "/lecturers",
    icon: UserCog,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logoutUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="flex flex-col w-64 border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <School className="h-6 w-6" />
          <span className="text-xl">SmartLearn</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex flex-col gap-2">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === "/profile" && "bg-muted text-primary",
            )}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-3 px-3 py-2 h-auto font-normal text-sm text-muted-foreground hover:text-primary"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "Loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
