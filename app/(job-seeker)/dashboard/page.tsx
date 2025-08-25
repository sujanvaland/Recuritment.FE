"use client"
import { useState, useEffect } from "react"
import { Briefcase, Clock, FileText, Heart, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/services/axiosInstance"
import { getRelativeTime } from "@/components/Uitility/Timeformat"

// Define interfaces for better type safety
interface JobApplication {
  appliedId: string | number
  jobId: string | number
  title: string
  company: string
  appliedAt: string
  applicationStatus: string
}

interface DashboardData {
  totalAppliedJobs?: number
  totalSavedJobs?: number
  totalInterviews?: number
  jobsApplied?: JobApplication[]
}


export default function JobSeekerDashboardPage() {
  const { user } = useAuth() // Uncommented this line
  const [jobs, setJobs] = useState<DashboardData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await DataService.get("profile/GetJob-Seeker_Dashboard")
      if (response.status === 200) {
        setJobs(response.data || {})
      }
    } catch (error) {
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchJobs} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here's an overview of your job search.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.totalAppliedJobs ?? 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.totalSavedJobs ?? 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.totalInterviews ?? 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
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
            {jobs?.jobsApplied && jobs.jobsApplied.length > 0 ? (
              jobs.jobsApplied.map((job) => (
                <div key={job.appliedId} className="grid grid-cols-6 items-center p-3">
                  <div className="col-span-2 font-medium">{job.title || 'N/A'}</div>
                  <div className="col-span-1">{job.company || 'N/A'}</div>
                  <div className="col-span-1 text-sm text-muted-foreground">
                    {job.appliedAt ? getRelativeTime(job.appliedAt) : 'N/A'}
                  </div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      job.applicationStatus === 'applied' 
                        ? 'bg-blue-100 text-blue-800'
                        : job.applicationStatus === 'interview'
                        ? 'bg-yellow-100 text-yellow-800'
                        : job.applicationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {job.applicationStatus || 'Pending'}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Briefcase className="mx-auto h-12 w-12 opacity-50 mb-4" />
                <p>No job applications yet</p>
                <p className="text-sm">Start applying to jobs to see them here!</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {false && <div className="mt-8">
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
      }

    </>
  )
}