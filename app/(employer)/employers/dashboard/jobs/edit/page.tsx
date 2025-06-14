"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/services/axiosInstance";
import { useSearchParams } from 'next/navigation';

interface JobFormData {
  id: number | null,
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string
  benefits: string[]
  employerId: string,
  tags: string[]
  remote: boolean
  status: string
}

export default function EditJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newBenefit, setNewBenefit] = useState("")
  const [newTag, setNewTag] = useState("")
  const searchParams = useSearchParams();
  const jobid = searchParams.get('id');
  const [jobDataFromAPI, setJobDataFromAPI] = useState<Partial<JobFormData> | null>(null);

  console.log('putjobid', jobid);

  const [formData, setFormData] = useState<JobFormData>({
    id: jobid ? Number(jobid) : null,
    title: "",
    company: user?.company || "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    employerId: "",
    benefits: [],
    tags: [],
    remote: false,
    status: "active",
  })



  const [errors, setErrors] = useState<Partial<JobFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<JobFormData> = {}

    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.company.trim()) newErrors.company = "Company name is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.type) newErrors.type = "Job type is required"
    if (!formData.description.trim()) newErrors.description = "Job description is required"
    if (!formData.requirements.trim()) newErrors.requirements = "Job requirements are required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefit),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

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
        setJobDataFromAPI(response.data);

        // Update form data with fetched job info here:
        setFormData((prev) => ({
          ...prev,
          ...response.data.job, // or adjust according to your API response shape
        }));
      } catch (err) {
        console.error("Failed to fetch job:", err);
      }
    };
    fetchJobs();
  }, [jobid]);

  useEffect(() => {
    if (jobDataFromAPI) {
      console.log('jobDataFromAPI', jobDataFromAPI);
      setFormData({
        id: jobDataFromAPI.id ?? null,
        title: jobDataFromAPI.title ?? "",
        company: jobDataFromAPI.company ?? "",
        location: jobDataFromAPI.location ?? "",
        type: jobDataFromAPI.type ?? "",
        salary: jobDataFromAPI.salary ?? "",
        description: jobDataFromAPI.description ?? "",
        requirements: jobDataFromAPI.requirements ?? "",
        benefits: jobDataFromAPI.benefits ?? [],
        employerId: user?.id.toString() ?? "",
        tags: jobDataFromAPI.tags ?? [],
        remote: jobDataFromAPI.remote ?? false,
        status: jobDataFromAPI.status ?? "active",
      });
    }
  }, [jobDataFromAPI]);


  console.log('formData', formData);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    isDraft: boolean
  ) => {
    e.preventDefault();
    console.log('Submitting form...');
    if (!isDraft && !validateForm()) {
      console.log('Validation failed');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }


    setIsSubmitting(true);


    console.log('formdata', formData);
    const jobData = {
      ...formData,
      status: isDraft ? "draft" : "active",
    }

    try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token")
      console.log('jobData1234', jobData);
      const response = await DataService.post(`/jobs/UpdateJob`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log('response', response);
          if (response.status === 200) {
            toast({
              title: "Success!",
              description: isDraft ? "Job saved as draft" : "Job posted successfully",
            });
            router.push("/employers/dashboard/jobs")
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/employers/dashboard/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
          <p className="text-muted-foreground">Create a new job posting to attract top talent</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about the job position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className={errors.company ? "border-destructive" : ""}
                    />
                    {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className={errors.location ? "border-destructive" : ""}
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $80,000 - $120,000 or €60,000 - €90,000"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={formData.remote}
                    onCheckedChange={(checked) => handleInputChange("remote", checked)}
                  />
                  <Label htmlFor="remote">Remote work available</Label>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Detailed description and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List the required skills, experience, and qualifications..."
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    className={`min-h-[120px] ${errors.requirements ? "border-destructive" : ""}`}
                  />
                  {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Benefits and Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Skills</CardTitle>
                <CardDescription>Add benefits and relevant skills/tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Benefits</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a benefit (e.g. Health insurance)"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                    />
                    <Button type="button" onClick={addBenefit} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="gap-1">
                          {benefit}
                          <button
                            type="button"
                            onClick={() => removeBenefit(benefit)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Skills & Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill or tag (e.g. React, Node.js)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="gap-1">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Job"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" asChild>
                    <Link href="/employers/dashboard/jobs">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground">Write a clear title</h4>
                  <p>Use specific job titles that candidates search for</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Be detailed</h4>
                  <p>Include specific requirements and responsibilities</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Add benefits</h4>
                  <p>Highlight what makes your company attractive</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Use relevant tags</h4>
                  <p>Help candidates find your job through search</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
