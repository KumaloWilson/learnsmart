import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is the login page
  const isLoginPage = path === "/login"

  // Check if the user is authenticated
  const token = request.cookies.get("token")?.value
  const isAuthenticated = !!token

  // If the user is not authenticated and not on the login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and on the login page, redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
