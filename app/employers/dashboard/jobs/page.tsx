import { cn } from "@/lib/utils"
import { Clock, Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployerSidebar } from "@/components/employer-sidebar"

export default function EmployerJobsPage() {
  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      status: "active",
      applicants: 48,
      posted: "2 days ago",
      expires: "28 days remaining",
    },
    {
      id: 2,
      title: "Product Manager",
      location: "Remote",
      type: "Full-time",
      status: "active",
      applicants: 36,
      posted: "3 days ago",
      expires: "27 days remaining",
    },
    {
      id: 3,
      title: "UX Designer",
      location: "New York, NY",
      type: "Full-time",
      status: "active",
      applicants: 29,
      posted: "5 days ago",
      expires: "25 days remaining",
    },
    {
      id: 4,
      title: "Backend Developer",
      location: "Austin, TX",
      type: "Full-time",
      status: "expiring",
      applicants: 18,
      posted: "2 weeks ago",
      expires: "2 days remaining",
    },
    {
      id: 5,
      title: "Marketing Specialist",
      location: "Chicago, IL",
      type: "Contract",
      status: "draft",
      applicants: 0,
      posted: "Not posted",
      expires: "N/A",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      location: "Seattle, WA",
      type: "Full-time",
      status: "closed",
      applicants: 42,
      posted: "30 days ago",
      expires: "Expired",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <EmployerSidebar />
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">Manage your job listings and create new job postings</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="Search jobs..." />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>You have {jobs.length} job listings in total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-8 border-b bg-slate-50 p-3 text-sm font-medium">
                  <div className="col-span-3">Job Title</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Applicants</div>
                  <div className="col-span-1">Posted</div>
                  <div className="col-span-1">Expires</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {jobs.map((job) => (
                    <div key={job.id} className="grid grid-cols-8 items-center p-3">
                      <div className="col-span-3">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.location} • {job.type}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            job.status === "active" && "bg-green-100 text-green-800",
                            job.status === "draft" && "bg-slate-100 text-slate-800",
                            job.status === "closed" && "bg-red-100 text-red-800",
                            job.status === "expiring" && "bg-amber-100 text-amber-800",
                          )}
                        >
                          {job.status === "active" && "Active"}
                          {job.status === "draft" && "Draft"}
                          {job.status === "closed" && "Closed"}
                          {job.status === "expiring" && "Expiring Soon"}
                        </span>
                      </div>
                      <div className="col-span-1">{job.applicants}</div>
                      <div className="col-span-1">
                        <div className="flex items-center">
                          {job.status !== "draft" && (
                            <>
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{job.posted}</span>
                            </>
                          )}
                          {job.status === "draft" && <span className="text-sm">{job.posted}</span>}
                        </div>
                      </div>
                      <div className="col-span-1 text-sm">{job.expires}</div>
                      <div className="col-span-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            {job.status === "active" && (
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Close</span>
                              </DropdownMenuItem>
                            )}
                            {job.status === "draft" && (
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </div>
  )
}
