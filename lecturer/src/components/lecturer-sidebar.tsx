"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Courses",
    icon: BookOpen,
    href: "/courses",
    color: "text-violet-500",
  },
  {
    label: "Students",
    icon: Users,
    href: "/students",
    color: "text-pink-700",
  },
  {
    label: "Assessments",
    icon: FileText,
    href: "/assessments",
    color: "text-orange-500",
  },
  {
    label: "Virtual Classes",
    icon: Video,
    href: "/virtual-classes",
    color: "text-emerald-500",
  },
  {
    label: "Teaching Materials",
    icon: FileText,
    href: "/materials",
    color: "text-blue-500",
  },
  {
    label: "Quizzes",
    icon: GraduationCap,
    href: "/quizzes",
    color: "text-yellow-500",
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/schedule",
    color: "text-green-500",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/messages",
    color: "text-violet-500",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-pink-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function LecturerSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <GraduationCap className="h-6 w-6" />
              <span>Learn Smart</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    pathname === route.href ? "bg-accent" : "transparent",
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  {route.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t p-4">
              <Link
                href="/login"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Link>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className={cn("hidden border-r md:flex md:w-64 md:flex-col", className)}>
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GraduationCap className="h-6 w-6" />
            <span>Learn Smart</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === route.href ? "bg-accent" : "transparent",
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                {route.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t p-4">
            <Link href="/login" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent">
              <LogOut className="h-5 w-5" />
              Logout
            </Link>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
