"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import type { User, UserRole } from "@/lib/auth"
import { API_BASE_URL } from "@/lib/auth"
import { DataService } from "@/services/axiosInstance";

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
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
      try {
        const response = await DataService.get("/auth/me");

        console.log('response', response);

        if (response.data) {
          setUser(response.data.user)

          // Add redirection based on user role if on the homepage or auth pages
          const currentPath = window.location.pathname
          if (currentPath === "/" || currentPath === "/auth/login" || currentPath === "/auth/register") {
            console.log("User role:", response.data.user.role) // Debug log
            if (response.data.user.role === "employer") {
              // router.push("/employers/dashboard")
              console.log('employers redirect');
              router.push("/")
            } else if (response.data.user.role === "job-seeker") {
              router.push("/dashboard")
              // router.push("/");
              console.log('jobseeker redirect');
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const login = async (email: string, password: string) => {
    console.log('logindetails', email, password);
    setError(null)
    setIsLoading(true)
    try {
      const response = await DataService.post("/auth/login", {
        email: email,
        password: password
      });

      console.log('login response', response.data);


      if (!response.data?.token) {
        throw new Error(response.data.error || "Login failed")
      }


      localStorage.setItem("token", response.data.token);
      // Set the user in state
      setUser(response.data.user)

      console.log("Login successful, user role:", response.data.user.roles) // Debug log

      // Redirect based on user role
      if (response.data.user.roles === "employer") {
        console.log("Redirecting to employer dashboard") // Debug log
        router.push("/employers/dashboard")
      } else if (response.data.user.roles === "job-seeker") {
        console.log("Redirecting to job seeker dashboard") // Debug log
        router.push("/job-seeker/dashboard")
      } else {
        console.error("Unknown user role:", response.data.user.roles) // Debug log
        router.push("/")
      }
    } catch (error) {
      setError((error as Error).message)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    console.log('data', data);
    setError(null)
    setIsLoading(true)
    try {
      const response = await DataService.post("/auth/register", {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        company: data.company || "",
        title: data.title || "",
      });

      console.log('regster responseData', response);

      if (!response.data.token) {
        throw new Error(response.data.error || "Registration failed")
      }

      // Set the user in state
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);

      // Redirect based on user role
      if (response.data.user.roles === "employer") {
        router.push("/employers/dashboard")
        console.log('employerdashboard');
      } else if (response.data.user.roles === "job-seeker") {
        console.log('jobseeker dashboard');
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    } catch (error) {
      setError((error as Error).message)
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call the logout API endpoint to clear the cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      })

      // Clear user state
      setUser(null)

      // Redirect to home page
      router.push("/")

      // Force a page refresh to ensure all state is cleared
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
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
