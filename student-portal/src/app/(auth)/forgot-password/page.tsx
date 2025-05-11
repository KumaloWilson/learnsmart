"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { forgotPassword } from "@/lib/api/auth-api"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await forgotPassword(values.email)
      setIsSubmitted(true)
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "We couldn't process your request. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We`ve sent you an email with instructions to reset your password.
          </p>
          <div className="mt-6 text-center">
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              Return to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Reset your password</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your email address and we`ll send you a link to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
