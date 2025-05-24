import { type NextRequest, NextResponse } from "next/server"
import { findUserById, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const payload = await verifyToken(token)

    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Find the user by ID
    const user = findUserById(payload.sub)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return the user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
        title: user.title,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
