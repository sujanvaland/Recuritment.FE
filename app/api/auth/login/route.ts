import { type NextRequest, NextResponse } from "next/server"
import { createToken, findUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // In a real app, you would validate the email and password format here
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find the user by email
    const user = findUserByEmail(email)

    // In a real app, you would hash the password and compare it with the stored hash
    // For this demo, we'll just check if the user exists with the provided email
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // For demo purposes, we'll accept any password for the dummy users
    // In a real app, you would verify the password here

    // Create a JWT token
    const token = await createToken(user)

    // Create the response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
        title: user.title,
      },
      token,
    })

    // Set the token as a cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
