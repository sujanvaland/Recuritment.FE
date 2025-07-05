import { jwtVerify, SignJWT } from "jose"

// Secret key for JWT signing - in a real app, this would be an environment variable
const JWT_SECRET = new TextEncoder().encode("Sarvha-secret-key")
export const API_BASE_URL = "https://www.onemysetu.com/api";

export type UserRole = "employer" | "job-seeker"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string,
  roles?:  string,
  role: UserRole
  company?: string
  title?: string
  createdAt: string
}

// Dummy users data
export const users: User[] = [
  {
    id: "1",
    email: "employer@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "employer",
    company: "TechCorp",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "jobseeker@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "job-seeker",
    title: "Frontend Developer",
    createdAt: new Date().toISOString(),
  },
]

// Function to create a JWT token
export async function createToken(user: Omit<User, "password">) {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

// Function to verify a JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

// Function to find a user by email
export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id)
}

// Function to add a new user
export function addUser(user: Omit<User, "id" | "createdAt">) {
  const newUser = {
    ...user,
    id: (users.length + 1).toString(),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  return newUser
}
