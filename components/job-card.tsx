"use client"

import { useState } from "react"
import Link from "next/link"
import { BookmarkIcon, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplyJobButton } from "@/components/apply-job-button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { DataService } from "@/services/axiosInstance";

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    type: string
    salary: string
    tags: string[]
    posted: string
    logo: string
  }
}

export function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()



  const savejobs = async () => {
    const jobId = {
      id: job.id ?? null,
    }

    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token");

      console.log('ajaytoken', token);
      const response = await DataService.post(`/SavedJobs/${jobId?.id}`, jobId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {

          console.log('response', response);

          if (response.status === 200) {

            console.log('saved', response);
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


  // const toggleSave = () => {
  //   setIsSaved(!isSaved)
  // }

  console.log('jobcard', job);

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
            onClick={() => savejobs()}
          >
            <BookmarkIcon className="h-5 w-5" />
            <span className="sr-only">{isSaved ? "Unsave" : "Save"} job</span>
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{job.type}</Badge>
            <Badge variant="outline">{job.salary}</Badge>
            {job.tags.slice(0, 3).map((tags) => (
              <Badge variant="secondary" key={tags}>
                {tags}
              </Badge>
            ))}
            {job?.tags?.length > 3 && <Badge variant="secondary">+{job?.tags?.length - 3} more</Badge>}
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
