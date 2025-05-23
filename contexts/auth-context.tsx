"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  error: string | null
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  company?: string
  title?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)

            // Add redirection based on user role if on the homepage
            if (
              window.location.pathname === "/" ||
              window.location.pathname === "/auth/login" ||
              window.location.pathname === "/auth/register"
            ) {
              if (data.user.role === "employer") {
                router.push("/employers/dashboard")
              } else {
                router.push("/dashboard")
              }
            }
          } else {
            // If the token is invalid, clear it
            localStorage.removeItem("token")
          }
        } catch (error) {
          console.error("Auth check error:", error)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const login = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Save the token to localStorage
      localStorage.setItem("token", data.token)

      // Set the user in state
      setUser(data.user)

      // Redirect based on user role
      if (data.user.role === "employer") {
        router.push("/employers/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError((error as Error).message)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setError(null)
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Registration failed")
      }

      // Save the token to localStorage
      localStorage.setItem("token", responseData.token)

      // Set the user in state
      setUser(responseData.user)

      // Redirect based on user role
      if (responseData.user.role === "employer") {
        router.push("/employers/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError((error as Error).message)
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, error }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
