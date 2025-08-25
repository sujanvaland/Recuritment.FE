"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { submitJobApplication } from "@/lib/actions"
import { getUserProfile } from "@/lib/profile"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/services/axiosInstance";

interface JobApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: number
  jobTitle: string
  companyName: string
  onSuccess?: () => void
}

export function JobApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSuccess,
}: JobApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeOption, setResumeOption] = useState<"existing" | "new">("existing")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  // Function to upload resume file
  const uploadResume = async (file: File): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://localhost:65437/api/File/UploadFile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      console.log('Resume upload response:', result);

      // Extract URL from actualUrl field based on API response structure
      return result[0].actualUrl || '';
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw new Error('Failed to upload resume file');
    }
  };

  // Handle file selection and immediate upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);

    if (file) {
      setIsUploadingResume(true);
      try {
        const uploadedUrl = await uploadResume(file);
        setUploadedResumeUrl(uploadedUrl);
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been uploaded and is ready for submission.",
        });
      } catch (uploadError) {
        toast({
          title: "Upload failed",
          description: uploadError instanceof Error ? uploadError.message : "Failed to upload resume",
          variant: "destructive",
        });
        setResumeFile(null);
        setUploadedResumeUrl("");
      } finally {
        setIsUploadingResume(false);
      }
    } else {
      setUploadedResumeUrl("");
    }
  };

  // Fetch user profile data including resume
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      setIsLoadingProfile(true)
      try {
        const profile = await getUserProfile(user.id)
        setUserProfile(profile)

        // If user has a resume, default to using it
        if (profile?.resumeUrl) {
          setResumeOption("existing")
        } else {
          setResumeOption("new")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setResumeOption("new") // Default to new if there's an error
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('jobId', jobId);

    try {
      const token = localStorage.getItem("token") || "";
      let resumeUrl = "";

      // Handle resume upload or use existing resume
      if (resumeOption === "existing" && userProfile?.resumeUrl) {
        resumeUrl = userProfile.resumeUrl;
      } else if (resumeOption === "new" && uploadedResumeUrl) {
        resumeUrl = uploadedResumeUrl;
      } else {
        toast({
          title: "Resume required",
          description: "Please upload a resume or select your existing resume",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const submitdata = {
        jobId: jobId,         // Set a valid jobId if needed
        resumeUrl: resumeUrl,
        coverLetter: coverLetter,   // Use empty string or remove if not required
      }

      console.log('submitdata', submitdata);

      const response = await DataService.post("/applications", submitdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        if (onSuccess) {
          onSuccess()
        } else {
          toast({
            title: "Application submitted!",
            description: `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`,
          });
          setIsSubmitting(false);

          // Close the modal and redirect to the applications page
          onClose()
          router.push("/dashboard/applications")
          router.refresh()
        }
      } else if (response?.status === 409) {
        toast({
          title: "Application error!",
          description: `${response?.data?.error}`,
        });
        setIsSubmitting(false);
        onClose();
      }

      console.log("job submit Response:", response);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>Complete the form below to apply for this position at {companyName}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Resume/CV</Label>

            {isLoadingProfile ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading your profile...</span>
              </div>
            ) : (
              <RadioGroup
                value={resumeOption}
                onValueChange={(value) => setResumeOption(value as "existing" | "new")}
                className="space-y-4"
              >
                {userProfile?.resumeUrl && (
                  <div
                    className={`flex items-start space-x-2 rounded-md border p-4 ${resumeOption === "existing" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="existing" id="existing-resume" />
                    <div className="flex-1">
                      <Label htmlFor="existing-resume" className="flex cursor-pointer items-center gap-2 font-medium">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        Use my existing resume
                      </Label>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="block">Filename: {userProfile.resumeName || "My Resume.pdf"}</span>
                        <span className="block">Last updated: {userProfile.resumeUpdated || "2 weeks ago"}</span>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="mt-1 h-auto p-0 text-xs"
                        onClick={() => window.open(userProfile.resumeUrl, "_blank")}
                      >
                        Preview resume
                      </Button>
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-start space-x-2 rounded-md border p-4 ${resumeOption === "new" ? "border-primary bg-primary/5" : ""}`}
                >
                  <RadioGroupItem value="new" id="new-resume" />
                  <div className="flex-1">
                    <Label htmlFor="new-resume" className="cursor-pointer font-medium">
                      Upload a new resume
                    </Label>
                    {resumeOption === "new" && (
                      <div className="mt-2">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required={resumeOption === "new"}
                          className="flex-1"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Upload your resume (PDF, DOC, or DOCX format)
                        </p>
                        {isUploadingResume && (
                          <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading resume...</span>
                          </div>
                        )}
                        {uploadedResumeUrl && !isUploadingResume && (
                          <div className="mt-2 text-sm text-green-600">
                            ✓ Resume uploaded successfully
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're a good fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Explain why you're interested in this position and what makes you a good candidate.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProfile || isUploadingResume}>
              {isUploadingResume ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Resume...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
