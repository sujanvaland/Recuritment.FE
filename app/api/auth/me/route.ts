import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, findUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Verify the token
    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Find the user by ID
    const user = findUserById(payload.id as string)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

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
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
