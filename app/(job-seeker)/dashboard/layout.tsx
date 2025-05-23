"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, FileText, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { JobSeekerSidebar } from "@/components/job-seeker-sidebar"

export default function JobSeekerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "job-seeker")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <JobSeekerSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/" className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6" />
                <span className="font-bold">JobConnect</span>
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/jobs">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <span className="hidden text-sm font-medium md:block">
                  {user.firstName} {user.lastName}
                </span>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
