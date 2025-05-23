import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Add paths that require authentication
const protectedPaths = ["/dashboard", "/employers/dashboard"]

// Add paths that should redirect authenticated users
const authPaths = ["/auth/login", "/auth/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie
  const token = request.cookies.get("token")?.value

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((pp) => pathname.startsWith(pp))
  const isAuthPath = authPaths.some((ap) => pathname === ap)

  // If there's no token and the path is protected, redirect to login
  if (!token && isProtectedPath) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // If there's a token
  if (token) {
    try {
      // Verify the token
      const payload = await verifyToken(token)

      // If the token is valid and the user is on an auth path, redirect to dashboard
      if (payload && isAuthPath) {
        const role = payload.role as string
        const redirectPath = role === "employer" ? "/employers/dashboard" : "/dashboard"
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }

      // If the token is valid and the path is protected, check role-based access
      if (payload && isProtectedPath) {
        const role = payload.role as string

        // Check if employer is trying to access job seeker dashboard or vice versa
        if (pathname.startsWith("/employers/dashboard") && role !== "employer") {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        if (pathname.startsWith("/dashboard") && role !== "job-seeker") {
          return NextResponse.redirect(new URL("/employers/dashboard", request.url))
        }
      }
    } catch (error) {
      // If token verification fails, clear the token
      const response = NextResponse.next()
      response.cookies.delete("token")
      return response
    }
  }

  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    "/((?!api/|_next/|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.gif$).*)",
  ],
}
