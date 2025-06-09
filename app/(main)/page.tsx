import Link from "next/link"
import { ArrowRight, Briefcase, Building, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col ">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Find Your Dream Job Today</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Connect with top employers and discover opportunities that match your skills and aspirations.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/jobs">
                  Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/employers">For Employers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container -mt-6 px-4 md:px-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            <div className="relative flex-1">
              <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            <Button className="shrink-0">Search Jobs</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="rounded-full bg-slate-100 p-3">
              <Briefcase className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold">Thousands of Jobs</h3>
            <p className="text-gray-500">
              Access thousands of job listings from top companies across various industries.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="rounded-full bg-slate-100 p-3">
              <Search className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold">Advanced Search</h3>
            <p className="text-gray-500">Find the perfect job with our powerful search and filtering tools.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="rounded-full bg-slate-100 p-3">
              <Users className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold">Direct Communication</h3>
            <p className="text-gray-500">
              Connect directly with employers and recruiters through our messaging system.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container px-4 py-16 md:px-6 md:py-24">
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
