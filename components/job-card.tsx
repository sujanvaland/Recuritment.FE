"use client"

import { useState } from "react"
import Link from "next/link"
import { BookmarkIcon, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplyJobButton } from "@/components/apply-job-button"

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    type: string
    salary: string
    skills: string[]
    posted: string
    logo: string
  }
}

export function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const toggleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
              <img src={job.logo || "/placeholder.svg"} alt={job.company} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold">
                <Link href={`/jobs/${job.id}`} className="hover:underline">
                  {job.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">{job.company}</p>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="mr-1 h-3 w-3" />
                {job.location}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={isSaved ? "text-primary" : "text-gray-400"}
            onClick={toggleSave}
          >
            <BookmarkIcon className="h-5 w-5" />
            <span className="sr-only">{isSaved ? "Unsave" : "Save"} job</span>
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{job.type}</Badge>
            <Badge variant="outline">{job.salary}</Badge>
            {job.skills.slice(0, 3).map((skill) => (
              <Badge variant="secondary" key={skill}>
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && <Badge variant="secondary">+{job.skills.length - 3} more</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-3">
        <p className="text-sm text-muted-foreground">Posted {job.posted}</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
          <ApplyJobButton jobId={job.id} jobTitle={job.title} companyName={job.company} size="sm" />
        </div>
      </CardFooter>
    </Card>
  )
}
