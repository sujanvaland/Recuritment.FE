"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Clock, FileText, Heart, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function JobSeekerDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "job-seeker")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.firstName}! Here's an overview of your job search.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 new applications this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">6 added this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next interview in 2 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">32 views this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Recent Applications</h2>
        <div className="rounded-md border">
          <div className="grid grid-cols-6 border-b bg-slate-50 p-3 text-sm font-medium">
            <div className="col-span-2">Job Title</div>
            <div className="col-span-1">Company</div>
            <div className="col-span-1">Date Applied</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((job) => (
              <div key={job} className="grid grid-cols-6 items-center p-3">
                <div className="col-span-2 font-medium">Senior Frontend Developer</div>
                <div className="col-span-1">TechCorp</div>
                <div className="col-span-1 text-sm text-muted-foreground">2 days ago</div>
                <div className="col-span-1">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    In Review
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Recommended Jobs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((job) => (
            <Card key={job}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Frontend Developer</CardTitle>
                    <CardDescription>WebTech • San Francisco, CA</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs">React</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs">TypeScript</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs">Next.js</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">$120K - $150K</span>
                  <Button size="sm">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            View More Jobs
          </Button>
        </div>
      </div>
    </div>
  )
}
