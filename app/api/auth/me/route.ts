import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    // Verify the token
    const payload = await verifyToken(token)
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Find the user
    const user = findUserByEmail(payload.email as string)
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
    console.error("Auth error:", error)
    return NextResponse.json({ error: "An error occurred during authentication" }, { status: 500 })
  }
}
