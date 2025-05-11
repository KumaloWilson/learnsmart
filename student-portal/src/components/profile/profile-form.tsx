"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateProfile, uploadProfileImage } from "@/lib/api/profile-api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return

    try {
      await updateProfile(user.id, data)
      updateUser(data)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      })
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user?.id) return

    const file = e.target.files[0]
    setIsUploading(true)

    try {
      const result = await uploadProfileImage(user.id, file)
      setAvatarUrl(result.avatarUrl)
      updateUserData({ ...user, avatarUrl: result.avatarUrl })

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error uploading your profile picture. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and profile settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || "/placeholder.svg?height=96&width=96"} alt={user?.firstName || "User"} />
              <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Change Profile Picture
                    </>
                  )}
                </div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </Label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder="Enter your first name"
                error={form.formState.errors.firstName?.message}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder="Enter your last name"
                error={form.formState.errors.lastName?.message}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Enter your email"
              error={form.formState.errors.email?.message}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" {...form.register("phone")} placeholder="Enter your phone number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Tell us a little about yourself"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
