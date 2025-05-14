"use client"

import {
  BookOpen,
  Calendar,
  ChevronDown,
  GraduationCap,
  Home,
  LineChart,
  LogOut,
  Settings,
  User,
  Users,
  Video,
  Bell,
  ClipboardList,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { useLogout } from "@/lib/auth/hooks"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, lecturerProfile, isAuthenticated } = useAuth()
  const { logout, isLoading: isLoggingOut } = useLogout()

  // Don't render the sidebar on login, forgot password, and reset password pages
  if (pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password" || !isAuthenticated) {
    return null
  }

  const menuItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Students", href: "/students", icon: Users },
    { name: "Attendance", href: "/attendance", icon: Calendar },
    { name: "Virtual Classes", href: "/virtual-classes", icon: Video },
    { name: "Performance Analytics", href: "/performance-analytics", icon: LineChart },
    { name: "Progress", href: "/progress", icon: TrendingUp },
    { name: "Assessments", href: "/assessments", icon: ClipboardList },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ]

  const getInitials = () => {
    if (!user) return "U"
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
  }

  const getFullName = () => {
    if (!user) return "User"
    return `${user.firstName} ${user.lastName}`
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">SmartLearn</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder-user.jpg" alt={getFullName()} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <span>{getFullName()}</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
