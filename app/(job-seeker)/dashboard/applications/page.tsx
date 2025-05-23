"use client"

import { useEffect, useState } from "react"
import { Archive, CheckCircle, Clock, Eye, FileText, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { getJobApplications } from "@/lib/actions"

// Types for job applications
interface JobApplication {
  id: string
  jobId: number
  userId: string
  coverLetter: string
  resumeUrl: string
  status: "applied" | "interview" | "offer" | "rejected"
  appliedDate: string
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userApplications = await getJobApplications(user.id)
        setApplications(userApplications)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [user])

  // Mock job data to match applications
  const mockJobs = {
    1: {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      logo: "/abstract-tc.png",
    },
    2: {
      title: "UX Designer",
      company: "Design Studio",
      location: "Remote",
      logo: "/abstract-data-stream.png",
    },
    3: {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "New York, NY",
      logo: "/abstract-geometric-sx.png",
    },
    4: {
      title: "Product Manager",
      company: "ProductLabs",
      location: "Austin, TX",
      logo: "/abstract-geometric-shapes.png",
    },
  }

  // Helper function to get status badge
  function getStatusBadge(status: string) {
    switch (status) {
      case "applied":
        return (
          <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
            <Clock className="h-3 w-3" />
            <span>Applied</span>
          </div>
        )
      case "interview":
        return (
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-600">
            <FileText className="h-3 w-3" />
            <span>Interview</span>
          </div>
        )
      case "offer":
        return (
          <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>Offer</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
            <X className="h-3 w-3" />
            <span>Rejected</span>
          </div>
        )
      default:
        return null
    }
  }

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "active") {
      return app.status === "applied" || app.status === "interview"
    } else {
      return app.status === "offer" || app.status === "rejected"
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Applications</h2>
        <p className="text-muted-foreground">Track and manage your job applications</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-md bg-slate-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded-md bg-slate-200"></div>
                          <div className="h-3 w-32 rounded-md bg-slate-200"></div>
                        </div>
                      </div>
                      <div className="h-6 w-24 rounded-full bg-slate-200"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const job = mockJobs[application.jobId as keyof typeof mockJobs] || {
                title: "Job Title",
                company: "Company",
                location: "Location",
                logo: "/placeholder.svg",
              }

              return (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={job.logo || "/placeholder.svg"}
                            alt={job.company}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(application.status)}
                        <div className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Archive className="h-4 w-4" />
                            <span className="sr-only">Archive</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <FileText className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No active applications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't applied to any jobs yet or all your applications are archived
              </p>
              <Button className="mt-4" asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-md bg-slate-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded-md bg-slate-200"></div>
                          <div className="h-3 w-32 rounded-md bg-slate-200"></div>
                        </div>
                      </div>
                      <div className="h-6 w-24 rounded-full bg-slate-200"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const job = mockJobs[application.jobId as keyof typeof mockJobs] || {
                title: "Job Title",
                company: "Company",
                location: "Location",
                logo: "/placeholder.svg",
              }

              return (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={job.logo || "/placeholder.svg"}
                            alt={job.company}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(application.status)}
                        <div className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Archive className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No archived applications</h3>
              <p className="mt-2 text-sm text-muted-foreground">You don't have any archived applications yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
