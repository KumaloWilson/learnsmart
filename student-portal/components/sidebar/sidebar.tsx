"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Video,
  BarChart,
  FileText,
  History,
  Calendar,
  GraduationCap,
  Lightbulb,
} from "lucide-react"
import { Logo } from "@/components/sidebar/logo"

export function Sidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Assessments", href: "/assessments", icon: ClipboardCheck },
    { name: "Virtual Classes", href: "/virtual-classes", icon: Video },
  ]

  const learningNavItems = [
    { name: "Performance", href: "/performance", icon: BarChart },
    { name: "Course Materials", href: "/course-materials", icon: FileText },
    { name: "Quiz History", href: "/quiz-history", icon: History },
    { name: "Attendance", href: "/attendance", icon: Calendar },
  ]

  const recordsNavItems = [
    { name: "Academic Records", href: "/academic-records", icon: GraduationCap },
    { name: "AI Recommendations", href: "/ai-recommendations", icon: Lightbulb },
  ]

  return (
    <div className="flex flex-col space-y-6 py-4">
      <div className="px-4">
        <Logo />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</h3>
          <nav className="mt-2 space-y-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                name={item.name}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Learning</h3>
          <nav className="mt-2 space-y-1">
            {learningNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                name={item.name}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Records</h3>
          <nav className="mt-2 space-y-1">
            {recordsNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                name={item.name}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  name: string
  isActive: boolean
}

function NavItem({ href, icon: Icon, name, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
      {name}
    </Link>
  )
}
