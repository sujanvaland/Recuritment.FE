"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Filter,
  X,
  ChevronDown,
  Heart,
  Building2,
  Users,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  SlidersHorizontal,
  Upload,
  FileText,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DataService } from "@/services/axiosInstance"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from 'next/navigation'

type Job = {
  id: number
  title: string
  location: string
  type: string
  tags: string[]
  applicants?: number
  status?: string
  createdAt?: string
  expiresAt?: string
  modifiedDate?: string
  posted?: string
  expires?: string
  salary: string
  minSalary: number
  maxSalary: number
  logo: string
  company: string
  description?: string
  remote?: boolean
}

type FilterState = {
  jobType: string[]
  salaryRange: [number, number]
  location: string[]
  skills: string[]
  remote: boolean
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationTerm, setLocationTerm] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalData, setTotalData] = useState(0)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Apply Modal States
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    jobType: [],
    salaryRange: [0, 300000],
    location: [],
    skills: [],
    remote: false
  })

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pageSize = 12

  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"]
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"]

  // Remove initial fetchJobs()

  const searchParams = useSearchParams()
  
  useEffect(() => {
    const rawTitle = searchParams.get('title');
    const rawLocation = searchParams.get('location');
    let shouldFetch = false;
    let search = "";
    let location = "";
    if (rawTitle !== null) {
      setSearchTerm(decodeURIComponent(rawTitle));
      search = decodeURIComponent(rawTitle);
      shouldFetch = true;
    }
    if (rawLocation !== null) {
      setLocationTerm(decodeURIComponent(rawLocation));
      location = decodeURIComponent(rawLocation);
      shouldFetch = true;
    }
    if (shouldFetch) {
      fetchJobs(1, search, location);
    }else{
      fetchJobs(1);
    }
  }, [searchParams]);

  const fetchJobs = async (page = 1, search = searchTerm, location = locationTerm) => {
    setLoading(true)
    setError(null)
  console.log("Fetching jobs with params:", { page, search, location })
    try {
      const userdetails = JSON.parse(localStorage.getItem("user") || "{}")
      let token = ""
      if (userdetails?.roles !== 'job-seeker') {
        token = localStorage.getItem("token") || ""
      }

      const searchParams: any = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          pageSize: pageSize,
          tag: "",
          status: "",
        },
      }

      if (search) {
        searchParams.params.search = search
      }

      if (location) {
        searchParams.params.location = location
        if (location.toLowerCase().includes('remote')) {
          searchParams.params.remote = true
        }
      }

      const response = await DataService.get("/jobs", searchParams)

      if (response?.status === 200) {
        setJobs(response.data.jobs || [])
        setFilteredJobs(response.data.jobs || [])
        setTotalData(response.data.total)
        setCurrentPage(page)
      }
    } catch (err) {
      console.error('Search error:', err)
      setError("Failed to load jobs")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTimeout) clearTimeout(searchTimeout)
    fetchJobs(1)
  }

  const toggleSaveJob = (jobId: number) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
      toast({ title: "Job removed from saved jobs" })
    } else {
      newSavedJobs.add(jobId)
      toast({ title: "Job saved successfully" })
    }
    setSavedJobs(newSavedJobs)
  }

  const handleApplyClick = (job: Job) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to apply for jobs",
        variant: "destructive",
      })
      router.push('auth/login')
      return
    }
    
    setSelectedJob(job)
    setShowApplyModal(true)
    setCoverLetter("")
    setResumeFile(null)
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        })
        return
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      setResumeFile(file)
    }
  }

  const submitApplication = async () => {
    if (!selectedJob || !user) return

    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a cover letter for your application",
        variant: "destructive",
      })
      return
    }

    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume",
        variant: "destructive",
      })
      return
    }

    setIsApplying(true)

    try {
      const token = localStorage.getItem("token")
      
      // Create FormData properly
      const formData = new FormData()
      formData.append('file', resumeFile) // This should be the actual File object
      formData.append('fileType', 'resume')

      // DO NOT set Content-Type header - let the browser set it automatically for FormData
     const result = await fetch(
        "https://localhost:65437/api/File/UploadFile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT set Content-Type for FormData; browser will set it automatically
          },
          body: formData,
        }
      );
      const uploadResponse  = await result.json();
      console.log('Upload response:', uploadResponse) // Debug log

      if (uploadResponse == null || !uploadResponse[0]?.actualUrl) {
        throw new Error("Failed to upload resume")
      }

      const resumeUrl = uploadResponse[0].actualUrl

      // Submit application
      const applicationData = {
        jobId: selectedJob.id,
        userId: user.id,
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl,
        status: "applied"
      }

      const applicationResponse = await DataService.post("/applications", applicationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (applicationResponse.status === 200) {
        toast({
          title: "Application submitted!",
          description: `Your application for ${selectedJob.title} has been submitted successfully.`,
        })
        setShowApplyModal(false)
        setSelectedJob(null)
        setCoverLetter("")
        setResumeFile(null)
      } else {
        throw new Error("Failed to submit application")
      }
    } catch (error) {
      console.error("Application error:", error)
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - posted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const formatSalary = (min: number, max: number) => {
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`
    }
    if (min) return `$${(min / 1000).toFixed(0)}K+`
    return "Competitive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find Your <span className="text-yellow-300">Dream Job</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of opportunities from top companies around the world
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Job title, keywords, or company"
                      className="pl-12 h-14 border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Location or remote"
                      className="pl-12 h-14 border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg"
                      value={locationTerm}
                      onChange={(e) => setLocationTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search Jobs"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">{totalData}+</div>
                <div className="text-blue-100">Active Jobs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-blue-100">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">50K+</div>
                <div className="text-blue-100">Job Seekers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters and Results Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {showFilters ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              <div className="text-sm text-gray-600">
                <strong>{filteredJobs.length}</strong> jobs found
                {(searchTerm || locationTerm) && (
                  <span className="ml-2">
                    for "{searchTerm}" {locationTerm && `in ${locationTerm}`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {/* handle sort */}}
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Job Type</label>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.jobType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, jobType: [...prev.jobType, type] }))
                            } else {
                              setFilters(prev => ({ ...prev, jobType: prev.jobType.filter(t => t !== type) }))
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Experience</label>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Remote Work */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Work Style</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={filters.remote}
                        onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Remote</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">On-site</span>
                    </label>
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Salary Range</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="10000"
                      className="w-full"
                      value={filters.salaryRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        salaryRange: [prev.salaryRange[0], parseInt(e.target.value)] 
                      }))}
                    />
                    <div className="text-sm text-gray-600">
                      $0 - ${(filters.salaryRange[1] / 1000).toFixed(0)}K+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2 bg-white">
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={job.logo} alt={job.company} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {job.company.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">{job.company}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {job.createdAt ? getTimeAgo(job.createdAt) : 'Recently posted'}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                        {job.remote && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">{formatSalary(job.minSalary, job.maxSalary)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Applicants count */}
                    {job.applicants && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Users className="h-3 w-3" />
                        <span>{job.applicants} applicants</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="group-hover:bg-blue-50 group-hover:border-blue-200"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApplyClick(job)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search criteria or browse all jobs</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setLocationTerm("")
                fetchJobs(1)
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Browse All Jobs
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && Math.ceil(totalData / pageSize) > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => fetchJobs(currentPage - 1)}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, Math.ceil(totalData / pageSize)))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchJobs(pageNum)}
                      className={currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                disabled={currentPage >= Math.ceil(totalData / pageSize)}
                onClick={() => fetchJobs(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Apply Job Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedJob?.company} • {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Cover Letter */}
            <div className="space-y-2">
              <label htmlFor="cover-letter" className="text-sm font-medium text-gray-700">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="cover-letter"
                placeholder="Tell us why you're perfect for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                {coverLetter.length}/500 characters
              </p>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label htmlFor="resume" className="text-sm font-medium text-gray-700">
                Resume <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {resumeFile ? (
                  <div className="space-y-2">
                    <FileText className="mx-auto h-8 w-8 text-blue-500" />
                    <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResumeFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div>
                      <label
                        htmlFor="resume-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Click to upload
                      </label>
                      <span className="text-gray-600"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApplyModal(false)}
              disabled={isApplying}
            >
              Cancel
            </Button>
            <Button
              onClick={submitApplication}
              disabled={isApplying || !coverLetter.trim() || !resumeFile}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
