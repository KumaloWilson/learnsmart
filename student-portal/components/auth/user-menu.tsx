"use client"

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { logout } from "@/lib/redux/slices/authSlice"
import { clearStudentProfile } from "@/lib/redux/slices/studentSlice"
import { useLogoutMutation } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function UserMenu() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { profile } = useAppSelector((state) => state.student)
  const [logoutApi] = useLogoutMutation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Call logout API
      await logoutApi().unwrap()

      // Clear Redux state
      dispatch(logout())
      dispatch(clearStudentProfile())

      // Redirect to login
      router.push("/login")

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Logout failed:", error)

      // Even if API fails, clear local state
      dispatch(logout())
      dispatch(clearStudentProfile())
      router.push("/login")

      toast({
        title: "Logout issue",
        description: "There was an issue with the logout process, but you've been logged out locally.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent transition-colors">
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-primary/10 text-primary">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-sidebar-foreground/70 truncate">{profile?.program?.name || user.role}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-sidebar-foreground/70"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      </Button>
    </div>
  )
}
