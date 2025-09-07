"use client"

import Link from "next/link"
import { BarChart3, BriefcaseBusiness, ChevronRight, Clock, FileText, MessageSquare, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { DataService } from "@/services/axiosInstance"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EmployerDashboardPage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Add dashboard analytics state
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0,
    totalHires: 0,
    applicationsOverTime: [],
    jobViewsOverTime: [],
    applicationsByJob: {},
    applicationsByStatus: {}
  })
  const [loading, setLoading] = useState(true)
  
  // Add recent applications state
  const [recentApplications, setRecentApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  // Add upcoming interviews state
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [interviewsLoading, setInterviewsLoading] = useState(true)

  // Add this state for candidate details
  const [candidateDetails, setCandidateDetails] = useState({})

  // Add reschedule modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedInterviewForReschedule, setSelectedInterviewForReschedule] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [rescheduleNotes, setRescheduleNotes] = useState("")

  // Fetch dashboard analytics
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token")
      try {
        // Fetch dashboard analytics
        const dashboardResponse = await DataService.get("/analytics/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (dashboardResponse.status === 200) {
          setDashboardData(dashboardResponse.data)
        }

        // Fetch recent applications with error handling
        try {
          const applicationsResponse = await DataService.get("/analytics/recent-applications?count=10", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          
          if (applicationsResponse.status === 200) {
            setRecentApplications(applicationsResponse.data.slice(0, 4))
          }
        } catch (applicationsError) {
          console.error("Error fetching recent applications:", applicationsError)
          setRecentApplications([]) // Set empty array on error
        }

        // Fetch upcoming interviews
        try {
          const interviewsResponse = await DataService.get("/analytics/upcoming-interviews?count=5", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          
          if (interviewsResponse.status === 200) {
            const interviews = interviewsResponse.data.slice(0, 3)
            setUpcomingInterviews(interviews)
            
            // Fetch candidate details
            const candidateIds = [...new Set(interviews.map(i => i.candidateId))]
            if (candidateIds.length > 0) {
              fetchCandidateDetails(candidateIds)
            }
          }
        } catch (interviewsError) {
          console.error("Error fetching upcoming interviews:", interviewsError)
          setUpcomingInterviews([]) // Set empty array on error
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
        setApplicationsLoading(false)
        setInterviewsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Add this function to fetch candidate details
  const fetchCandidateDetails = async (candidateIds) => {
    const token = localStorage.getItem("token")
    const details = {}
    
    for (const candidateId of candidateIds) {
      try {
        const response = await DataService.get(`/users/${candidateId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 200) {
          details[candidateId] = response.data
        }
      } catch (error) {
        console.error(`Error fetching candidate ${candidateId}:`, error)
      }
    }
    
    setCandidateDetails(details)
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    isDraft: boolean
  ) => {
    e.preventDefault();
    console.log('Submitting form...');
    // if (!isDraft && !validateForm()) {
    //   console.log('Validation failed');
    //   toast({
    //     title: "Validation Error",
    //     description: "Please fill in all required fields.",
    //     variant: "destructive",
    //   })
    //   return
    // }
    // console.log('Form is valid, proceeding...');
    // console.log('formData', formData);

    setIsSubmitting(true);


    console.log('formdata', formData);
    const jobData = {
      ...formData,
      status: isDraft ? "draft" : "active",
    }

    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token")
      const response = await DataService.post("/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 201) {
            toast({
              title: "Success!",
              description: isDraft ? "Job saved as draft" : "Job posted successfully",
            })
          } else {
            console.warn("Unexpected status code:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error creating job:", error);
        });

      //  const result = await response.json()

      // toast({
      //   title: "Success!",
      //   description: isDraft ? "Job saved as draft" : "Job posted successfully",
      // })

      router.push("/employers/dashboard/jobs")
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this helper function at the top of your component
  const getTimeAgo = (dateString) => {
    const now = new Date()
    const applicationDate = new Date(dateString)
    const diffInHours = Math.floor((now - applicationDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return applicationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Add this helper function for interview time formatting
  const formatInterviewTime = (scheduledTime) => {
    const interviewDate = new Date(scheduledTime)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const interviewDay = new Date(interviewDate.getFullYear(), interviewDate.getMonth(), interviewDate.getDate())
    
    let dayText = ''
    if (interviewDay.getTime() === today.getTime()) {
      dayText = 'Today'
    } else if (interviewDay.getTime() === tomorrow.getTime()) {
      dayText = 'Tomorrow'
    } else {
      dayText = interviewDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    const timeText = interviewDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    return `${dayText}, ${timeText}`
  }

  // Add this function after your existing helper functions
  const handleRescheduleInterview = async () => {
    if (!selectedInterviewForReschedule || !rescheduleDate.trim() || !rescheduleTime.trim()) {
      alert("Please provide both date and time for rescheduling.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      // Combine date and time into ISO string
      const scheduledTime = new Date(
        `${rescheduleDate}T${rescheduleTime}:00.000Z`
      ).toISOString();

      const response = await DataService.post(
        `/interviews/UpdateInterview/${selectedInterviewForReschedule.id}`,
        {
          jobId: selectedInterviewForReschedule.jobId,
          candidateId: selectedInterviewForReschedule.candidateId.toString(),
          scheduledTime,
          duration: selectedInterviewForReschedule.duration || 0,
          type: selectedInterviewForReschedule.type || "",
          location: selectedInterviewForReschedule.location || "",
          notes: rescheduleNotes || selectedInterviewForReschedule.notes || "",
          meetingLink: meetingLink || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data?.message || "Interview rescheduled successfully!");
        setRescheduleModalOpen(false);
        setRescheduleDate("");
        setRescheduleTime("");
        setMeetingLink("");
        setRescheduleNotes("");
        setSelectedInterviewForReschedule(null);
        
        // Refresh the dashboard data
        window.location.reload(); // Simple refresh, or you can call fetchDashboardData again
      } else {
        alert("Failed to reschedule interview.");
      }
    } catch (error) {
      console.error("Error rescheduling interview:", error);
      alert("Error rescheduling interview.");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard..</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}! Here's an overview of your recruitment activities.
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
                <p className="text-xs text-muted-foreground">Fetching data...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Active Jobs</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BriefcaseBusiness className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {loading ? "..." : dashboardData.totalJobs}
              </div>
              <p className="text-xs text-muted-foreground">Currently active positions</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Total Applications</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {loading ? "..." : dashboardData.totalApplications}
              </div>
              <p className="text-xs text-muted-foreground">Applications received</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Total Interviews</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {loading ? "..." : dashboardData.totalInterviews}
              </div>
              <p className="text-xs text-muted-foreground">Interviews scheduled</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Total Hires</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {loading ? "..." : dashboardData.totalHires}
              </div>
              <p className="text-xs text-muted-foreground">Successful hires</p>
            </CardContent>
          </Card>
        </div>
      )}
      </form>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-bold text-gray-800">Job Performance</CardTitle>
            <CardDescription className="text-sm">Overview of your job listings performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Display applications by job from API */}
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                Object.entries(dashboardData.applicationsByJob).map(([jobTitle, applications]) => (
                  <div key={jobTitle} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{jobTitle}</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{applications} applicants</span>
                    </div>
                    <Progress 
                      value={Math.min((applications / Math.max(...Object.values(dashboardData.applicationsByJob))) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Link href="/employers/dashboard/jobs" className="flex items-center">
                  View All Jobs
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-bold text-gray-800">Recent Applications</CardTitle>
            <CardDescription className="text-sm">Latest candidates who applied to your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationsLoading ? (
                <div className="text-center py-4">Loading applications...</div>
              ) : recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {application.user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        {application.user?.lastName?.charAt(0)?.toUpperCase() || ''}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {application.user?.firstName} {application.user?.lastName}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(application.appliedDate)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied for {application.job?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'hired' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status?.charAt(0)?.toUpperCase() + application.status?.slice(1) || 'Applied'}
                        </span>
                        {application.job?.location && (
                          <span className="text-xs text-muted-foreground">
                            • {application.job.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent applications found
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Link href="/employers/dashboard/applications" className="flex items-center">
                  View All Applications
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg font-bold text-gray-800">Recruitment Activity</CardTitle>
                <CardDescription className="text-sm">Track your hiring pipeline and candidate progress</CardDescription>
              </div>
              <Tabs defaultValue="week">
                <TabsList className="bg-white shadow-lg border-0">
                  <TabsTrigger value="week" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Week</TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Month</TabsTrigger>
                  <TabsTrigger value="year" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <div className="flex h-full items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                <div className="ml-4 text-center">
                  <p className="text-sm font-medium">Analytics Chart Placeholder</p>
                  <p className="text-xs text-muted-foreground">Visualize your recruitment metrics here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-bold">Upcoming Interviews</h2>
        <Button variant="ghost" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Link href="/employers/dashboard/interviews" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            View All Interviews
          </Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interviewsLoading ? (
          // Loading skeleton
          [1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-4 h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
                <div className="mt-4 flex justify-end gap-2">
                  <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : upcomingInterviews.length > 0 ? (
          upcomingInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {candidateDetails[interview.candidateId] 
                        ? `${candidateDetails[interview.candidateId].firstName?.charAt(0)}${candidateDetails[interview.candidateId].lastName?.charAt(0)}`
                        : `C${interview.candidateId}`
                    }
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {candidateDetails[interview.candidateId] 
                        ? `${candidateDetails[interview.candidateId].firstName} ${candidateDetails[interview.candidateId].lastName}`
                        : `Candidate #${interview.candidateId}`
                      }
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {interview.type || 'General Interview'}
                    </p>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1 ${
                      interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      interview.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{formatInterviewTime(interview.scheduledTime)}</span>
                </div>
                {interview.location && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    📍 {interview.location}
                  </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  {/* Updated Reschedule Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedInterviewForReschedule(interview);
                      setRescheduleModalOpen(true);
                      // Pre-fill current values
                      const currentDate = new Date(interview.scheduledTime);
                      setRescheduleDate(currentDate.toISOString().split('T')[0]);
                      setRescheduleTime(currentDate.toTimeString().slice(0, 5));
                      setMeetingLink(interview.meetingLink || "");
                      setRescheduleNotes(interview.notes || "");
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (interview.meetingLink) {
                        window.open(interview.meetingLink, '_blank', 'noopener,noreferrer')
                      } else {
                        alert('No meeting link available')
                      }
                    }}
                  >
                    {interview.meetingLink ? 'Join Call' : 'No Link'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // No interviews state
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground">No upcoming interviews</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule interviews with candidates to see them here
                </p>
                <Button variant="ghost" className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" size="sm">
                  <Link href="/employers/dashboard/applications">
                    View Applications
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Reschedule Interview Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              Update the interview details for {selectedInterviewForReschedule && candidateDetails[selectedInterviewForReschedule.candidateId] 
                ? `${candidateDetails[selectedInterviewForReschedule.candidateId].firstName} ${candidateDetails[selectedInterviewForReschedule.candidateId].lastName}`
                : `Candidate #${selectedInterviewForReschedule?.candidateId}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reschedule-date">Date</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reschedule-time">Time</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-link">Meeting Link</Label>
              <Input
                id="meeting-link"
                type="url"
                placeholder="https://meet.google.com/abc-xyz or Zoom link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-notes">Notes (Optional)</Label>
              <Textarea
                id="reschedule-notes"
                placeholder="Any additional notes or changes..."
                value={rescheduleNotes}
                onChange={(e) => setRescheduleNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRescheduleModalOpen(false);
                setRescheduleDate("");
                setRescheduleTime("");
                setMeetingLink("");
                setRescheduleNotes("");
                setSelectedInterviewForReschedule(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRescheduleInterview}
              disabled={!rescheduleDate.trim() || !rescheduleTime.trim()}
            >
              Reschedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
