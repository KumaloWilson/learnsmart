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

  // Don't render the sidebar on authentication pages
  if (pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password") {
    return null
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const activeCourseId = "d7b74b44-b58e-4b24-887d-24f59b9285f0" // Replace with actual course ID retrieval logic

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
    {
      name: "Course Topics",
      href: `/courses/${activeCourseId}/topics`,   
      icon: BookOpen,
      current: pathname.includes(`/courses/${activeCourseId}/topics`),
      requiresCourseId: true,
    },
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
    <Sidebar className="border-r bg-card z-30 h-screen sticky top-0">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">LearnSmart</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Link href={item.href}>
                  <item.icon className={`h-5 w-5 ${pathname === item.href ? "text-primary" : ""}`} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="px-3 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2 hover:bg-muted/50">
              <Avatar className="h-8 w-8 border border-muted">
                <AvatarImage src="/placeholder-user.jpg" alt={getFullName()} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{getFullName()}</span>
                <span className="text-xs text-muted-foreground">Lecturer</span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
