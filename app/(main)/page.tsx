
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Leaf, Package, ShoppingBag, HardHat,  GraduationCap, Coins, Bus, Briefcase, Building, Search, Users,MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataService } from "@/services/axiosInstance";
import { getJobTimeInfo } from "@/utils/dateComponent"; 
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

 
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
    icon: <Leaf className="h-12 w-12 text-[#309689]" />,
    title: "Agriculture",
    jobs: "1254 jobs",
  },
  {
    icon: <Package className="h-12 w-12 text-[#309689]" />,
    title: "Metal Production",
    jobs: "816 jobs",
  },
  {
    icon: <ShoppingBag className="h-12 w-12 text-[#309689]" />,
    title: "Commerce",
    jobs: "2082 jobs",
  },
  {
    icon: <HardHat className="h-12 w-12 text-[#309689]" />,
    title: "Construction",
    jobs: "1520 jobs",
  },
  {
    icon: <Briefcase className="h-12 w-12 text-[#309689]" />,
    title: "Hotels & Tourism",
    jobs: "1022 jobs",
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-[#309689]" />,
    title: "Education",
    jobs: "1496 jobs",
  },
  {
    icon: <Coins className="h-12 w-12 text-[#309689]" />,
    title: "Financial Services",
    jobs: "1529 jobs",
  },
  {
    icon: <Bus className="h-12 w-12 text-[#309689]" />,
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
    <div className="flex min-h-screen flex-col ">
      {/* Hero Section */}
     <section className="relative flex flex-col items-center justify-center min-h-[70vh] w-full bg-black text-white">
  <div className="container flex flex-col items-center justify-center pt-24 pb-34">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center leading-tight">
            Find Your Dream Job Today!
          </h1>
          <p className="mb-8 text-lg md:text-xl text-center text-gray-200 max-w-2xl">
            Connecting Talent with Opportunity: Your Gateway to Career Success
          </p>
          {/* Search Bar */}
         <form 
          onSubmit={handleSubmit}
         className="flex flex-col md:flex-row gap-4 w-full max-w-3xl mb-12 bg-white rounded-[10px] shadow-lg relative">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Job Title or Company"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="flex-1 px-4 py-3 rounded-[8px] md:rounded-none md:rounded-l-[10px] text-black outline-none"
              style={{ minHeight: 60 }}
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
          <select
            className="flex-1 px-4 py-3 rounded-[8px] md:rounded-none text-black outline-none"
            style={{ minHeight: 60 }}
            onChange={(e) => setSearchLocation(e.target.value)}
          >
              <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
          </select>
          {/* <select
            className="flex-1 px-4 py-3 rounded-[8px] md:rounded-none text-black outline-none"
            style={{ minHeight: 60 }}
          >
            <option>Select Category</option>
          </select> */}
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-[8px] md:rounded-none md:rounded-r-[10px] transition whitespace-nowrap"
            style={{ minWidth: 160, minHeight: 60 }}
          >
            Search Job
          </button>
        </form>
          {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mb-12 mt-12">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500">
                <Briefcase className="h-7 w-7 text-white" />
              </span>
              <div>
                <span className="text-2xl font-bold text-emerald-400 block leading-tight">25,850</span>
                <span className="text-gray-200 text-base">Jobs</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500">
                <Users className="h-7 w-7 text-white" />
              </span>
              <div>
                <span className="text-2xl font-bold text-emerald-400 block leading-tight">10,250</span>
                <span className="text-gray-200 text-base">Candidates</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500">
                <Building className="h-7 w-7 text-white" />
              </span>
              <div>
                <span className="text-2xl font-bold text-emerald-400 block leading-tight">18,400</span>
                <span className="text-gray-200 text-base">Companies</span>
              </div>
            </div>
          </div>       
        </div> 
             <div className="left-0 right-0 bottom-0 w-full flex justify-center bg-black" style={{ paddingTop:40, paddingBottom: 40 }}>
    <div className="flex flex-wrap justify-around w-full gap-10 items-center px-8">
    <img src="/encon.jpeg" alt="Spotify" className="h-10" />
    <img src="/gandhi.jpeg" alt="Slack" className="h-10" />
    <img src="/gm.jpeg" alt="Adobe" className="h-10" />
    <img src="/safari.jpeg" alt="Asana" className="h-10" />
    <img src="/tema.jpeg" alt="Linear" className="h-10" />
  </div>
</div>
      </section> 
 
<section className="w-full" style={{ maxWidth: 1400, margin: "0 auto" }}>
  <div className="flex items-center justify-between mb-2 mt-16 px-4 md:px-0">
    <div>
      <h2 className="text-3xl font-bold">Recent Jobs Available</h2>
      {/* <p className="text-gray-500 mt-2">At eu lobortis pretium tincidunt amet lacus ut senen aliquet...</p> */}
    </div>
    <Link href="/jobs" className="text-emerald-600 font-semibold hover:underline whitespace-nowrap mt-4 md:mt-0">
      View all
    </Link>
  </div>
  <div className="flex flex-col gap-6 mt-6 px-4 md:px-0">
     
    {/* Job Card 2 */}
       {jobs.map((job) => {
                  const { createdAt, expiresAt } = job;
                  const { posted, expires } = createdAt && expiresAt
                    ? getJobTimeInfo(createdAt, expiresAt)
                    : { posted: "N/A", expires: "N/A" };
 
                  return (
    <div  key={job.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-gray-100">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50" >
                  <span className="text-emerald-600 text-xs px-3 py-1 rounded-full font-medium">
                    {posted}
                  </span>
                </span>
                <button className="ml-auto" onClick={() => savejobs(job?.id)}>
                  <svg width="20" height="20" fill="none" stroke="#B0B0B0" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <img src="/icon_job.png" alt="Company Logo" className="h-8 w-8 rounded-full" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job?.title}</h3>
                  <p className="text-gray-500 text-sm">{job?.company}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-gray-500 text-sm items-center"> 
                <div className="flex items-center gap-1"><Users className="h-4 w-4" color={iconGreen} /> {job?.type}</div>
                <div className="flex items-center gap-1"><span>{job?.salary}</span></div>
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" color={iconGreen} /> {job?.location}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 mt-4 md:mt-0"> 
              <Link  href={`/jobs/${job.id}`} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition">Job Details</Link>
            </div>
          </div>
                  )
       })}
 
  </div>
</section>
      {/* Featured Jobs */}
      {/* <section className="container px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Featured Jobs</h2>
          <p className="mt-2 text-gray-500">Explore our handpicked selection of top job opportunities</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((job) => (
            <div
              key={job}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="h-12 w-12 rounded-md bg-gray-100"></div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Full-time
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold">Software Engineer</h3>
              <p className="mb-2 text-sm text-gray-500">TechCorp • San Francisco, CA</p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">React</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">Node.js</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">TypeScript</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">$120K - $150K</span>
                <Button variant="outline" size="sm">
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div> 
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </section>*/}

     <section className="w-full bg-[#eef8f7] py-16 mt-[60px]">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">Browse by Category</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id scel...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white rounded-2xl flex flex-col items-center justify-center py-12 px-4 shadow-sm"
            >
              {cat.icon}
              <div className="mt-6 mb-3 text-xl md:text-2xl font-bold text-center">{cat.title}</div>
              <span className="bg-[#e6f6f4] text-[#309689] text-base font-semibold rounded-lg px-4 py-1 text-sm">
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
              className="bg-[#309689] hover:bg-emerald-700 text-white font-semibold px-7 py-3 rounded-lg transition"
            >
              Search Job
            </Link>
            <Link
              href="/about"
              className="text-[#309689] font-semibold px-2 py-3 hover:underline"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-[#309689] mb-2">12k+</div>
          <div className="text-xl font-bold mb-2">Clients worldwide</div>
          <div className="text-gray-600">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-[#309689] mb-2">20k+</div>
          <div className="text-xl font-bold mb-2">Active resume</div>
          <div className="text-gray-600">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-[#309689] mb-2">18k+</div>
          <div className="text-xl font-bold mb-2">Compnies</div>
          <div className="text-gray-600">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...
          </div>
        </div>
      </div>
    </section>


     <section className="w-full bg-[#eef8f7] py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-4">Testimonials from Our Customers</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col h-full">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-3">Amazing services</h3>
            <p className="italic text-gray-800 mb-8">
              Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div className="flex items-center gap-3">
                <img src="/icon_job.png" alt="Marco Kihn" width={48} height={48} className="rounded-full" />
                <div>
                  <div className="font-bold">Marco Kihn</div>
                  <div className="text-gray-400 text-sm">Happy Client</div>
                </div>
              </div>
              <svg className="h-8 w-8 text-[#309689]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 17c0-4.418 3.582-8 8-8V7a5 5 0 00-5-5H7a5 5 0 00-5 5v2c4.418 0 8 3.582 8 8z" />
              </svg>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col h-full">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-3">Everything simple</h3>
            <p className="italic text-gray-800 mb-8">
              Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div className="flex items-center gap-3">
                <img src="/icon_job.png" alt="Kristin Hester" width={48} height={48} className="rounded-full" />
                <div>
                  <div className="font-bold">Kristin Hester</div>
                  <div className="text-gray-400 text-sm">Happy Client</div>
                </div>
              </div>
              <svg className="h-8 w-8 text-[#309689]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 17c0-4.418 3.582-8 8-8V7a5 5 0 00-5-5H7a5 5 0 00-5 5v2c4.418 0 8 3.582 8 8z" />
              </svg>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col h-full">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-3">Awesome, thank you!</h3>
            <p className="italic text-gray-800 mb-8">
              Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus. Nulla et tempor montes
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div className="flex items-center gap-3">
                <img src="/icon_job.png" alt="Zion Cisneros" width={48} height={48} className="rounded-full" />
                <div>
                  <div className="font-bold">Zion Cisneros</div>
                  <div className="text-gray-400 text-sm">Happy Client</div>
                </div>
              </div>
              <svg className="h-8 w-8 text-[#309689]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 17c0-4.418 3.582-8 8-8V7a5 5 0 00-5-5H7a5 5 0 00-5 5v2c4.418 0 8 3.582 8 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-16 text-white md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
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
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-slate-800">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}
