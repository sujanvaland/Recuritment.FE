"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Leaf, Package, ShoppingBag, HardHat,  GraduationCap, Coins, Bus, Briefcase, Building, Search, Users, MapPin, Calendar, DollarSign, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"; 
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

 
const iconGreen = "#309689";

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
  posted?: string,
  createdDate?: string,
  expires?: string
  salary: string
  logo: string
  company: string
}


const categories = [
  {
    icon: <Leaf className="h-12 w-12 text-[#e1bd00]" />,
    title: "Agriculture",
    jobs: "1254 jobs",
  },
  {
    icon: <Package className="h-12 w-12 text-[#e1bd00]" />,
    title: "Metal Production",
    jobs: "816 jobs",
  },
  {
    icon: <ShoppingBag className="h-12 w-12 text-[#e1bd00]" />,
    title: "Commerce",
    jobs: "2082 jobs",
  },
  {
    icon: <HardHat className="h-12 w-12 text-[#e1bd00]" />,
    title: "Construction",
    jobs: "1520 jobs",
  },
  {
    icon: <Briefcase className="h-12 w-12 text-[#e1bd00]" />,
    title: "Hotels & Tourism",
    jobs: "1022 jobs",
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-[#e1bd00]" />,
    title: "Education",
    jobs: "1496 jobs",
  },
  {
    icon: <Coins className="h-12 w-12 text-[#e1bd00]" />,
    title: "Financial Services",
    jobs: "1529 jobs",
  },
  {
    icon: <Bus className="h-12 w-12 text-[#e1bd00]" />,
    title: "Transport",
    jobs: "1244 jobs",
  },
];



export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [searchlocation, setSearchLocation] = useState("");
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);




  
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const trimmedTitle = title.trim();
  const trimmedLocation = searchlocation.trim();

  // Validation: Require at least one field to be filled
  if (!trimmedTitle && !trimmedLocation) {
    alert('Please enter a job title or select a location.');
    return;
  }

  const params = new URLSearchParams();

  if (trimmedTitle) params.append('title', trimmedTitle);
  if (trimmedLocation) params.append('location', trimmedLocation);

  router.push(`/jobs?${params.toString()}`);
};



  
    useEffect(() => {
      fetchJobs();
    }, []);

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
          pageSize: null,
          tag: "",
          status: "",
        },
      };

 

      console.log('API call parameters:', searchParams);

      const response = await DataService.get("/jobs", searchParams);

      console.log('jobData', response);
        if (response?.status === 200) {
          const alljobs: Job[] = response.data.jobs;

          console.log("Raw jobs:", alljobs); // Debug log

          const recentJobs = alljobs
            .filter((job) => !!job.createdAt || !!job.createdDate)
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.createdDate!).getTime();
              const dateB = new Date(b.createdAt || b.createdDate!).getTime();
              return dateB - dateA;
            });

            const top5RecentJobs = recentJobs.slice(0, 5);

          setJobs(top5RecentJobs);

          const uniqueLocations = Array.from(
            new Set(alljobs.map(job => job.location?.trim()).filter(Boolean))
          );

          // Map to label/value format
          const formattedLocations = uniqueLocations.map(loc => ({
            label: loc,
            value: loc
          }));

          setLocations(formattedLocations);
       
        }
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };


   const savejobs = async (id:any) => {
    const jobId = id;


      if (!user) {
      // Redirect to login if not authenticated
      toast({
        title: "Login required",
        description: "Please log in to apply for this job",
      })
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/jobs/${jobId}`)}`)
      return
    } else {

       try {
      //  const response = await fetch("/api/jobs", {
      const token = localStorage.getItem("token");

      
      const response = await DataService.post(`/SavedJobs/${jobId?.id}`, jobId, {
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
              description: "Job saved successfully",
            })
            console.log('saved', response);
          } else {
            console.warn("Unexpected status code:", response.status);
            toast({
              title: "Alert!",
              description: response?.data,
            })
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

   

  }

  // Autocomplete filtering
  useEffect(() => {
    if (title.trim().length > 0) {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(title.toLowerCase()) ||
            job.company.toLowerCase().includes(title.toLowerCase()) ||
            job.location.toLowerCase().includes(title.toLowerCase())
        )
      );
    } else {
      setFilteredJobs([]);
    }
  }, [title, jobs]);


  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-black w-full items-center flex justify-center">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <MainNav />
        </div>
      </header>
      
      <main className="flex-1 w-full">
        {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find Your <span className="text-yellow-300">Dream Job</span> Today!
            </h1>
            <p className="text-xl sm:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              Connecting Talent with Opportunity: Your Gateway to Career Success
            </p>
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                      className="w-full pl-12 h-14 border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg rounded-lg"
                    />
                    {showDropdown && filteredJobs.length > 0 && (
                      <div className="absolute left-0 right-0 z-10 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
                        {filteredJobs.slice(0, 8).map((job, idx) => (
                          <div
                            key={job.id || idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => {
                              setTitle(job.title);
                              setShowDropdown(false);
                              inputRef.current?.blur();
                            }}
                          >
                            <div className="font-semibold text-black">{job.title}</div>
                            <div className="text-sm text-gray-500 text-black">{job.company}</div>
                            <div className="text-xs text-emerald-700">{job.location}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      className="w-full pl-12 h-14 border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg rounded-lg appearance-none bg-white"
                      onChange={(e) => setSearchLocation(e.target.value)}
                    >
                      <option value="">Location or remote</option>
                      {locations.map(loc => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
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
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 mb-3">
                  <Briefcase className="h-7 w-7 text-black" />
                </span>
                <div className="text-3xl font-bold text-yellow-300">25,850</div>
                <div className="text-blue-100">Jobs</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 mb-3">
                  <Users className="h-7 w-7 text-black" />
                </span>
                <div className="text-3xl font-bold text-yellow-300">10,250</div>
                <div className="text-blue-100">Candidates</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 mb-3">
                  <Building className="h-7 w-7 text-black" />
                </span>
                <div className="text-3xl font-bold text-yellow-300">18,400</div>
                <div className="text-blue-100">Companies</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 mb-3">
                  <ArrowRight className="h-7 w-7 text-black" />
                </span>
                <div className="text-3xl font-bold text-yellow-300">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Company Logos */}
        <div className="left-0 right-0 bottom-0 w-full flex justify-center bg-white" style={{ paddingTop:40, paddingBottom: 40 }}>
          <div className="flex flex-wrap justify-around w-full gap-10 items-center px-8">
            <img src="/encon.jpeg" alt="Encon" className="h-10" />
            <img src="/gandhi.jpeg" alt="Gandhi" className="h-10" />
            <img src="/gm.jpeg" alt="GM" className="h-10" />
            <img src="/safari.jpeg" alt="Safari" className="h-10" />
            <img src="/tema.jpeg" alt="Tema" className="h-10" />
          </div>
        </div>
      </div> 
 
      {/* Recent Jobs Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Recent Jobs Available</h2>
              <p className="text-gray-500 mt-2">Discover the latest job opportunities</p>
            </div>
            <Link href="/jobs" className="text-blue-600 font-semibold hover:underline">
              View all
            </Link>
          </div>
        </div>

        {/* Job Grid - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const { createdAt, expiresAt } = job;
            const { posted, expires } = createdAt && expiresAt
              ? getJobTimeInfo(createdAt, expiresAt)
              : { posted: "N/A", expires: "N/A" };

            return (
              <Card key={job.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2 bg-white">
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className="p-6 pb-4 min-h-[275px]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={job.logo || "/icon_job.png"} alt={job.company} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {job.company.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">{job.company}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {posted}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => savejobs(job?.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {job.tags && job.tags.length > 0 && (
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
                    )}

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
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

     <section className="w-full bg-gradient-to-br from-[#dae3ff] via-[#f0f4ff] to-[#e6f0ff] py-16 mt-[60px]">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-800">Browse by Category</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id scel...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center py-12 px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
            >
              {cat.icon}
              <div className="mt-6 mb-3 text-xl md:text-2xl font-bold text-center text-gray-800">{cat.title}</div>
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base font-semibold rounded-lg px-4 py-1 text-sm shadow-md">
                {cat.jobs}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="w-full max-w-[1400px] mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Image */}
        <div className="flex-1 w-full">
          <img
            src="/img_demo.png"
            alt="Company"
            className="rounded-2xl w-full object-cover min-h-[350px] max-h-[450px]"
            style={{ aspectRatio: "1/1" }}
          />
        </div>
        {/* Right: Text */}
        <div className="flex-1 w-full">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Good Life Begins With <br />A Good Company
          </h2>
          <p className="text-gray-600 mb-8 text-base md:text-lg">
            Ultricies purus dolor viverra mi laoreet at cursus justo. Ultrices purus diam egestas amet faucibus tempor blandit. Elit velit mauris aliquam est diam. Leo sagittis consectetur diam morbi erat aenean. Vulputate praesent congue faucibus in euismod feugiat euismod volutpat...
          </p>
          <div className="flex gap-6">
            <Link
              href="/jobs"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-7 py-3 rounded-lg transition"
            >
              Search Job
            </Link>
            <Link
              href="/about"
              className="text-blue-600 font-semibold px-2 py-3 hover:underline"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">12k+</div>
          <div className="text-xl font-bold mb-2">Clients worldwide</div>
          <div className="text-gray-600">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">20k+</div>
          <div className="text-xl font-bold mb-2">Active resume</div>
          <div className="text-gray-600">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">18k+</div>
          <div className="text-xl font-bold mb-2">Compnies</div>
          <div className="text-gray-600">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...
          </div>
        </div>
      </div>
    </section>


     <section className="w-full bg-gradient-to-br from-[#dae3ff] via-[#f0f4ff] to-[#e6f0ff] py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-4 text-gray-800">Testimonials from Our Customers</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-white/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-[#e1bd00]" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Amazing services</h3>
            <p className="italic text-gray-700 mb-8">
              Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div className="flex items-center gap-3">
                <img src="/icon_job.png" alt="Marco Kihn" width={48} height={48} className="rounded-full" />
                <div>
                  <div className="font-bold text-gray-800">Marco Kihn</div>
                  <div className="text-gray-500 text-sm">Happy Client</div>
                </div>
              </div>
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 17c0-4.418 3.582-8 8-8V7a5 5 0 00-5-5H7a5 5 0 00-5 5v2c4.418 0 8 3.582 8 8z" />
              </svg>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-white/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-[#e1bd00]" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Everything simple</h3>
            <p className="italic text-gray-700 mb-8">
              Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div className="flex items-center gap-3">
                <img src="/icon_job.png" alt="Kristin Hester" width={48} height={48} className="rounded-full" />
                <div>
                  <div className="font-bold text-gray-800">Kristin Hester</div>
                  <div className="text-gray-500 text-sm">Happy Client</div>
                </div>
              </div>
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 17c0-4.418 3.582-8 8-8V7a5 5 0 00-5-5H7a5 5 0 00-5 5v2c4.418 0 8 3.582 8 8z" />
              </svg>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-white/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-[#e1bd00]" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Awesome, thank you!</h3>
            <p className="italic text-gray-700 mb-8">
              Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus. Nulla et tempor montes
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div className="flex items-center gap-3">
                <img src="/icon_job.png" alt="Zion Cisneros" width={48} height={48} className="rounded-full" />
                <div>
                  <div className="font-bold text-gray-800">Zion Cisneros</div>
                  <div className="text-gray-500 text-sm">Happy Client</div>
                </div>
              </div>
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 17c0-4.418 3.582-8 8-8V7a5 5 0 00-5-5H7a5 5 0 00-5 5v2c4.418 0 8 3.582 8 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>  

      {/* CTA Section */}
      <section className="bg-slate-900 py-16 text-white md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Take the Next Step in Your Career?
              </h2>
              <p className="mx-auto max-w-[600px] text-slate-300 md:text-xl">
                Join thousands of job seekers who have found their dream jobs through our platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/auth/register">
                  Create an Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white hover:from-blue-700 hover:to-purple-700">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  )
}