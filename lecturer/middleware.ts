import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/forgot-password" || path === "/reset-password"

  // Get the token from the cookies
  const token = request.cookies.get("accessToken")?.value || ""

  // If the path requires authentication and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and tries to access a public path, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
