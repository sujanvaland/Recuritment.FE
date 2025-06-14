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
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context"

// Sample application data
const applications = [
  {
    id: 1,
    candidate: {
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      avatar: "/abstract-geometric-shapes.png",
    },
    job: "Senior Frontend Developer",
    location: "San Francisco, CA",
    appliedDate: "May 15, 2023",
    status: "review",
    rating: 4,
  },
  {
    id: 2,
    candidate: {
      name: "Michael Chen",
      email: "michael.chen@example.com",
      avatar: "/number-two-graphic.png",
    },
    job: "UX/UI Designer",
    location: "Remote",
    appliedDate: "May 18, 2023",
    status: "interview",
    rating: 5,
  },
  {
    id: 3,
    candidate: {
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/abstract-geometric-shapes.png",
    },
    job: "DevOps Engineer",
    location: "New York, NY",
    appliedDate: "May 20, 2023",
    status: "review",
    rating: 3,
  },
  {
    id: 4,
    candidate: {
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      avatar: "/abstract-geometric-shapes.png",
    },
    job: "Product Manager",
    location: "Boston, MA",
    appliedDate: "May 22, 2023",
    status: "interview",
    rating: 4,
  },
  {
    id: 5,
    candidate: {
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      avatar: "/abstract-geometric-composition-5.png",
    },
    job: "Marketing Specialist",
    location: "Chicago, IL",
    appliedDate: "May 25, 2023",
    status: "review",
    rating: 4,
  },
  {
    id: 6,
    candidate: {
      name: "Robert Kim",
      email: "robert.kim@example.com",
      avatar: "/abstract-geometric-shapes.png",
    },
    job: "Backend Developer",
    location: "Remote",
    appliedDate: "May 27, 2023",
    status: "offer",
    rating: 5,
  },
  {
    id: 7,
    candidate: {
      name: "Amanda Martinez",
      email: "amanda.martinez@example.com",
      avatar: "/abstract-geometric-seven.png",
    },
    job: "Data Analyst",
    location: "Seattle, WA",
    appliedDate: "May 28, 2023",
    status: "review",
    rating: 3,
  },
  {
    id: 8,
    candidate: {
      name: "Thomas Wilson",
      email: "thomas.wilson@example.com",
      avatar: "/abstract-geometric-sculpture.png",
    },
    job: "Customer Support Specialist",
    location: "Austin, TX",
    appliedDate: "May 30, 2023",
    status: "rejected",
    rating: 2,
  },
]




export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const [totalData, setTotalData] = useState(0);

  // Filter applications based on selected tab
  const filteredApplications = applications.filter((app) => {
    if (selectedTab === "all") return true
    if (selectedTab === "review" && app.status === "review") return true
    if (selectedTab === "interview" && app.status === "interview") return true
    if (selectedTab === "offer" && app.status === "offer") return true
    if (selectedTab === "rejected" && app.status === "rejected") return true
    return false
  })


  useEffect(() => {
    fetchApplications();
  }, []);


  const pageSize = 5;
  const totalPages = Math.ceil(totalData / pageSize);

  const fetchApplications = async () => {
    setLoading(true);
    console.log('call applicaiton api');
    try {
      const token = localStorage.getItem("token");
      const response = await DataService.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('applications response', response);
      if (response?.status === 200) {
        console.log('applications response');
      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Manage and review candidate applications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
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
          <Select defaultValue="all-jobs">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-jobs">All Jobs</SelectItem>
              <SelectItem value="frontend">Frontend Developer</SelectItem>
              <SelectItem value="ux">UX/UI Designer</SelectItem>
              <SelectItem value="devops">DevOps Engineer</SelectItem>
              <SelectItem value="product">Product Manager</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="relative">
            All
            <Badge className="ml-2 bg-primary/10 text-primary">{applications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="review" className="relative">
            Review
            <Badge className="ml-2 bg-amber-100 text-amber-700">
              {applications.filter((app) => app.status === "review").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="interview" className="relative">
            Interview
            <Badge className="ml-2 bg-blue-100 text-blue-700">
              {applications.filter((app) => app.status === "interview").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="offer" className="relative">
            Offer
            <Badge className="ml-2 bg-green-100 text-green-700">
              {applications.filter((app) => app.status === "offer").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            <Badge className="ml-2 bg-red-100 text-red-700">
              {applications.filter((app) => app.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </TabsContent>

        <TabsContent value="offer" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApplicationCard({ application }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "review":
        return <Badge className="bg-amber-100 text-amber-700">Review</Badge>
      case "interview":
        return <Badge className="bg-blue-100 text-blue-700">Interview</Badge>
      case "offer":
        return <Badge className="bg-green-100 text-green-700">Offer</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={application.candidate.avatar || "/placeholder.svg"} alt={application.candidate.name} />
              <AvatarFallback>
                {application.candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{application.candidate.name}</CardTitle>
              <CardDescription>{application.candidate.email}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>View Resume</DropdownMenuItem>
                <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                <DropdownMenuItem>Send Message</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Reject Application</DropdownMenuItem>
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
              <Badge variant="outline">{application.job}</Badge>
              <div className="text-xs text-muted-foreground">
                <MapPin className="mr-1 inline-block h-3 w-3" />
                {application.location}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Application Details</div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">
                <Calendar className="mr-1 inline-block h-3 w-3" />
                Applied on {application.appliedDate}
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < application.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
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
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-3 w-3" />
              Download Resume
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
              <X className="mr-2 h-3 w-3" />
              Reject
            </Button>
            <Button size="sm">
              <Check className="mr-2 h-3 w-3" />
              Move to Interview
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
