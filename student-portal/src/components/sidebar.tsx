"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Calendar,
  FileText,
  Video,
  ClipboardList,
  BrainCircuit,
  UserCircle,
  LogOut,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: <GraduationCap className="mr-2 h-4 w-4" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Courses",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      href: "/courses",
      active: pathname === "/courses" || pathname.startsWith("/courses/"),
    },
    {
      label: "Assessments",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      href: "/assessments",
      active: pathname === "/assessments" || pathname.startsWith("/assessments/"),
    },
    {
      label: "Quizzes",
      icon: <FileText className="mr-2 h-4 w-4" />,
      href: "/quizzes",
      active: pathname === "/quizzes" || pathname.startsWith("/quizzes/"),
    },
    {
      label: "Virtual Classes",
      icon: <Video className="mr-2 h-4 w-4" />,
      href: "/virtual-classes",
      active: pathname === "/virtual-classes" || pathname.startsWith("/virtual-classes/"),
    },
    {
      label: "Materials",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      href: "/materials",
      active: pathname === "/materials" || pathname.startsWith("/materials/"),
    },
    {
      label: "Performance",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      href: "/performance",
      active: pathname === "/performance",
    },
    {
      label: "Attendance",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      href: "/attendance",
      active: pathname === "/attendance",
    },
    {
      label: "Recommendations",
      icon: <BrainCircuit className="mr-2 h-4 w-4" />,
      href: "/recommendations",
      active: pathname === "/recommendations",
    },
    {
      label: "Profile",
      icon: <UserCircle className="mr-2 h-4 w-4" />,
      href: "/profile",
      active: pathname === "/profile",
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">Learn Smart</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      route.active ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
