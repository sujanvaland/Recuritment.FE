"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, MoreHorizontal, Plus, Search, SlidersHorizontal, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    type: "Full-time",
    applicants: 24,
    posted: "2 weeks ago",
    status: "active",
    expires: "30 days",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    location: "Remote",
    type: "Full-time",
    applicants: 18,
    posted: "3 days ago",
    status: "active",
    expires: "29 days",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    location: "New York, NY",
    type: "Full-time",
    applicants: 12,
    posted: "1 week ago",
    status: "active",
    expires: "25 days",
  },
  {
    id: 4,
    title: "Product Manager",
    location: "Boston, MA",
    type: "Full-time",
    applicants: 31,
    posted: "3 weeks ago",
    status: "active",
    expires: "10 days",
  },
  {
    id: 5,
    title: "Marketing Specialist",
    location: "Chicago, IL",
    type: "Contract",
    applicants: 8,
    posted: "5 days ago",
    status: "active",
    expires: "25 days",
  },
  {
    id: 6,
    title: "Backend Developer",
    location: "Remote",
    type: "Full-time",
    applicants: 15,
    posted: "2 days ago",
    status: "active",
    expires: "28 days",
  },
  {
    id: 7,
    title: "Data Analyst",
    location: "Seattle, WA",
    type: "Part-time",
    applicants: 7,
    posted: "1 week ago",
    status: "active",
    expires: "20 days",
  },
  {
    id: 8,
    title: "Customer Support Specialist",
    location: "Austin, TX",
    type: "Full-time",
    applicants: 22,
    posted: "4 days ago",
    status: "active",
    expires: "26 days",
  },
  {
    id: 9,
    title: "Junior Web Developer",
    location: "San Diego, CA",
    type: "Internship",
    applicants: 19,
    posted: "1 week ago",
    status: "active",
    expires: "22 days",
  },
  {
    id: 10,
    title: "Senior Project Manager",
    location: "Denver, CO",
    type: "Full-time",
    applicants: 14,
    posted: "2 weeks ago",
    status: "active",
    expires: "15 days",
  },
]

// Sample draft jobs
const draftJobs = [
  {
    id: 11,
    title: "Mobile App Developer",
    location: "Portland, OR",
    type: "Full-time",
    lastEdited: "Yesterday",
  },
  {
    id: 12,
    title: "Technical Writer",
    location: "Remote",
    type: "Contract",
    lastEdited: "3 days ago",
  },
]

// Sample expired jobs
const expiredJobs = [
  {
    id: 13,
    title: "Frontend Developer",
    location: "San Francisco, CA",
    type: "Full-time",
    applicants: 42,
    expired: "2 days ago",
  },
  {
    id: 14,
    title: "HR Manager",
    location: "Chicago, IL",
    type: "Full-time",
    applicants: 28,
    expired: "1 week ago",
  },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("active")

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings and applications</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

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
        <div className="flex gap-2">
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
        </div>
      </div>

      <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="relative">
            Active
            <Badge className="ml-2 bg-primary/10 text-primary">{jobs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="relative">
            Drafts
            <Badge className="ml-2 bg-muted text-muted-foreground">{draftJobs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="relative">
            Expired
            <Badge className="ml-2 bg-destructive/10 text-destructive">{expiredJobs.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftJobs.map((job) => (
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
                      <DropdownMenuItem>Edit Draft</DropdownMenuItem>
                      <DropdownMenuItem>Publish Job</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Draft</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{job.type}</Badge>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    Last edited {job.lastEdited}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full justify-between">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button size="sm">Publish</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Repost Job</DropdownMenuItem>
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
                    Expired {job.expired}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full justify-between">
                  <Button variant="outline" size="sm">
                    View Applicants
                  </Button>
                  <Button size="sm">Repost Job</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JobCard({ job }) {
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
              <DropdownMenuItem>Edit Job</DropdownMenuItem>
              <DropdownMenuItem>View Applicants</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Close Job</DropdownMenuItem>
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
            Posted {job.posted}
          </div>
          <div className="text-sm text-muted-foreground">
            <Calendar className="mr-1 inline-block h-3 w-3" />
            Expires in {job.expires}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full justify-between">
          <Button variant="outline" size="sm">
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
