import { type NextRequest, NextResponse } from "next/server"
import { addUser, createToken, findUserByEmail, type UserRole } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await request.json()

    // In a real app, you would validate the input data here
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if the user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // In a real app, you would hash the password before storing it
    // Create a new user
    const newUser = addUser({
      email,
      firstName,
      lastName,
      role: role as UserRole,
      // Add company or title based on role
      ...(role === "employer" ? { company: "" } : { title: "" }),
    })

    // Create a JWT token
    const token = await createToken(newUser)

    // Create the response
    const response = NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        company: newUser.company,
        title: newUser.title,
      },
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
