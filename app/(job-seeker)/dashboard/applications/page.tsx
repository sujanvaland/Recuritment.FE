"use client"

import { useEffect, useState } from "react"
import { Archive, CheckCircle, Clock, Eye, FileText, X, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/services/axiosInstance"; // Adjust import path as needed

// Types for job applications - updated to match API response
interface JobApplication {
  id: number
  guId: string
  jobId: number
  userId: number
  coverLetter: string
  resumeUrl: string
  status: "applied" | "interview" | "offer" | "rejected"
  appliedDate: string
  lastUpdated: string | null
  job: any | null
  user: any | null
  createdBy: number
  modifiedBy: number
  createdDate: string
  modifiedDate: string
  isDeleted: boolean
}

const fetchApplicationsFromAPI = async (userId: number) => {
  try {
    const token = localStorage.getItem("token")

    const response = await DataService.get("/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 200 && response.data) {
      // Filter applications for the current user
      const userApplications = response.data.filter((app: JobApplication) => app.userId === userId)
      return userApplications
    } else {
      throw new Error("Failed to fetch applications")
    }
  } catch (error) {
    console.error("Error fetching applications:", error)
    throw error
  }
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)
      try {
        // Use the new API service function
        const userApplications = await fetchApplicationsFromAPI(user.id)
        setApplications(userApplications)
      } catch (error) {
        console.error("Error fetching applications:", error)
        setError("Failed to load applications. Please try again.")
        setApplications([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [user])

  // Updated mock job data to match your jobIds
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
    // Add more jobs as needed
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

  const refreshApplications = async () => {
    await fetchApplications()
  }

  return (
    <div className="space-y-6">
      {/* Add refresh button in the header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Applications</h2>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <Button variant="outline" onClick={refreshApplications} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
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
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchApplications()}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const job = mockJobs[application.jobId as keyof typeof mockJobs] || {
                title: `Job #${application.jobId}`,
                company: "Company Name",
                location: "Location",
                logo: "/placeholder.svg",
              }

              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={job.logo || "/placeholder.svg"}
                            alt={job.company}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                          {/* Show application ID for reference */}
                          <p className="text-xs text-gray-400">
                            Application ID: {application.guId.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(application.status)}
                        <div className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              // View application details
                              console.log("View application:", application)
                              // You can implement a modal or navigate to details page
                            }}
                            title="View Application Details"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          {/* Show resume button if resumeUrl exists */}
                          {application.resumeUrl && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                window.open(application.resumeUrl, '_blank', 'noopener,noreferrer')
                              }}
                              title="View Resume"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Resume</span>
                            </Button>
                          )}
                          {activeTab === "active" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                // Archive application
                                console.log("Archive application:", application)
                                // You can implement archive functionality here
                              }}
                              title="Archive Application"
                            >
                              <Archive className="h-4 w-4" />
                              <span className="sr-only">Archive</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Show cover letter preview if exists */}
                    {application.coverLetter && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Cover Letter:</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {application.coverLetter.length > 100 
                            ? `${application.coverLetter.substring(0, 100)}...` 
                            : application.coverLetter
                          }
                        </p>
                      </div>
                    )}
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
