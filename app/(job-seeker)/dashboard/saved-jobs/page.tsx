"use client"

import { useEffect, useState } from "react"
import { Bookmark, Building, Clock, ExternalLink, MapPin, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

// Types for our saved job data
interface SavedJob {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  posted: string
  logo: string
  skills: string[]
  saved: string
}

export default function SavedJobsPage() {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate API call to fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // await fetch('/api/saved-jobs')

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Dummy data
        const dummySavedJobs: SavedJob[] = [
          {
            id: "1",
            title: "Senior Frontend Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$120K - $150K",
            posted: "2 days ago",
            logo: "/abstract-tc.png",
            skills: ["React", "TypeScript", "Next.js"],
            saved: "2023-04-15",
          },
          {
            id: "2",
            title: "UX Designer",
            company: "CreativeMinds",
            location: "Remote",
            type: "Contract",
            salary: "$80K - $100K",
            posted: "3 days ago",
            logo: "/abstract-geometric-cm.png",
            skills: ["Figma", "Adobe XD", "Sketch"],
            saved: "2023-04-14",
          },
          {
            id: "3",
            title: "Full Stack Developer",
            company: "WebSolutions",
            location: "New York, NY",
            type: "Full-time",
            salary: "$110K - $140K",
            posted: "1 week ago",
            logo: "/abstract-geometric-ws.png",
            skills: ["JavaScript", "Node.js", "MongoDB"],
            saved: "2023-04-10",
          },
          {
            id: "4",
            title: "Product Manager",
            company: "InnovateCo",
            location: "Seattle, WA",
            type: "Full-time",
            salary: "$130K - $170K",
            posted: "5 days ago",
            logo: "/circuit-cityscape.png",
            skills: ["Agile", "Product Strategy", "User Research"],
            saved: "2023-04-08",
          },
          {
            id: "5",
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Austin, TX",
            type: "Full-time",
            salary: "$110K - $140K",
            posted: "1 week ago",
            logo: "/computed-tomography-scan.png",
            skills: ["Docker", "Kubernetes", "CI/CD"],
            saved: "2023-04-05",
          },
        ]

        setSavedJobs(dummySavedJobs)
      } catch (error) {
        console.error("Error fetching saved jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedJobs()
  }, [])

  // Filter saved jobs based on search query
  const filteredJobs = savedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Handle removing a saved job
  const handleRemoveSavedJob = (id: string) => {
    // In a real app, this would be an API call
    // await fetch(`/api/saved-jobs/${id}`, { method: 'DELETE' })

    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== id))
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved jobs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} saved
        </div>
      </div>

      {isLoading ? (
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
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                    <img
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.company} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="mr-1 h-3 w-3" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Saved {new Date(job.saved).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleRemoveSavedJob(job.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove saved job</span>
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-1">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {job.type}
                    </span>
                    <span className="ml-2 text-sm font-medium">{job.salary}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Posted {job.posted}</span>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between p-4">
                <Button asChild variant="outline" size="sm">
                  <a href={`/jobs/${job.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </a>
                </Button>
                <Button size="sm">Apply Now</Button>
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
              <a href="/jobs">Browse Jobs</a>
            </Button>
          )}
        </div>
      )}
    </>
  )
}
