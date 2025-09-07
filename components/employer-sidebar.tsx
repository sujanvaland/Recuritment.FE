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
    <div className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-blue-600 via-purple-600 to-blue-800">
      <div className="flex h-16 items-center border-b border-white/20 px-6 bg-white/10">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-white" />
          <span className="font-bold text-white">Sarvaha</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          <Link
            href="/employers/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/employers/dashboard"
              ? "bg-white/20 text-white shadow"
              : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/employers/dashboard/jobs"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/employers/dashboard/jobs"
              ? "bg-white/20 text-white shadow"
              : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Briefcase className="mr-3 h-5 w-5" />
            Jobs
          </Link>
          <Link
            href="/employers/dashboard/applications"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/employers/dashboard/applications"
              ? "bg-white/20 text-white shadow"
              : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
          >
            <FileText className="mr-3 h-5 w-5" />
            Applications
          </Link>
          {/* <Link
            href="/employers/dashboard/candidates"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/employers/dashboard/candidates"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Candidates
          </Link> */}
          <Link
            href="/employers/dashboard/interviews"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/employers/dashboard/interviews"
              ? "bg-white/20 text-white shadow"
              : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Interviews
          </Link>
          <Link
            href="/employers/dashboard/settings"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/employers/dashboard/settings"
              ? "bg-white/20 text-white shadow"
              : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/20 p-4 bg-white/10">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
            <Building className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{user?.company || "TechCorp"}</div>
            <div className="text-xs text-white/80">Professional Plan</div>
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full justify-start bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold border-0 shadow-lg transition-all duration-200 hover:shadow-xl" 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
