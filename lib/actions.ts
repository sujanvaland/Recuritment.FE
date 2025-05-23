"use server"

import { revalidatePath } from "next/cache"

// Mock database for job applications
const jobApplications: any[] = []

// Mock database for user applied jobs
const userAppliedJobs: Record<string, number[]> = {}

export async function submitJobApplication({
  jobId,
  coverLetter,
  resumeUrl,
}: {
  jobId: number
  coverLetter: string
  resumeUrl: string
}) {
  // In a real app, you would validate the user is authenticated here
  // and get their ID from the session
  const userId = "2" // Hardcoded for demo, would come from auth session

  // Create a new application
  const newApplication = {
    id: `app-${Date.now()}`,
    jobId,
    userId,
    coverLetter,
    resumeUrl,
    status: "applied",
    appliedDate: new Date().toISOString(),
  }

  // Add to our mock database
  jobApplications.push(newApplication)

  // Track that this user has applied to this job
  if (!userAppliedJobs[userId]) {
    userAppliedJobs[userId] = []
  }
  userAppliedJobs[userId].push(jobId)

  // Revalidate the applications page and job page
  revalidatePath("/dashboard/applications")
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath("/jobs") // Revalidate the jobs listing page too

  return { success: true, application: newApplication }
}

export async function getJobApplications(userId: string) {
  // In a real app, you would fetch from a database
  return jobApplications.filter((app) => app.userId === userId)
}

export async function checkIfAlreadyApplied(jobId: number, userId: string) {
  // Check if the user has already applied to this job
  return userAppliedJobs[userId]?.includes(jobId) || false
}
