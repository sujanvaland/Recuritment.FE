"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { JobFilters, type FilterState } from "@/components/job-filters"
import { JobCard } from "@/components/job-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

type Job = {
  id: number
  title: string
  location: string
  type: string
  tags: string[]
  applicants?: number
  status?: string
  createdAt?: string
  expiresAt?: string,
  modifiedDate?: string,
  posted?: string
  expires?: string
  salary: string
  logo: string
  company: string
}


// Mock job data
const allJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120K - $150K",
    salaryRange: [120000, 150000],
    skills: ["React", "TypeScript", "Next.js"],
    posted: "2 days ago",
    logo: "/abstract-tc.png",
    experienceLevel: "senior-level",
    workLocation: "on-site",
    education: "bachelor",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130K - $160K",
    salaryRange: [130000, 160000],
    skills: ["Node.js", "Python", "AWS"],
    posted: "1 day ago",
    logo: "/abstract-data-stream.png",
    experienceLevel: "mid-level",
    workLocation: "hybrid",
    education: "bachelor",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "CreativeMinds",
    location: "Remote",
    type: "Contract",
    salary: "$80K - $100K",
    salaryRange: [80000, 100000],
    skills: ["Figma", "Adobe XD", "Sketch"],
    posted: "3 days ago",
    logo: "/abstract-geometric-cm.png",
    experienceLevel: "mid-level",
    workLocation: "remote",
    education: "bachelor",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110K - $140K",
    salaryRange: [110000, 140000],
    skills: ["Docker", "Kubernetes", "CI/CD"],
    posted: "5 days ago",
    logo: "/computed-tomography-scan.png",
    experienceLevel: "senior-level",
    workLocation: "hybrid",
    education: "master",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCo",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130K - $170K",
    salaryRange: [130000, 170000],
    skills: ["Agile", "Product Strategy", "User Research"],
    posted: "1 week ago",
    logo: "/circuit-cityscape.png",
    experienceLevel: "director",
    workLocation: "on-site",
    education: "master",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$140K - $180K",
    salaryRange: [140000, 180000],
    skills: ["Python", "Machine Learning", "SQL"],
    posted: "3 days ago",
    logo: "/abstract-purple-swirl.png",
    experienceLevel: "senior-level",
    workLocation: "hybrid",
    education: "doctorate",
  },
  {
    id: 7,
    title: "Junior Web Developer",
    company: "WebStarters",
    location: "Remote",
    type: "Part-time",
    salary: "$50K - $70K",
    salaryRange: [50000, 70000],
    skills: ["HTML", "CSS", "JavaScript"],
    posted: "2 days ago",
    logo: "/abstract-geometric-ws.png",
    experienceLevel: "entry-level",
    workLocation: "remote",
    education: "associate",
  },
  {
    id: 8,
    title: "Computer Science Instructor",
    company: "Tech Academy",
    location: "Chicago, IL",
    type: "Contract",
    salary: "$90K - $110K",
    salaryRange: [90000, 110000],
    skills: ["Teaching", "Computer Science", "Curriculum Development"],
    posted: "1 week ago",
    logo: "/computer-science-abstract.png",
    experienceLevel: "mid-level",
    workLocation: "on-site",
    education: "master",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationTerm, setLocationTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    jobType: [],
    salaryRange: [0, 300000],
    location: [],
    skills: [],
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState(jobs)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter();
  const pageSize = 5;
  const totalPages = Math.ceil(totalData / pageSize);





  useEffect(() => {
    fetchJobs();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchJobs(1); // Reset to first page when searching
    }, 500); // 500ms delay

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm, locationTerm]);

  const fetchJobs = async (page = 1) => {
    setLoading(true);

    const userdetails = JSON.parse(localStorage.getItem("user") || "{}");
    console.log('userdetails', userdetails);
    let token = "";
    if (userdetails?.roles !== 'job-seeker') {
      token = localStorage.getItem("token") || "";
    } else {
      token = "";
    }
    try {

      // Prepare search parameters
      const searchParams: any = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          pageSize: pageSize,
          tag: "",
          status: "",
        },
      };

      // Add search parameters if they exist
      if (searchTerm) {
        searchParams.params.search = searchTerm;
        console.log('Searching for:', searchTerm);
      }

      if (locationTerm) {
        searchParams.params.location = locationTerm;
        console.log('Location search:', locationTerm);
        
        // Check if location includes "remote"
        if (locationTerm.toLowerCase().includes('remote')) {
          searchParams.params.remote = true;
          console.log('Remote work detected');
        }
      }

      console.log('API call parameters:', searchParams);

      const response = await DataService.get("/jobs", searchParams);

      console.log('jobData', response);

      if (response?.status === 200) {
        setJobs(response.data.jobs || []);
        setFilteredJobs(response.data.jobs || []);
        // setAllJobs(response.data.jobs || []);
        setTotalData(response.data.total);
        setCurrentPage(page);
        console.log('Jobs found:', response.data.jobs?.length || 0);
        console.log('Total jobs:', response.data.total);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };




  console.log('filteredJobs', filteredJobs);

  useEffect(() => {
    const jobTypeSet = new Set<string>();
    const locationSet = new Set<string>();
    const skillSet = new Set<string>();

    if (jobs?.length > 0) {
      jobs.forEach((job) => {
        if (job.type) jobTypeSet.add(job.type);
        if (job.location) locationSet.add(job.location);
        (job.tags || []).forEach((tag) => skillSet.add(tag));
      });

      const jobTypes = Array.from(jobTypeSet);
      const locations = Array.from(locationSet);
      const skills = Array.from(skillSet);

      console.log('jobTypes', jobTypes);
      console.log('locations', locations);
      console.log('skills', skills);

      // Set as default filters (select all initially)
      setFilters({
        jobType: jobTypes,
        location: locations,
        skills: skills,
        salaryRange: [0, 300000],
      });
    }


  }, [jobs]);



  // Apply filters and search
  //useEffect(() => {
  // let result = [...jobs]

  //   // Apply search term
  //   if (searchTerm) {
  //     const searchLower = searchTerm.toLowerCase()
  //     result = result.filter(
  //       (job) =>
  //         job.title.toLowerCase().includes(searchLower) ||
  //         job.company.toLowerCase().includes(searchLower) ||
  //         job.skills.some((skill) => skill.toLowerCase().includes(searchLower)),
  //     )
  //   }

  //   // Apply location search
  //   if (locationTerm) {
  //     const locationLower = locationTerm.toLowerCase()
  //     result = result.filter((job) => job.location.toLowerCase().includes(locationLower))
  //   }

  //   // Apply job type filter
  //   if (filters.jobType.length > 0) {
  //     result = result.filter((job) => {
  //       const jobTypeLower = job.type.toLowerCase()
  //       return filters.jobType.some((type) => jobTypeLower.includes(type.toLowerCase()))
  //     })
  //   }

  //   // Apply experience level filter
  //   if (filters.experienceLevel.length > 0) {
  //     result = result.filter((job) => filters.experienceLevel.includes(job.experienceLevel))
  //   }

  //   // Apply salary range filter
  //   result = result.filter((job) => {
  //     // Use the lower end of the job's salary range for comparison
  //     return job.salaryRange[0] >= filters.salaryRange[0] && job.salaryRange[1] <= filters.salaryRange[1]
  //   })

  //   // Apply location type filter
  //   if (filters.location.length > 0) {
  //     result = result.filter((job) => filters.location.includes(job.workLocation))
  //   }

  //   // Apply skills filter
  //   if (filters.skills.length > 0) {
  //     result = result.filter((job) => {
  //       const jobSkills = job.skills.map((skill) => skill.toLowerCase())
  //       return filters.skills.some((skill) => jobSkills.includes(skill.toLowerCase()))
  //     })
  //   }

  //   // Apply education filter
  //   if (filters.education.length > 0) {
  //     result = result.filter((job) => filters.education.includes(job.education))
  //   }

  //   // Apply sorting
  //   switch (sortBy) {
  //     case "newest":
  //       // For demo purposes, we'll sort by the "posted" field
  //       result.sort((a, b) => {
  //         if (a.posted.includes("day") && b.posted.includes("day")) {
  //           return Number.parseInt(a.posted) - Number.parseInt(b.posted)
  //         }
  //         if (a.posted.includes("day")) return -1
  //         if (b.posted.includes("day")) return 1
  //         return 0
  //       })
  //       break
  //     case "salary":
  //       result.sort((a, b) => b.salaryRange[1] - a.salaryRange[1])
  //       break
  //     // "relevance" is default, no need to sort
  //   }

  //   setFilteredJobs(result)
  // }, [searchTerm, locationTerm, filters, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger immediate search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    fetchJobs(1);
  }

  const handleClearSearch = () => {
    setSearchTerm("");
    setLocationTerm("");
    fetchJobs(1);
  };


  console.log('filters', filters);
  return (
    <div className="w-full">
    <div className="bg-black w-full">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center py-16 md:py-24">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-0">Jobs</h1>
      </div>
    </div>
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:px-6 md:py-12 containerwidth">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Jobs</h1>
        <p className="mt-2 text-muted-foreground">Browse through thousands of full-time and part-time jobs near you</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Job title, keywords, or company"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Location or remote"
            className="pl-10"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
          />
        </div>
        <Button type="submit" className="shrink-0" disabled={loading}>
          {loading ? "Searching..." : "Search Jobs"}
        </Button>
        {(searchTerm || locationTerm) && (
          <Button 
            type="button" 
            variant="outline" 
            className="shrink-0"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        )}
      </form>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters - Mobile Toggle */}
        <div className="lg:hidden">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Show Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-6">
                <JobFilters onFilterChange={setFilters} initialFilters={filters} />

              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Filters - Desktop */}
        <div className="hidden w-[280px] shrink-0 lg:block">
          <JobFilters onFilterChange={setFilters} initialFilters={filters} />
        </div>

        {/* Job Listings */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredJobs.length}</strong> jobs
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select
                className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          <Separator className="mb-6" />

          {filteredJobs.length > 0 ? (
            <div className="grid gap-6">
              {filteredJobs.map((job) => {
                return (
                  <JobCard
                    key={job.id}
                    job={{
                      ...job,
                      posted: job.posted ?? "N/A", // Fallback if missing
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              <Button
                className="mt-4"
                onClick={handleClearSearch}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline" 
                className="mx-1"
                disabled={currentPage === 1}
                onClick={() => fetchJobs(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="mx-2 flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                className="mx-1"
                disabled={currentPage >= totalPages}
                onClick={() => fetchJobs(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
