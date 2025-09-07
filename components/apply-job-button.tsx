"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { JobApplicationModal } from "@/components/job-application-modal"
import { DataService } from "@/services/axiosInstance"

interface ApplyJobButtonProps {
  jobId: number
  jobTitle: string
  companyName: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
}

// Helper function to get user role safely (handles both 'role' and 'roles' properties)
const getUserRole = (user: any): string | null => {
  return user?.role || user?.roles || null;
};

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

      console.log('User object:', user);
      console.log('User ID type:', typeof user.id, 'Value:', user.id);

      setIsChecking(true)
      try {
        // Check if user has already applied using API
        const token = localStorage.getItem("token");
        if (!token) {
          setIsChecking(false);
          return;
        }

        console.log('Checking application status for jobId:', jobId, 'userId:', user.id);

        // Check if user has already applied for this specific job
        const response = await DataService.get(`/applications/check/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Application check response:', response);

        // Use the applied field from the API response
        const alreadyApplied = response.data?.applied || false;
        setHasApplied(alreadyApplied)
      } catch (error) {
        console.error("Error checking application status:", error)
        // If API doesn't exist yet, default to false
        setHasApplied(false)
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

    console.log('HandleClick - User:', user);
    console.log('HandleClick - User ID:', user.id, 'Type:', typeof user.id);

    // Check if user is a job seeker
    const userRole = getUserRole(user);
    console.log('User role:', userRole);
    if (userRole !== "job-seeker") {
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
      // Check if user has already applied using API
      const token = localStorage.getItem("token");
      if (!token) {
        setIsChecking(false);
        return;
      }

      console.log('Double-checking application for jobId:', jobId, 'userId:', user.id);

      const response = await DataService.get(`/applications/check/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Double-check response:', response);

      const alreadyApplied = response.data?.applied || false;
      if (alreadyApplied) {
        setHasApplied(true)
        toast({
          title: "Already applied",
          description: "You have already applied for this job",
        })
        return
      }

      // Open the application modal
      console.log('Opening application modal for jobId:', jobId);
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error checking application status:", error)
      // If API doesn't exist yet, proceed with application
      console.log('Proceeding with application despite API error');
      setIsModalOpen(true)
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
  className={`bg-[#309689] hover:bg-emerald-600 text-white ${className ?? ""}`}
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
