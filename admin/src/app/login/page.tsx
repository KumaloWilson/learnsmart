"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store"
import { loginUser } from "@/store/slices/auth-slice"
import { LoginForm } from "@/components/login-form"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Track authentication state from the Redux store
  const { isAuthenticated, error } = useAppSelector((state) => state.auth)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Show error toast if login fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await dispatch(loginUser(credentials)).unwrap()
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in",
      })
      router.push("/")
    } catch (error) {
      // Error is handled by the error effect above
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">LearnSmart Admin</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to access the administration portal</p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center bg-indigo-600 px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative h-full w-full max-w-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold">LearnSmart LMS</h1>
                <p className="mt-4 text-xl">Empowering Education Through Technology</p>
              </div>
            </div>
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
              </svg>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
