"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAppSelector } from "@/lib/redux/hooks"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { NotificationCenter } from "@/components/notification-center"
import { Home, BookOpen, Video, Calendar, BarChart2, Award, FileText } from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { profile } = useAppSelector((state) => state.student)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="font-bold text-xl">LearnSmart</div>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/")}>
              <Link href="/">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/courses")}>
              <Link href="/courses">
                <BookOpen />
                <span>Courses</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/virtual-classroom")}>
              <Link href="/virtual-classroom">
                <Video />
                <span>Virtual Classroom</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/attendance")}>
              <Link href="/attendance">
                <Calendar />
                <span>Attendance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/performance")}>
              <Link href="/performance">
                <BarChart2 />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/quiz-history")}>
              <Link href="/quiz-history">
                <FileText />
                <span>Quiz History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/recommendations")}>
              <Link href="/recommendations">
                <Award />
                <span>Recommendations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <UserMenu />
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export { AppSidebar as Sidebar }
