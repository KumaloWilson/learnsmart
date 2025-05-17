"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth/auth-context"
import { useChangePassword, useProfile } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { user, lecturerProfile } = useAuth()
  const {
    changePassword,
    isLoading: isChangingPassword,
    error: passwordError,
    success: passwordSuccess,
  } = useChangePassword()
  const { updateProfile, isLoading: isUpdatingProfile, error: profileError } = useProfile()
  const { toast } = useToast()

  // Profile form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [title, setTitle] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [bio, setBio] = useState("")
  const [officeLocation, setOfficeLocation] = useState("")
  const [officeHours, setOfficeHours] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordValidationError, setPasswordValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
    }

    if (lecturerProfile) {
      setDepartment(lecturerProfile.department?.name || "")
      setTitle(lecturerProfile.title || "")
      setSpecialization(lecturerProfile.specialization || "")
      setBio(lecturerProfile.bio || "")
      setOfficeLocation(lecturerProfile.officeLocation || "")
      setOfficeHours(lecturerProfile.officeHours || "")
      setPhoneNumber(lecturerProfile.phoneNumber || "")
    }
  }, [user, lecturerProfile])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({ firstName, lastName, bio, officeLocation, officeHours, phoneNumber })
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordValidationError(null)

    if (newPassword !== confirmPassword) {
      setPasswordValidationError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordValidationError("Password must be at least 8 characters long")
      return
    }

    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })
    } catch (err) {
      // Error is handled by the hook
    }
  }

  if (!user || !lecturerProfile) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <PageContainer title="Profile" description="Manage your personal information and settings">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          {profileError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="grid gap-6 md:grid-cols-[200px_1fr] items-start">
              <Card>
                <CardContent className="p-4 flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback>{`${firstName.charAt(0)}${lastName.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                  <Button size="sm">Change Photo</Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={department} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" value={specialization} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="officeLocation">Office Location</Label>
                    <Input
                      id="officeLocation"
                      value={officeLocation}
                      onChange={(e) => setOfficeLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officeHours">Office Hours</Label>
                    <Input id="officeHours" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>

                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="account">
          {(passwordError || passwordValidationError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{passwordError || passwordValidationError}</AlertDescription>
            </Alert>
          )}

          {passwordSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{passwordSuccess}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isChangingPassword}
              />
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
