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
    // {
    //   href: "/pricing",
    //   label: "Pricing",
    //   active: pathname === "/pricing",
    // }
  ]

  return (
     <div className="w-full bg-black">
      <div className="mx-auto w-full" style={{ maxWidth: 1400 }}> 
      <nav className="relative flex w-full items-center h-16">
      {/* Logo - Left */}
      <div className="flex items-center min-w-[170px]">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-[#e1bd00]" />
          <span className="text-2xl font-bold text-white">Sarvah Logo</span>
        </Link>
      </div>
      {/* Nav Links - Center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-8">
        <Link
          href="/"
          className={cn(
            "font-medium hover:text-[#e1bd00] text-white transition-colors",
            pathname === "/" && "text-[#e1bd00]"
          )}
        >
          Home
        </Link>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "font-medium hover:text-[#e1bd00] text-white transition-colors",
              route.active && "text-[#e1bd00]"
            )}
          >
            {route.label}
          </Link>
        ))}
        <Link
          href="/about"
          className={cn(
            "font-medium hover:text-[#e1bd00] text-white transition-colors",
            pathname === "/about" && "text-[#e1bd00]"
          )}
        >
          About Us
        </Link>
        <Link
          href="/contact"
          className={cn(
            "font-medium hover:text-[#e1bd00] text-white transition-colors",
            pathname === "/contact" && "text-[#e1bd00]"
          )}
        >
          Contact Us
        </Link>
      </div>
      {/* Auth Buttons - Right */}
      <div className="ml-auto flex items-center gap-4 min-w-[170px] justify-end">
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white hover:text-emerald-400">
                <Link href={user.role === "employer" ? "/employers/dashboard" : "/dashboard"}>
                  <User className="mr-2 h-4 w-4" />
                  {user.firstName}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:text-emerald-400">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="font-medium text-white hover:text-emerald-400 transition-colors px-3 py-1 rounded">
                Login
              </Link>
              <Link href="/auth/register">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded transition">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 bg-[#181c1f] p-4 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={cn(
                "text-base font-medium hover:text-[#e1bd00] text-white transition-colors",
                pathname === "/" && "text-[#e1bd00]"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-base font-medium hover:text-[#e1bd00] text-white transition-colors",
                  route.active && "text-[#e1bd00]"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <Link
              href="/about"
              className={cn(
                "text-base font-medium hover:text-[#e1bd00] text-white transition-colors",
                pathname === "/about" && "text-[#e1bd00]"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={cn(
                "text-base font-medium hover:text-[#e1bd00] text-white transition-colors",
                pathname === "/contact" && "text-[#e1bd00]"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" className="text-white hover:text-emerald-400">
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
                    className="text-white hover:text-emerald-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="font-medium text-white hover:text-emerald-400 transition-colors px-3 py-1 rounded" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded transition w-full">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </nav>
    </div>
    </div>
   
  )
}
