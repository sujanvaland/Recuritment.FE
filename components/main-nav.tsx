"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LogOut, Menu, User, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const routes = [
    {
      href: "/jobs",
      label: "Find Jobs",
      active: pathname === "/jobs",
    },
    {
      href: "/employers",
      label: "For Employers",
      active: pathname === "/employers",
    },
    {
      href: "/pricing",
      label: "Pricing",
      active: pathname === "/pricing",
    }
  ]

  return (
    <div className="flex items-center">
      <div className="flex items-center md:gap-6">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">JobConnect</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-black" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={user.role === "employer" ? "/employers/dashboard" : "/dashboard"}>
                  <User className="mr-2 h-4 w-4" />
                  {user.firstName}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 bg-white p-4 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-black" : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={user.role === "employer" ? "/employers/dashboard" : "/dashboard"}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
