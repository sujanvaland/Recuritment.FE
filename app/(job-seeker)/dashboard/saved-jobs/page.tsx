"use client"

import { useEffect, useState } from "react"
import { Bookmark, Building, Clock, ExternalLink, MapPin, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { ApplyJobButton } from "@/components/apply-job-button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

// Types for our saved job data 
interface SavedJob {
  id: string
  jobTitle: string
  companyName: string
  location: string
  type: string
  salary: string
  posted: string
  logo: string
  skills: string[]
  saved: string
  jobId: number
  createdDate: string
  savedAt: string
}

export default function SavedJobsPage() {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalData, setTotalData] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(totalData / pageSize);

  // Add settings state matching the UpdateSetting API payload
  const [settings, setSettings] = useState({
    id: 0,
    createdBy: 0,
    modifiedBy: 0,
    createdDate: "2025-07-02T15:04:05.125Z",
    modifiedDate: "2025-07-02T15:04:05.125Z",
    isDeleted: true,
    guId: "string",
    userId: "9",
    theme: "string",
    language: "string",
    timeZone: "string",
    notifications: {
      id: 0,
      createdBy: 0,
      modifiedBy: 0,
      createdDate: "2025-07-02T15:04:05.125Z",
      modifiedDate: "2025-07-02T15:04:05.125Z",
      isDeleted: true,
      guId: "string",
      userId: "9",
      emailNotifications: true,
      applicationUpdates: true,
      jobAlerts: true,
      messageNotifications: true,
      interviewReminders: true,
      marketingEmails: true
    },
    privacy: {
      id: 0,
      createdBy: 0,
      modifiedBy: 0,
      createdDate: "2025-07-02T15:04:05.125Z",
      modifiedDate: "2025-07-02T15:04:05.125Z",
      isDeleted: true,
      guId: "string",
      userId: "string",
      profileVisible: true,
      showContactInfo: true,
      allowMessaging: true,
      shareJobActivity: true,
      shareApplicationHistory: true
    },
    createdAt: "2025-07-02T15:04:05.125Z",
    lastUpdated: "2025-07-02T15:04:05.125Z"
  });

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {

    const userdetails = JSON.parse(localStorage.getItem("user") || "{}");

    console.log('userdetails', userdetails);
    let token = localStorage.getItem("token") || "";

    try {

      const response = await DataService.get("/SavedJobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.status === 200) {
        setSavedJobs(response?.data || []);
        // setAllJobs(response.data.jobs || []); 
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Filter saved jobs based on search query
  // const filteredJobs = savedJobs.filter(
  //   (job) =>
  //     job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  // )

  // Handle removing a saved job
  const handleRemoveSavedJob = async (id: number) => {
    setLoading(true);
    // Show confirmation dialog before proceeding
    const confirmed = window.confirm("Are you sure you want to remove this saved job?");
    if (!confirmed) return;
    // In a real app, this would be an API call
    const userdetails = JSON.parse(localStorage.getItem("user") || "{}");
    let token = localStorage.getItem("token") || "";
    const jobId = id;

    try {

      const response = await DataService.get(`/SavedJobs/Delete?jobId=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSavedJobs();
      setLoading(false);

    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }

    // setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== id))
  }

  // Handler for switch changes in notifications
  const handleNotificationSwitch = (field: keyof typeof settings.notifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  // Handler for saving settings
  const handleSaveSettings = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await DataService.post(
        "https://localhost:65437/api/settings/UpdateSetting",
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // Success logic (show toast, etc.)
        // You can use your useToast hook here if desired
        alert("Settings updated successfully!");
      } else {
        alert("Failed to update settings.");
      }
    } catch (error) {
      alert("Error updating settings.");
      console.error(error);
    }
  };

  console.log('savedJobsdatatata', savedJobs);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved jobs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
        {/* <div className="text-sm text-muted-foreground">
          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} saved
        </div> */}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <div className="h-12 w-12 rounded-md bg-slate-200"></div>
                <div className="space-y-2">
                  <div className="h-5 w-40 rounded-md bg-slate-200"></div>
                  <div className="h-4 w-32 rounded-md bg-slate-200"></div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-5 w-16 rounded-full bg-slate-200"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                    <img
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.companyName} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job?.jobTitle}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="mr-1 h-3 w-3" />
                        {job?.companyName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Saved {new Date(job?.savedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleRemoveSavedJob(job?.jobId)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove saved job</span>
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* <div className="flex flex-wrap gap-1">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div> */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {job.type}
                    </span>
                    <span className="ml-2 text-sm font-medium">{job.salary}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Posted{" "}
                    {getJobTimeInfo(job?.createdDate, job?.createdDate ?? "").posted}
                  </span>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between p-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/jobs/${job?.jobId}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
                <ApplyJobButton
                  jobId={job?.jobId}
                  jobTitle={job?.jobTitle}
                  companyName={job?.companyName}
                  size="sm"
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Bookmark className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No saved jobs found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery ? "Try adjusting your search query" : "You haven't saved any jobs yet"}
          </p>
          {searchQuery ? (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          ) : (
            <Button className="mt-4" asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          )}
        </div>
      )}

      {/* Example usage in JSX (add this where you want the switch to appear): */}
      {/*
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <Switch
            checked={settings.notifications.emailNotifications}
            onCheckedChange={(checked) => handleNotificationSwitch("emailNotifications", checked)}
          />
        </div>
      </Card>
      */}

      {/* Example usage in JSX (add this where you want the save button to appear): */}
      {/*
      <Button onClick={handleSaveSettings} className="mt-4">Save Settings</Button>
      */}
    </>
  )
}
