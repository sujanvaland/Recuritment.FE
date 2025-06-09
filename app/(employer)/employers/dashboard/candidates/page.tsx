"use client"

import { useState, useEffect } from "react"
import {
  Briefcase,
  Calendar,
  Check,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"

// Sample candidate data
const candidates = [
  {
    id: 1,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "/abstract-geometric-shapes.png",
    title: "Senior Frontend Developer",
    experience: "8 years",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    education: "B.S. Computer Science, Stanford University",
    status: "active",
    rating: 4,
    lastActivity: "2 days ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "Remote",
    avatar: "/number-two-graphic.png",
    title: "UX/UI Designer",
    experience: "6 years",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    education: "M.A. Design, Rhode Island School of Design",
    status: "active",
    rating: 5,
    lastActivity: "1 day ago",
  },
  {
    id: 3,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    avatar: "/abstract-geometric-shapes.png",
    title: "DevOps Engineer",
    experience: "5 years",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    education: "B.S. Computer Engineering, MIT",
    status: "active",
    rating: 3,
    lastActivity: "3 days ago",
  },
  {
    id: 4,
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    phone: "+1 (555) 456-7890",
    location: "Boston, MA",
    avatar: "/abstract-geometric-shapes.png",
    title: "Product Manager",
    experience: "7 years",
    skills: ["Product Strategy", "Agile", "User Stories", "Roadmapping"],
    education: "MBA, Harvard Business School",
    status: "active",
    rating: 4,
    lastActivity: "5 days ago",
  },
  {
    id: 5,
    name: "Jessica Lee",
    email: "jessica.lee@example.com",
    phone: "+1 (555) 567-8901",
    location: "Chicago, IL",
    avatar: "/abstract-geometric-composition-5.png",
    title: "Marketing Specialist",
    experience: "4 years",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    education: "B.A. Marketing, Northwestern University",
    status: "inactive",
    rating: 4,
    lastActivity: "2 weeks ago",
  },
  {
    id: 6,
    name: "Robert Kim",
    email: "robert.kim@example.com",
    phone: "+1 (555) 678-9012",
    location: "Remote",
    avatar: "/abstract-geometric-shapes.png",
    title: "Backend Developer",
    experience: "9 years",
    skills: ["Java", "Spring Boot", "Microservices", "SQL"],
    education: "M.S. Computer Science, UC Berkeley",
    status: "active",
    rating: 5,
    lastActivity: "Yesterday",
  },
  {
    id: 7,
    name: "Amanda Martinez",
    email: "amanda.martinez@example.com",
    phone: "+1 (555) 789-0123",
    location: "Seattle, WA",
    avatar: "/abstract-geometric-seven.png",
    title: "Data Analyst",
    experience: "3 years",
    skills: ["Python", "R", "SQL", "Tableau"],
    education: "B.S. Statistics, University of Washington",
    status: "inactive",
    rating: 3,
    lastActivity: "1 month ago",
  },
  {
    id: 8,
    name: "Thomas Wilson",
    email: "thomas.wilson@example.com",
    phone: "+1 (555) 890-1234",
    location: "Austin, TX",
    avatar: "/abstract-geometric-sculpture.png",
    title: "Customer Support Specialist",
    experience: "2 years",
    skills: ["Customer Service", "Problem Solving", "Communication", "CRM Software"],
    education: "B.A. Communications, University of Texas",
    status: "active",
    rating: 4,
    lastActivity: "4 days ago",
  },
]




export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)




  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await DataService.get("/candidates", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: "",
            JobId: 5,
            page: 1,
            pageSize: "5",
          },
        });
        console.log('responsejobs', response.data);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);




  // Filter candidates based on selected tab
  const filteredCandidates = candidates.filter((candidate) => {
    if (selectedTab === "all") return true
    if (selectedTab === "active" && candidate.status === "active") return true
    if (selectedTab === "inactive" && candidate.status === "inactive") return true
    return false
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground">Browse and manage your talent pool</p>
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
              placeholder="Search candidates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all-skills">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-skills">All Skills</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="design">UI/UX Design</SelectItem>
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
            <Badge className="ml-2 bg-primary/10 text-primary">{candidates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="relative">
            Active
            <Badge className="ml-2 bg-green-100 text-green-700">
              {candidates.filter((candidate) => candidate.status === "active").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="relative">
            Inactive
            <Badge className="ml-2 bg-gray-100 text-gray-700">
              {candidates.filter((candidate) => candidate.status === "inactive").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}



function CandidateCard({ candidate }: { candidate: any }) {
  const getStatusBadge = (status: any) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
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
              <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription>{candidate.title}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(candidate.status)}
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
                <DropdownMenuItem>Contact Candidate</DropdownMenuItem>
                <DropdownMenuItem>Add to Job</DropdownMenuItem>
                <DropdownMenuItem>Add Note</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Contact Information</div>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                {candidate.email}
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                {candidate.phone}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {candidate.location}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Professional Details</div>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                {candidate.experience} of experience
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                {candidate.education}
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                Last active {candidate.lastActivity}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="text-sm font-medium">Skills</div>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill: any, index: any) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-3 w-3" />
              View Profile
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-3 w-3" />
              Download Resume
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-3 w-3" />
              Contact
            </Button>
            <Button size="sm">
              <Check className="mr-2 h-3 w-3" />
              Add to Job
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
