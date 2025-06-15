"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { JobApplicationModal } from "@/components/job-application-modal"
import { checkIfAlreadyApplied } from "@/lib/actions"

interface ApplyJobButtonProps {
  jobId: number
  jobTitle: string
  companyName: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ApplyJobButton({
  jobId,
  jobTitle,
  companyName,
  variant = "default",
  size = "default",
  className,
}: ApplyJobButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check application status on mount and when user changes
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) return

      setIsChecking(true)
      try {
        const alreadyApplied = await checkIfAlreadyApplied(jobId, user.id)
        setHasApplied(alreadyApplied)
      } catch (error) {
        console.error("Error checking application status:", error)
      } finally {
        setIsChecking(false)
      }
    }

    if (user && !isLoading) {
      checkApplicationStatus()
    }
  }, [user, jobId, isLoading])

  const handleClick = async () => {
    if (isLoading) {
      return
    }

    if (!user) {
      // Redirect to login if not authenticated
      toast({
        title: "Login required",
        description: "Please log in to apply for this job",
      })
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/jobs/${jobId}`)}`)
      return
    }

    // Check if user is a job seeker
    if (user.roles !== "job-seeker") {
      toast({
        title: "Not available",
        description: "Only job seekers can apply for jobs",
        variant: "destructive",
      })
      return
    }

    // If we already know the user has applied, show toast
    if (hasApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied for this job",
      })
      return
    }

    // Double-check if already applied (in case state is stale)
    setIsChecking(true)
    try {
      const alreadyApplied = await checkIfAlreadyApplied(jobId, user.id)
      if (alreadyApplied) {
        setHasApplied(true)
        toast({
          title: "Already applied",
          description: "You have already applied for this job",
        })
        return
      }

      // Open the application modal
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error checking application status:", error)
    } finally {
      setIsChecking(false)
    }



  }

  const handleApplicationSuccess = () => {
    // Update local state to show "Already Applied" immediately
    setHasApplied(true)
    setIsModalOpen(false)

    // Show success toast
    toast({
      title: "Application submitted",
      description: "Your job application has been submitted successfully",
    })

    // Force refresh to update UI
    router.refresh()
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
        disabled={isLoading || isChecking || hasApplied}
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : hasApplied ? (
          "Already Applied"
        ) : (
          "Apply Now"
        )}
      </Button>

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={jobId}
        jobTitle={jobTitle}
        companyName={companyName}
        onSuccess={handleApplicationSuccess}
      />
    </>
  )
}
