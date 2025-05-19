import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { MainLayout } from "@/components/layouts/main-layout"
import { Dashboard } from "@/features/dashboard/screens/dashboard"

export default async function HomePage() {
  // Await cookies() to get ReadonlyRequestCookies
  const cookieStore = await cookies()
  const hasAuthCookie = cookieStore.has("accessToken")

  // If no auth cookie, redirect to login
  if (!hasAuthCookie) {
    redirect("/login")
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  )
}
