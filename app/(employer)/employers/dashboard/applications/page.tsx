"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Check,
  Download,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useParams, useSearchParams } from "next/navigation"

type application = {
  id: number
  title?: string
  location?: string
  type?: string
  applicants?: number
  status?: string
  createdAt?: string
  expiresAt?: string
  modifiedDate?: string
  posted?: string
  expires?: string
  resumeUrl?: string
  user?: {
    id: number // <-- Add this line
    firstName: string
    lastName: string
    email: string
    avatar: string
  }
  job?: {
    title: string
    location: string
  }
  appliedDate?: string | undefined
  rating?: number
}


type Job = {
  id: number
  title: string
  location: string
  type: string
  applicants?: number
  status?: string
  createdAt?: string
  expiresAt?: string,
  modifiedDate?: string,
  posted?: string
  expires?: string
}



export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("")
  const [applicationData, setApplicationData] = useState<application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const [totalData, setTotalData] = useState(0);
  const [PageNo, setPageNo] = useState(1);
  const [JobId, setJobId] = useState(0);
  const [activeJob, setActivejob] = useState<Job[]>([]);
  const [openInterviewModal, setOpenInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<application | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewNote, setInterviewNote] = useState("");

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPageNo(page);
    }
  };

  const pageSize = 5;
  const totalPages = Math.ceil(totalData / pageSize);

  useEffect(() => {
    fetchApplications(searchQuery, JobId, selectedTab, PageNo);
  }, [searchQuery, selectedTab, PageNo, JobId]);

  const searchParams = useSearchParams()

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Step 1: Fetch first page (20 jobs max)
      const firstResponse = await DataService.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: "",
          remote: null,
          tag: "",
          status: "active",
          page: 1,
          pageSize: 20,
        },
      });

      if (firstResponse?.status === 200) {
        const total = firstResponse.data.total || 0;
        let jobsdata = firstResponse.data.jobs || [];

        if (total > 20) {
          // Step 2: Fetch everything in one go
          const fullResponse = await DataService.get("/jobs", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              search: "",
              remote: null,
              tag: "",
              status: "active",
              page: 1,
              pageSize: total, // fetch ALL jobs
            },
          });

          if (fullResponse?.status === 200) {
            jobsdata = fullResponse.data.jobs || [];
          }
        }
        setActivejob(jobsdata);
        console.log('interviewNote:', jobsdata);

      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const rawId = searchParams?.get('id');
    if (rawId) {
      const rawid = Number(decodeURIComponent(rawId));
      fetchApplications(searchQuery, rawid, selectedTab, PageNo);
      setJobId(rawid);
    }
  }, [searchParams]);

  const fetchApplications = async (Search = searchQuery, Jobid = JobId, SortBy = selectedTab, Page = PageNo) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const searchParams: any = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          jobId: Jobid,
          search: Search,
          page: Page,
          pageSize: pageSize,
          sortBy: SortBy
        },
      }

      const response = await DataService.get("/applications", searchParams)

      if (response?.status === 200) {
        console.log('applications response');
        let applicationData = Array.isArray(response?.data?.items) ? response?.data?.items : [];
        setApplicationData(applicationData);
        setTotalData(response?.data?.totalRecords ?? 0);
      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  console.log("selectedTab", selectedTab)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Manage and review candidate applications</p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div> */}
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search applications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={JobId === 0 ? "all-jobs" : JobId.toString()}
            onValueChange={value => {
              setJobId(value === "all-jobs" ? 0 : Number(value));
              setPageNo(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-jobs">All Jobs</SelectItem>
              {(Array.isArray(activeJob) ? activeJob : []).map(job => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="" className="relative">
            All
          </TabsTrigger>
          <TabsTrigger value="interview" className="relative">
            Interview
          </TabsTrigger>
          <TabsTrigger value="applied" className="relative">
            Applied
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {applicationData.map((application) => {
            const { posted } = getJobTimeInfo(application?.appliedDate ?? "", application?.expiresAt ?? "");
            return (
              <ApplicationCard
                key={application.id}
                application={application}
                applied={posted}
                changeStatus={fetchApplications}
                setSelectedApplication={setSelectedApplication}
                setOpenInterviewModal={setOpenInterviewModal}
              />
            );
          })}

          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(PageNo - 1)}
              disabled={PageNo === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${PageNo === i + 1
                  ? "bg-black text-white"
                  : "bg-gray-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(PageNo + 1)}
              disabled={PageNo === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </TabsContent>

      </Tabs>

      <Dialog open={openInterviewModal} onOpenChange={setOpenInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={interviewTime}
                onChange={e => setInterviewTime(e.target.value)}
              />
            </div>
            <div>
              <Label>Note (optional)</Label>
              <Input
                type="text"
                value={interviewNote}
                onChange={e => setInterviewNote(e.target.value)}
              />
            </div>
            <div>
              <Label>Meeting Link (optional)</Label>
              <Input
                type="url"
                placeholder="https://zoom.us/j/123..."
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!selectedApplication) return;
                debugger;
                // Combine date and time into ISO string
                const scheduledTime = new Date(
                  `${interviewDate}T${interviewTime}:00.000Z`
                ).toISOString();

                try {
                  const response = await DataService.post(
                    "/interviews",
                    {
                      jobId: selectedApplication?.id,
                      candidateId: selectedApplication?.user?.id.toString(),
                      scheduledTime,
                      duration: 0, // or set as needed
                      type: "",
                      location: "",
                      notes: interviewNote,
                      meetingLink: meetingLink,
                    },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (response.status === 200 || response.status === 201) {
                    toast({
                      title: "Interview Scheduled",
                      description: response.data?.message || "The interview has been scheduled successfully.",
                    });
                    setOpenInterviewModal(false);
                    setInterviewDate("");
                    setInterviewTime("");
                    setMeetingLink("");
                    setInterviewNote("");
                    setSelectedApplication(null);
                    fetchApplications();
                  } else {
                    toast({
                      title: "Error",
                      description: "Failed to schedule interview.",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to schedule interview.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Schedule
            </Button>
            <Button variant="outline" onClick={() => setOpenInterviewModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



function ApplicationCard({
  application,
  applied,
  changeStatus,
  setSelectedApplication,
  setOpenInterviewModal
}: {
  application: application;
  applied: string;
  changeStatus: () => void;
  setSelectedApplication: (app: application) => void;
  setOpenInterviewModal: (open: boolean) => void;
}) {
  const getStatusBadge = (status: any) => {
    switch (status) {
      case "reviewed":
        return <Badge className="bg-amber-100 text-amber-700">Reviewed</Badge>
      case "interview":
        return <Badge className="bg-blue-100 text-blue-700">Interview</Badge>
      case "hired":
        return <Badge className="bg-green-100 text-green-700">Hired</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      case "applied":
        return <Badge className="bg-red-100 text-red-700">Applied</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const { toast } = useToast();

  const handleChangeStatus = async (appid: any, status: any) => {
    const expjobdata = {
      id: appid ?? null,
      status: status
    }

    console.log('expjobdata', expjobdata);

    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token")
      console.log('jobData1234', expjobdata);
      const response = await DataService.post(`/applications/status`, expjobdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log('status response', response);
          if (response.status === 200) {
            toast({
              title: "Success!",
              description: `Appliation moved to ${response?.data?.status}`,
            });
            //  router.push("/employers/dashboard/jobs")
            changeStatus();
          } else {
            console.warn("Unexpected status code:", response);
          }
        })
        .catch((error) => {
          console.error("Error creating job:", error);
        });

    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    }

  }


  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={application?.user?.avatar || "/placeholder.svg"} alt={application?.user?.firstName} />
              <AvatarFallback>
                {application?.user?.firstName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{application?.user?.firstName} {application?.user?.lastName}</CardTitle>
              <CardDescription>{application?.user?.email}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application?.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (application?.resumeUrl) {
                      window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
                    } else {
                      alert("Resume not available.");
                    }
                  }}
                >
                  View Resume
                </DropdownMenuItem>
                {/* Show Schedule Interview only if status is "interview" */}
                {application?.status === "interview" && (
                  <DropdownMenuItem onClick={() => {
                    setSelectedApplication(application);
                    setOpenInterviewModal(true);
                  }}>
                    Schedule Interview
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Send Message</DropdownMenuItem>
                {application?.status !== "rejected" && (
                  <DropdownMenuItem className="text-destructive" onClick={() => {
                    handleChangeStatus(application?.id, "rejected");
                  }}>
                    Reject Application
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Applied For</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{application?.job?.title}</Badge>
              <div className="text-xs text-muted-foreground">
                <MapPin className="mr-1 inline-block h-3 w-3" />
                {application?.job?.location}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Application Details</div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">
                <Calendar className="mr-1 inline-block h-3 w-3" />
                Applied on {applied}
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (application?.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-3 w-3" />
              View Application
            </Button>
            <a href={application?.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-3 w-3" />
                Download Resume
              </Button>
            </a>
          </div>
          <div className="flex gap-2">
            {/* Only show Reject button if status is NOT rejected */}
            {application?.status !== "rejected" && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  handleChangeStatus(application?.id, "rejected");
                }}
              >
                <X className="mr-2 h-3 w-3" />
                Reject
              </Button>
            )}
            {/* Only show Move to Interview if status is NOT interview */}
            {application?.status !== "interview" && (
              <Button
                size="sm"
                onClick={() => {
                  handleChangeStatus(application?.id, "interview");
                }}
              >
                <Check className="mr-2 h-3 w-3" />
                Move to Interview
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
