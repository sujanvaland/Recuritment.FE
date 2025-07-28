"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Briefcase,
  Building,
  Calendar,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react" 

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function EmployerSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
     <div className="flex h-screen w-64 flex-col border-r bg-[#608d89]">
       <div className="flex h-16 items-center border-b px-6 bg-black">
        <div className="flex items-center gap-2 text-[#309689]">
          <Building className="h-6 w-6" />
          <span className="font-bold text-white">Employer Portal</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          <Link
            href="/employers/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/employers/dashboard/jobs"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/jobs"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <Briefcase className="mr-3 h-5 w-5" />
            Jobs
          </Link>
          <Link
            href="/employers/dashboard/applications"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/applications"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <FileText className="mr-3 h-5 w-5" />
            Applications
          </Link>
          <Link
            href="/employers/dashboard/candidates"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/candidates"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Candidates
          </Link>
          <Link
            href="/employers/dashboard/messages"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/messages"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Messages
          </Link>
          <Link
            href="/employers/dashboard/interviews"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/interviews"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Interviews
          </Link>
          {/* <Link
            href="/employers/dashboard/analytics"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/analytics"
              ? "bg-slate-100 text-black-900"
              : "text-black-600 hover:bg-slate-50 hover:text-black-900"
              }`}
          >
            <BarChart className="mr-3 h-5 w-5" />
            Analytics
          </Link> */}
          <Link
            href="/employers/dashboard/settings"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === "/employers/dashboard/settings"
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
            <div className="text-sm font-medium">{user?.company || "TechCorp"}</div>
            <div className="text-xs text-slate-500 text-white">Professional Plan</div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
