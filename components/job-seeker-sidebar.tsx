"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, FileText, Heart, Home, LogOut, MessageSquare, Settings, User } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function JobSeekerSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    
    <div className="flex h-screen w-64 flex-col border-r bg-[#608d89]">
      <div className="flex h-16 items-center border-b px-6 bg-black">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-[#309689]" />
          <span className="font-bold text-white">Job Seeker Portal</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          <Link
            href="/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm text font-medium ${
              pathname === "/dashboard"
                ? "bg-slate-100 text-black-900"
                : "text-black-600 hover:bg-slate-50 hover:text-black-900"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/applications"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              pathname === "/dashboard/applications"
                ? "bg-slate-100 text-black-900"
                : "text-black-600 hover:bg-slate-50 hover:text-black-900"
            }`}
          >
            <FileText className="mr-3 h-5 w-5" />
            Applications
          </Link>
          <Link
            href="/dashboard/saved-jobs"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              pathname === "/dashboard/saved-jobs"
                ? "bg-slate-100 text-black-900"
                : "text-black-600 hover:bg-slate-50 hover:text-black-900"
            }`}
          >
            <Heart className="mr-3 h-5 w-5" />
            Saved Jobs
          </Link>
          <Link
            href="/dashboard/messages"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              pathname === "/dashboard/messages"
                ? "bg-slate-100 text-black-900"
                : "text-black-600 hover:bg-slate-50 hover:text-black-900"
            }`}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Messages
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              pathname === "/dashboard/profile"
                ? "bg-slate-100 text-black-900"
                : "text-black-600 hover:bg-slate-50 hover:text-black-900"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              pathname === "/dashboard/settings"
                ? "bg-slate-100 text-black-900"
                : "text-black-600 hover:bg-slate-50 hover:text-black-900"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          <div>
            <div className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-slate-500 text-white">Job Seeker</div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4 text-[#309689]" />
          Logout
        </Button>
      </div>
    </div>
  )
}
