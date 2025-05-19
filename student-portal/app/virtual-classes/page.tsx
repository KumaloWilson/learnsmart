import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { MainLayout } from "@/components/layouts/main-layout"
import { VirtualClasses } from "@/features/virtual-classes/screens/virtual-classes"

export default  async function VirtualClassesPage() {
  // Check for auth cookie on the server
// Check for auth cookie on the server
  const cookieStore = await cookies()
  const hasAuthCookie = cookieStore.has("accessToken")

  // If no auth cookie, redirect to login
  if (!hasAuthCookie) {
    redirect("/login")
  }
  // If no auth cookie, redirect to login
  if (!hasAuthCookie) {
    redirect("/login")
  }

  return (
    <MainLayout>
      <VirtualClasses />
    </MainLayout>
  )
}
