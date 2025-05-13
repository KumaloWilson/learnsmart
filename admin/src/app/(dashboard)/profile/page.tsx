import { ProfileForm } from "@/components/auth/profile-form"
import { ChangePasswordForm } from "@/components/auth/change-password-form"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid gap-6">
        <ProfileForm />
        <ChangePasswordForm />
      </div>
    </div>
  )
}
