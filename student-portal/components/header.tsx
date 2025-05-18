"use client"

import { useState } from "react"
import { Bell, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MainSidebar } from "@/components/main-sidebar"
import { useAppSelector } from "@/lib/redux/hooks"

export function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MainSidebar />
        </SheetContent>
      </Sheet>

      {showSearch ? (
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
          <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setShowSearch(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="icon" className="shrink-0" onClick={() => setShowSearch(true)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      )}

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="outline" size="icon" className="shrink-0">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
