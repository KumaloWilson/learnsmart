"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, GraduationCap, FileText, Video, ClipboardList } from "lucide-react"

interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/courses",
      active: pathname === "/courses" || pathname.startsWith("/courses/"),
    },
    {
      label: "Assessments",
      icon: <ClipboardList className="h-5 w-5" />,
      href: "/assessments",
      active: pathname === "/assessments" || pathname.startsWith("/assessments/"),
    },
    {
      label: "Quizzes",
      icon: <FileText className="h-5 w-5" />,
      href: "/quizzes",
      active: pathname === "/quizzes" || pathname.startsWith("/quizzes/"),
    },
    {
      label: "Virtual Classes",
      icon: <Video className="h-5 w-5" />,
      href: "/virtual-classes",
      active: pathname === "/virtual-classes" || pathname.startsWith("/virtual-classes/"),
    },
  ]

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 border-t bg-background", className)}>
      <div className="grid grid-cols-5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center py-2 text-xs font-medium",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.icon}
            <span className="mt-1">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
