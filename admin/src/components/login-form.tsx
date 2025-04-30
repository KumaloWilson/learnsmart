"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { School2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useToast } from "./ui/use-toast"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return // Prevent multiple submissions

    setIsLoading(true)
    setError(null)
    console.log("LoginForm: Attempting to log in with:", values.email)

    try {
      // Direct implementation of login logic
      console.log("LoginForm: Processing login directly")

      // For demo purposes, accept any credentials
      // In a real app, this would validate against your API

      // Create mock user data
      const userData = {
        id: "1",
        email: values.email,
        name: values.email.split("@")[0],
        role: "admin",
      }

      // Store in localStorage
      localStorage.setItem("token", "mock-token-12345")
      localStorage.setItem("refreshToken", "mock-refresh-token-12345")
      localStorage.setItem("userData", JSON.stringify(userData))

      console.log("LoginForm: Login successful, stored user data")

      // Show success message
      toast({
        title: "Login successful",
        description: "Welcome to Learn Smart Admin",
      })

      // Redirect to dashboard
      console.log("LoginForm: Redirecting to dashboard")
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("LoginForm: Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "Please check your credentials and try again"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <School2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Learn Smart Admin</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access the admin portal</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">Admin access only. Contact system administrator for support.</p>
      </CardFooter>
    </Card>
  )
}
