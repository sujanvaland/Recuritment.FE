import { NextResponse } from "next/server"

export async function POST() {
  // Create a response
  const response = NextResponse.json({ success: true })

  // Clear the token cookie
  response.cookies.delete("token")

  return response
}
