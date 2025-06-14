"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Link, MapPin, MoreHorizontal, Plus, Search, SlidersHorizontal, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context"



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






export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("active")

  const [jobs, setJobs] = useState<Job[]>([])
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [displayJobs, setDisplayJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalData, setTotalData] = useState(0);
  const [draftJobs, setDraftjob] = useState<Job[]>([]);
  const [expiredJobs, setExpiredjob] = useState<Job[]>([]);
  const [activejob, setActivejob] = useState([]);
  const { user } = useAuth()
  const { toast } = useToast()

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const pageSize = 5;
  const totalPages = Math.ceil(totalData / pageSize);


  const fneDeleteJob = async (jobs: any) => {
    const deleteexpjobdata = {
      id: jobs.id ?? null,
    }

    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token")
      console.log('deletejpbdata', deleteexpjobdata);
      const response = await DataService.get(`/jobs/Delete?id=${deleteexpjobdata.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log('deletejobresponse', response);
          if (response.status === 200) {
            toast({
              title: "Success!",
              description: "Job deleted successfully",
            });
            //  router.push("/employers/dashboard/jobs")
            fetchJobs();
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


    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    }

  }


  const fnpublishedJob = async (jobs: any) => {
    const expjobdata = {
      id: jobs.id ?? null,
      title: jobs.title ?? "",
      company: jobs.company ?? "",
      location: jobs.location ?? "",
      type: jobs.type ?? "",
      salary: jobs.salary ?? "",
      description: jobs.description ?? "",
      requirements: jobs.requirements ?? "",
      benefits: jobs.benefits ?? [],
      employerId: user?.id.toString() ?? "",
      tags: jobs.tags ?? [],
      remote: jobs.remote ?? false,
      status: "active",
    }


    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token")
      const response = await DataService.post(`/jobs/UpdateJob`, expjobdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {

          if (response.status === 200) {
            toast({
              title: "Success!",
              description: "Job published successfully",
            });
            fetchJobs();
            fetchDrafJobs();
            fetchExpiredJobs();
            //  router.push("/employers/dashboard/jobs")
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


    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    }

  }

  const fnexpiredJob = async (jobs: any) => {
    const expjobdata = {
      id: jobs.id ?? null,
      title: jobs.title ?? "",
      company: jobs.company ?? "",
      location: jobs.location ?? "",
      type: jobs.type ?? "",
      salary: jobs.salary ?? "",
      description: jobs.description ?? "",
      requirements: jobs.requirements ?? "",
      benefits: jobs.benefits ?? [],
      employerId: user?.id.toString() ?? "",
      tags: jobs.tags ?? [],
      remote: jobs.remote ?? false,
      status: "expired",
    }


    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token")
      console.log('jobData1234', expjobdata);
      const response = await DataService.post(`/jobs/UpdateJob`, expjobdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {

          if (response.status === 200) {
            toast({
              title: "Success!",
              description: "Job updted successfully",
            });
            fetchExpiredJobs();
            fetchJobs();
            //  router.push("/employers/dashboard/jobs")
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


    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    }

  }

  const fetchDrafJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await DataService.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: "",
          remote: true,
          tag: "",
          status: "draft",
          page: 1,
          pageSize: 0,
        },
      });

      console.log('draftjpb', response);
      if (response?.status == 200) {
        setDraftjob(response.data.jobs || []);
        // setTotalData(response.data.total);
      }


      console.log('responsejobs', response);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiredJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await DataService.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: "",
          remote: true,
          tag: "",
          status: "expired",
          page: 1,
          pageSize: 0,
        },
      });

      console.log('response expired', response);
      if (response?.status == 200) {
        setExpiredjob(response.data.jobs || []);
        // setTotalData(response.data.total);
      }


      console.log('responsejobs', response);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (searchQuery) {
      const filtered = allJobs.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayJobs(filtered);
    } else {
      setDisplayJobs(allJobs); // Reset to all jobs when search is cleared
    }
  }, [searchQuery, allJobs]);




  const fetchJobs = async (page = 1, dynamicPageSize: any = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await DataService.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: "",
          remote: true,
          tag: "",
          status: "active",
          page: page,
          pageSize: pageSize,
        },
      });

      if (response?.status === 200) {
        setJobs(response.data.jobs || []);
        // setAllJobs(response.data.jobs || []);
        setTotalData(response.data.total);
        const jobsdata = response.data.jobs || [];


        if (dynamicPageSize == null && page === 1) {
          //  setDraftjob(jobsdata.filter((job: any) => job.status === "draft"));
          const activeJobs = jobsdata?.filter((job: any) => job.status === 'active');
          console.log('draftJobs', draftJobs);
          //setDraftjob(draftJobs);
          setActivejob(activeJobs);
          setDisplayJobs(jobsdata.slice(0, pageSize));
          setAllJobs(jobsdata.slice(0, pageSize));
        } else {
          setDisplayJobs(jobsdata); // Direct API result when paginated
        }

      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (currentPage === 1) {
      fetchJobs(1, null); // initial full fetch
    } else {
      fetchJobs(currentPage, pageSize); // paginated fetch after page 1
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      // If already have all jobs (from page 1), just slice
      if (page === 1 && jobs.length > 0) {
        setDisplayJobs(jobs.slice(0, pageSize));
      } else if (page !== 1) {
        // Fetch new page
        fetchJobs(page, pageSize);
      }
    }
  };


  // useEffect(() => {
  //   fetchJobs(currentPage);
  // }, [currentPage]);

  // const handlePageChange = (page: any) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };


  console.log('jobs', displayJobs);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings and applications</p>
        </div>
        {/* <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> */}

        {/* </Button> */}
      </div>
      {
        displayJobs?.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search jobs..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {/* <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                    <SelectItem value="ny">New York, NY</SelectItem>
                    <SelectItem value="other">Other Locations</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div> */}
            </div>

            <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">

              <TabsList>
                <TabsTrigger value="active" className="relative">
                  Active
                  <Badge className="ml-2 bg-primary/10 text-primary">{activejob.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="drafts" className="relative" onClick={() => fetchDrafJobs()}>
                  Drafts
                  <Badge className="ml-2 bg-muted text-muted-foreground">{draftJobs.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="expired" className="relative" onClick={() => fetchExpiredJobs()}>
                  Expired
                  <Badge className="ml-2 bg-destructive/10 text-destructive">{expiredJobs.length}</Badge>
                </TabsTrigger>
              </TabsList>


              <TabsContent value="active" className="space-y-4">

                {displayJobs.map((job) => {
                  if (!job.createdAt || !job.expiresAt) return null; // or show error card
                  const { posted, expires } = getJobTimeInfo(job.createdAt, job.expiresAt);
                  return <JobCard key={job.id} job={{ ...job, posted, expires }} fnexpiredJob={fnexpiredJob} fneDeleteJob={fneDeleteJob} />;
                })}
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="drafts" className="space-y-4">
                {draftJobs.map((job) => {
                  const { modifiedDate, expiresAt } = job;
                  const { posted, expires } = modifiedDate && expiresAt
                    ? getJobTimeInfo(modifiedDate, expiresAt)
                    : { posted: "N/A", expires: "N/A" };

                  return (
                    <Card key={job?.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{job?.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="mr-1 h-3 w-3" />
                              {job?.location}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/employers/dashboard/jobs/edit?id=${job.id}`)}>
                                Edit Draft
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => fnpublishedJob(job)}>
                                Publish Job
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => fneDeleteJob(job)}>
                                Delete Draft
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{job.type}</Badge>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="mr-1 inline-block h-3 w-3" />
                            Last edited {posted}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex w-full justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/employers/dashboard/jobs/${job.id}`)}
                          >
                            Preview
                          </Button>
                          <Button size="sm" onClick={() => fnpublishedJob(job)}>
                            Publish
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </TabsContent>


              <TabsContent value="expired" className="space-y-4">
                {expiredJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {job.location}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/employers/dashboard/jobs/${job.id}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => fnpublishedJob(job)}>Repost Job</DropdownMenuItem>
                            <DropdownMenuItem>Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{job.type}</Badge>
                        <div className="text-sm text-muted-foreground">
                          <Users className="mr-1 inline-block h-3 w-3" />
                          {job.applicants} applicants
                        </div>
                        <div className="text-sm text-destructive">
                          <Calendar className="mr-1 inline-block h-3 w-3" />
                          Expired {job.expires}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex w-full justify-between">
                        <Button variant="outline" size="sm">
                          View Applicants
                        </Button>
                        <Button size="sm" onClick={() => fnpublishedJob(job)}>Repost Job</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </>
        ) : (

          <div>No Job Found</div>
        )}
    </div>
  )
}

function JobCard({
  job,
  fnexpiredJob,
  fneDeleteJob,
}: {
  job: Job
  fnexpiredJob: (job: Job) => void,
  fneDeleteJob: (job: Job) => void;
}) {
  //console.log('jobcard', job);
  const router = useRouter();
  const { createdAt, expiresAt } = job;
  const { posted, expires } = createdAt && expiresAt
    ? getJobTimeInfo(createdAt, expiresAt)
    : { posted: "N/A", expires: "N/A" };

  // console.log('posted,expires ', posted, expires);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="mr-1 h-3 w-3" />
              {job.location}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/employers/dashboard/jobs/edit?id=${job.id}`)}>Edit Job</DropdownMenuItem>
              <DropdownMenuItem>View Applicants</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/employers/dashboard/jobs/post?id=${job.id}`)}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => fnexpiredJob(job)}>Mark as Expired</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => fneDeleteJob(job)}>Delete Job</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline">{job.type}</Badge>
          <div className="text-sm text-muted-foreground">
            <Users className="mr-1 inline-block h-3 w-3" />
            {job.applicants} applicants
          </div>
          <div className="text-sm text-muted-foreground">
            <Clock className="mr-1 inline-block h-3 w-3" />
            Posted {posted}
          </div>
          <div className="text-sm text-muted-foreground">
            <Calendar className="mr-1 inline-block h-3 w-3" />
            Expires in {expires}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push(`/employers/dashboard/jobs/${job.id}`)}>
            View Details
          </Button>
          <Button variant="outline" size="sm">
            View Applicants
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
