"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import type { User, UserRole } from "@/lib/auth"
import { API_BASE_URL } from "@/lib/auth"
import { DataService } from "@/services/axiosInstance";
import { set } from "date-fns";

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

// Helper function to get user role safely (handles both 'role' and 'roles' properties)
const getUserRole = (user: any): string | null => {
  return user?.role || user?.roles || null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await DataService.get("/auth/me");

        console.log('response auth', response);

        if (response.data && response.data.user) {
          // Set the user in state
          setUser(response.data.user);
          
          // Add redirection based on user role if on the homepage or auth pages
          const currentPath = window.location.pathname
          if (currentPath === "/" || currentPath === "/auth/login" || currentPath === "/auth/register") {
            const userRole = getUserRole(response.data.user);
            console.log("User role:", userRole) // Debug log
            if (userRole === "employer") {
              console.log('employers redirect');
              router.push("/employers/dashboard")
            } else if (userRole === "job-seeker") {
              router.push("/dashboard")
              // router.push("/");
              console.log('jobseeker redirect');
            }
          }
        } else {
          // Token is invalid, clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router]) // Remove user from dependencies to prevent infinite loop

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

      // Check if we have a token and user data, regardless of success flag
      if (!response.data?.token || !response.data?.user) {
        throw new Error(response.data?.message || response.data?.error || "Login failed")
      }

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      const userRole = getUserRole(response.data.user);
      console.log("Login successful, user role:", userRole) // Debug log

      // Redirect based on user role after successful login
      if (userRole === "employer") {
        console.log('employers redirect after login');
        router.push("/employers/dashboard")
      } else if (userRole === "job-seeker") {
        console.log('jobseeker redirect after login');
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
      } else {
        // Set the user in state
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        router.push("/auth/login")
      }


      // Redirect based on user role
      // const userRole = getUserRole(response.data.user);
      // if (userRole === "employer") {
      //   router.push("/employers/dashboard")
      //   console.log('employerdashboard');
      // } else if (userRole === "job-seeker") {
      //   console.log('jobseeker dashboard');
      //   router.push("/dashboard")
      // } else {
      //}
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
      localStorage.clear();
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
