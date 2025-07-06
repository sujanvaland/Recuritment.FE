"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, Building, Calendar, Clock, MapPin, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplyJobButton } from "@/components/apply-job-button"
import { DataService } from "@/services/axiosInstance";
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation'
import { getJobTimeInfo } from "@/utils/dateComponent"


type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  createdAt: string;
  posted: string;
  deadline: string;
  expiresAt: string;
  logo: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  tags: string[];
};


export default function JobDetailsPage() {
  // Mock job data - in a real app, this would be fetched from an API
  const params = useParams()
  const jobid = params?.id
  const [job, setJob] = useState<Job | null>(null);

  console.log('jobid', jobid);

  // const job = {
  //   id: "",
  //   title: "Senior Frontend Developer",
  //   company: "TechCorp",
  //   location: "San Francisco, CA",
  //   type: "Full-time",
  //   salary: "$120K - $150K",
  //   experience: "5+ years",
  //   posted: "2 days ago",
  //   deadline: "30 days remaining",
  //   logo: "/abstract-tc.png",
  //   description: `
  //     <p>We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications.</p>

  //     <p>As a Senior Frontend Developer, you will work closely with our design and backend teams to create seamless user experiences. You should have a strong understanding of modern frontend frameworks and best practices.</p>
  //   `,
  //   responsibilities: [
  //     "Develop and maintain our web applications using React and TypeScript",
  //     "Collaborate with designers to implement UI/UX designs",
  //     "Write clean, maintainable, and efficient code",
  //     "Optimize applications for maximum speed and scalability",
  //     "Implement responsive design and ensure cross-browser compatibility",
  //     "Participate in code reviews and mentor junior developers",
  //   ],
  //   requirements: [
  //     "5+ years of experience in frontend development",
  //     "Strong proficiency in JavaScript, TypeScript, HTML, and CSS",
  //     "Experience with React, Next.js, and state management libraries",
  //     "Understanding of RESTful APIs and GraphQL",
  //     "Knowledge of responsive design and cross-browser compatibility",
  //     "Familiarity with testing frameworks such as Jest and React Testing Library",
  //     "Experience with version control systems (Git)",
  //     "Bachelor's degree in Computer Science or related field (or equivalent experience)",
  //   ],
  //   benefits: [
  //     "Competitive salary and equity",
  //     "Health, dental, and vision insurance",
  //     "401(k) matching",
  //     "Flexible work hours and remote work options",
  //     "Professional development budget",
  //     "Generous vacation policy",
  //     "Modern office with snacks and drinks",
  //   ],
  //   skills: ["React", "TypeScript", "Next.js", "CSS", "HTML", "JavaScript"],
  //   // companyInfo: {
  //   //   name: "TechCorp",
  //   //   description:
  //   //     "TechCorp is a leading technology company specializing in web and mobile applications. We are dedicated to creating innovative solutions for our clients.",
  //   //   website: "https://techcorp.example.com",
  //   //   size: "51-200 employees",
  //   //   industry: "Information Technology",
  //   //   founded: "2010",
  //   // },
  // }


  useEffect(() => {
    console.log('useEffect triggered with jobid:', jobid);
    if (!jobid) {
      console.warn('No jobid available yest');
      return; // Don't run fetch if no id
    }
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await DataService.get(`/jobs/${jobid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('editresponsejobs', response.data);
        if (response.data) {
          setJob(response.data);
        }


      } catch (err) {
        console.error("Failed to fetch job:", err);
      }
    };
    fetchJobs();
  }, [jobid]);

  let posted = "";
  let expires = "";

  if (job && job.createdAt && job.expiresAt) {
    const timeInfo = getJobTimeInfo(job.createdAt, job.expiresAt);
    posted = timeInfo.posted;
    expires = timeInfo.expires;
  }



  return (
    <div className="container px-4 py-8 md:px-6 md:py-0">
      <div className="mb-6">
        <Link
          href="/employers/dashboard/jobs"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              {/* <img
                src={job?.logo || "/placeholder.svg"}
                alt={`${job?.company} logo`}
                className="h-full w-full object-cover"
              /> */}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{job?.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Building className="mr-1 h-4 w-4" />
                  {job?.company}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job?.location}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {job?.type}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Posted {posted}
                </div>
              </div>
            </div>
          </div>



          <Tabs defaultValue="description">
            <TabsContent value="description" className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
                <div
                  className="prose max-w-none text-muted-foreground" >
                  {job?.description}
                </div>
              </div>
              {/*
              <div>
                <h3 className="mb-4 text-lg font-semibold">Responsibilities</h3>
                 <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  {job?.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul> 
              </div>*/}

              <div>
                <h3 className="mb-4 text-lg font-semibold">Requirements</h3>
                <div>{job?.requirements}</div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Benefits</h3>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  {job?.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.tags.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>

        <div>
          <div className="rounded-lg border bg-[#EBF5F4] p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Job Summary</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Job Type</h3>
                <p className="text-sm text-muted-foreground">{job?.type}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Salary Range</h3>
                <p className="text-sm text-muted-foreground">{job?.salary}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Experience</h3>
                <p className="text-sm text-muted-foreground">{job?.experience}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Location</h3>
                <p className="text-sm text-muted-foreground">{job?.location}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Posted</h3>
                <p className="text-sm text-muted-foreground"> {posted}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Application Deadline</h3>
                <p className="text-sm text-muted-foreground">{job?.deadline}</p>
              </div>
            </div>
            {/* <ApplyJobButton jobId={job?.id} jobTitle={job?.title} companyName={job?.company} className="mt-6 w-full" /> */}
          </div>

          <div className="mt-6 rounded-lg border bg-[#EBF5F4] p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Similar Jobs</h2>
            <div className="space-y-4">
              {/* {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded bg-slate-100"></div>
                  <div>
                    <h3 className="font-medium">Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">WebTech • Remote • Full-time</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
