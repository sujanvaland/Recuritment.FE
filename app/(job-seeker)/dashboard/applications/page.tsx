"use client"

import { useEffect, useState } from "react"
import { Archive, CheckCircle, Clock, Eye, FileText, X, RefreshCw, Loader2, MapPin, Calendar, User, Mail, Phone, ExternalLink, Star, TrendingUp, BarChart3, Download, Copy, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress" 
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/services/axiosInstance"

// Types for job applications - updated to match API response
// interface JobApplication {
//   id: number
//   guId: string
//   jobId: number
//   userId: number
//   coverLetter: string
//   resumeUrl: string
//   status: "applied" | "interview" | "offer" | "rejected"
//   appliedDate: string
//   lastUpdated: string | null
//   job: any | null
//   user: any | null
//   createdBy: number
//   modifiedBy: number
//   createdDate: string
//   modifiedDate: string
//   isDeleted: boolean
// }

interface JobApplication {
  jobId: number
  title: string
  company: string
  location: string
  type: string // Full-time, Part-time, Contract, etc.
  salary?: string
  minSalary?: number
  maxSalary?: number
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  employerId: string
  createdAt: string // ISO date string
  expiresAt: string // ISO date string
  remote: boolean
  status: "active" | "filled" | "expired" | "draft"
  appliedId: number
  resumeUrl: string
  coverLetter: string
  applicationStatus: "applied" | "interview" | "offer" | "rejected"
  appliedAt: string // ISO date string
}

const fetchApplicationsFromAPI = async (userId: number) => {
  try {
    // Add client-side check
    if (typeof window === "undefined") {
      throw new Error("Window is not available")
    }
    
    const token = localStorage.getItem("token")
    
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await DataService.get("/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if (response.status === 200 && response.data) {
      // Filter applications for the current user
      const userApplications = response.data as JobApplication[]
      console.log("Fetched user applications:", userApplications)
      return userApplications
    } else {
      throw new Error(`API returned status ${response.status}`)
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
  const [isClient, setIsClient] = useState(false)
  
  // Application Details Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  
  const { user } = useAuth()

  // Client-side initialization - this fixes hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Move fetchApplications to component scope
  const fetchApplications = async () => {
    if (!user || !isClient) {
      console.log("No user or not client-side yet, skipping fetch")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      console.log("Fetching applications for user:", user.id)
      const userApplications = await fetchApplicationsFromAPI(user.id as any)
      console.log("Fetched applications:", userApplications)
      setApplications(userApplications)
    } catch (error) {
      console.error("Error fetching applications:", error)
      setError("Failed to load applications. Please try again.")
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isClient && user?.id) {
      fetchApplications()
    }
  }, [isClient, user?.id])

  const refreshApplications = async () => {
    await fetchApplications()
  }

  // Handle view application details
  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application)
    setShowDetailsModal(true)
  }

  // Early return for SSR - return loading skeleton until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 w-80 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 mb-4"></div>
            <div className="h-6 w-96 rounded-lg bg-slate-200 mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 rounded bg-slate-200"></div>
                      <div className="h-3 w-24 rounded bg-slate-200"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 rounded bg-slate-200"></div>
                    <div className="h-3 w-2/3 rounded bg-slate-200"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Early return if no user after client is ready
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
            <FileText className="h-12 w-12 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 text-lg">Please log in to view your applications</p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // Updated mock job data to match your jobIds
  const mockJobs = {
    1: {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      logo: "/abstract-tc.png",
      description: "We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.",
      requirements: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
      salary: "$80,000 - $120,000",
      type: "Full-time",
      remote: false,
      companySize: "500-1000 employees",
      industry: "Technology"
    },
    2: {
      title: "UX Designer", 
      company: "Design Studio",
      location: "Remote",
      logo: "/abstract-data-stream.png",
      description: "Join our creative team to design intuitive and beautiful user experiences.",
      requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      salary: "$70,000 - $100,000",
      type: "Full-time",
      remote: true,
      companySize: "50-100 employees",
      industry: "Design"
    },
    3: {
      title: "Full Stack Developer",
      company: "StartupXYZ", 
      location: "New York, NY",
      logo: "/abstract-geometric-sx.png",
      description: "Build scalable web applications from frontend to backend.",
      requirements: ["Node.js", "React", "PostgreSQL", "AWS", "Docker"],
      salary: "$90,000 - $130,000",
      type: "Full-time",
      remote: false,
      companySize: "10-50 employees",
      industry: "Startup"
    },
    4: {
      title: "Product Manager",
      company: "ProductLabs",
      location: "Austin, TX", 
      logo: "/abstract-geometric-shapes.png",
      description: "Lead product development and work with cross-functional teams.",
      requirements: ["Product Strategy", "Agile", "Analytics", "Communication"],
      salary: "$100,000 - $140,000",
      type: "Full-time",
      remote: false,
      companySize: "100-500 employees",
      industry: "Product"
    },
  }

  // Helper function to get status badge with enhanced styling
  function getStatusBadge(status: string) {
    const statusConfig = {
      applied: {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        text: "text-white",
        icon: Clock,
        label: "Applied"
      },
      interview: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "text-white",
        icon: Star,
        label: "Interview"
      },
      offer: {
        bg: "bg-gradient-to-r from-green-500 to-emerald-600",
        text: "text-white",
        icon: CheckCircle,
        label: "Offer"
      },
      rejected: {
        bg: "bg-gradient-to-r from-red-500 to-red-600",
        text: "text-white",
        icon: X,
        label: "Rejected"
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    const IconComponent = config.icon

    return (
      <div className={`flex items-center gap-2 rounded-full ${config.bg} px-4 py-2 text-sm font-semibold ${config.text} shadow-lg`}>
        <IconComponent className="h-4 w-4" />
        <span>{config.label}</span>
      </div>
    )
  }

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "active") {
      return app.applicationStatus === "applied" || app.applicationStatus === "interview"
    } else {
      return app.applicationStatus === "offer" || app.applicationStatus === "rejected"
    }
  })

  // Get job details for selected application
  const getJobDetails = (jobId: number) => {
    return mockJobs[jobId as keyof typeof mockJobs] || {
      title: `Job #${jobId}`,
      company: "Company Name",
      location: "Location",
      logo: "/placeholder.svg",
      description: "Job description not available",
      requirements: [],
      salary: "Competitive",
      type: "Full-time",
      remote: false,
      companySize: "Unknown",
      industry: "Various"
    }
  }

  // Calculate stats for tab labels
  const totalApplications = applications.length
  const activeApplications = applications.filter(app => app.applicationStatus === "applied" || app.applicationStatus === "interview").length

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto  ">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Tabs defaultValue="active" className="w-full sm:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:w-auto bg-white shadow-lg border-0">
              <TabsTrigger 
                value="active"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Active ({activeApplications})
              </TabsTrigger>
              <TabsTrigger 
                value="archived"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Archive ({totalApplications - activeApplications})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            variant="outline" 
            onClick={refreshApplications} 
            disabled={isLoading}
            className="bg-white hover:bg-gray-50 shadow-lg border-0"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Applications Grid */}
        <Tabs value={activeTab} className="space-y-6">
          <TabsContent value="active" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-32 rounded bg-slate-200"></div>
                          <div className="h-3 w-24 rounded bg-slate-200"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 rounded bg-slate-200"></div>
                        <div className="h-3 w-2/3 rounded bg-slate-200"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Something went wrong</h3>
                  <p className="text-red-700 mb-6">{error}</p>
                  <Button
                    onClick={fetchApplications}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      "Try Again"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredApplications.map((application) => {
                  return (
                    <Card key={application.appliedId} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white overflow-hidden">
                      <CardContent className="p-0">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {/* <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                                <AvatarImage src={job.logo} alt={job.company} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                  {job.company.charAt(0)}
                                </AvatarFallback>
                              </Avatar> */}
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                  {application.title}
                                </h3>
                                <p className="text-sm text-gray-600 font-medium">{application.company}</p>
                              </div>
                            </div>
                            {getStatusBadge(application.status)}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{application.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">
                                Applied {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 pt-4">
                         
                          {application.coverLetter && (
                            <div className="mb-6">
                              <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter Preview</p>
                              <p className="text-sm text-gray-500 line-clamp-2 bg-gray-50 rounded-lg p-3">
                                {application.coverLetter.length > 80 
                                  ? `${application.coverLetter.substring(0, 80)}...` 
                                  : application.coverLetter
                                }
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDetails(application)}
                              className="flex-1 bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            
                            {application.resumeUrl && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(application.resumeUrl, '_blank', 'noopener,noreferrer')}
                                className="hover:bg-green-50 hover:border-green-200 text-green-700"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                    <FileText className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Applications</h3>
                  <p className="text-gray-600 mb-8 max-w-md">
                    Ready to take the next step in your career? Start browsing and applying to amazing opportunities!
                  </p>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                    <a href="/jobs">
                      Explore Jobs
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-32 rounded bg-slate-200"></div>
                          <div className="h-3 w-24 rounded bg-slate-200"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredApplications.map((application) => {
                  const job = mockJobs[application.jobId as keyof typeof mockJobs] || {
                    title: "Job Title",
                    company: "Company",
                    location: "Location",
                    logo: "/placeholder.svg",
                  }

                  return (
                    <Card key={application.appliedId} className="border-0 shadow-lg bg-white opacity-75 hover:opacity-100 transition-opacity">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                              <AvatarImage src={job.logo} alt={job.company} />
                              <AvatarFallback className="bg-gray-400 text-white">
                                {job.company.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-500">{job.company}</p>
                            </div>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(application)}
                          className="w-full"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                    <Archive className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Archived Applications</h3>
                  <p className="text-gray-600 max-w-md">
                    Completed applications will appear here once they reach a final status.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Application Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto border-0 shadow-2xl">
          <DialogHeader className="border-b pb-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Application Details
            </DialogTitle>
            <DialogDescription className="text-md text-gray-600">
              Complete overview of your job application and progress
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="py-6 space-y-8">
              {(() => {
                const jobDetails = getJobDetails(selectedApplication.jobId)
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Enhanced Job Information */}
                      <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-6">
                            {/* <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                              <AvatarImage src={jobDetails.logo} alt={jobDetails.company} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                                {jobDetails.company.charAt(0)}
                              </AvatarFallback>
                            </Avatar> */}
                            <div className="flex-1">
                              <CardTitle className="text-xl md:text-1xl font-bold mb-2">{selectedApplication.title}</CardTitle>
                              <p className="text-xl text-gray-600 font-semibold mb-4">{selectedApplication.company}</p>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="h-5 w-5" />
                                  <span>{selectedApplication.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                    {selectedApplication.type}
                                  </Badge>
                                  {selectedApplication.remote && (
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
                                      Remote
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2">About This Role</h4>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{selectedApplication.description}</p>
                          </div>
                          
                          {/* {selectedApplication.requirements.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedApplication.requirements.map((req, index) => (
                                  <Badge key={index} variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                                    {req}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )} */}
                          {selectedApplication.salary && 
                          <div className="grid grid-cols-3 gap-6 pt-6 border-t">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">💰 Salary</h4>
                              <p className="text-gray-600">{selectedApplication.salary}</p>
                            </div>
                            {/* <div>
                              <h4 className="font-semibold text-gray-900 mb-2">🏢 Company Size</h4>
                              <p className="text-gray-600">{selectedApplication.companySize}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">🏭 Industry</h4>
                              <p className="text-gray-600">{selectedApplication.industry}</p>
                            </div> */}
                          </div>}
                        </CardContent>
                      </Card>

                      {/* Enhanced Cover Letter */}
                      <Card className="border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base md:text-lg font-bold text-gray-800">
                            <FileText className="h-5 w-5" />
                            Cover Letter
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 border">
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                              {selectedApplication.coverLetter || "No cover letter provided"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="space-y-6">
                      {/* Application Status */}
                      <Card className="border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-base md:text-lg font-bold text-gray-800">Application Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex justify-center">
                            {getStatusBadge(selectedApplication.status)}
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900">Applied</p>
                                <p className="text-gray-600 text-sm">
                                  {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            {false && (
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50">
                                <RefreshCw className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-gray-900">Last Updated</p>
                                  {/* <p className="text-gray-600 text-sm">
                                    {new Date(selectedApplication.lastUpdated).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p> */}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Enhanced Actions */}
                      <Card className="border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-base md:text-lg font-bold text-gray-800">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedApplication.resumeUrl && (
                            <Button
                              variant="outline"
                              className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 text-blue-700"
                              onClick={() => {
                                window.open(selectedApplication.resumeUrl, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              <Download className="mr-3 h-4 w-4 text-blue-600" />
                              View Resume
                              <ExternalLink className="ml-auto h-4 w-4" />
                            </Button>
                          )}

                          {selectedApplication.applicationStatus === "applied" && false && (
                            <Button
                              variant="outline"
                              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                              onClick={() => {
                                console.log("Withdraw application:", selectedApplication)
                              }}
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              Withdraw Application
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
