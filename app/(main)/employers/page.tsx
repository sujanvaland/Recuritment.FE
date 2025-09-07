import Link from "next/link"
import { ArrowRight, BarChart, Building2, CheckCircle, Clock, Filter, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Find the Perfect <span className="text-yellow-300">Candidates</span>
              </h1>
              <p className="mx-auto text-blue-100 max-w-[700px] md:text-xl">
                Post jobs, screen applicants, and build your team with our powerful recruitment platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                <Link href="/pricing">
                  Post a Job <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-gray-900 font-semibold">
                <Link href="/employers/dashboard">Employer Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Sarvah?</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Our platform offers everything you need to streamline your recruitment process
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Users className="h-10 w-10 text-[#e1bd00]" />
              <CardTitle className="mt-4">Access to Top Talent</CardTitle>
              <CardDescription>
                Connect with thousands of qualified candidates across various industries and skill sets.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Filter className="h-10 w-10 text-[#e1bd00]" />
              <CardTitle className="mt-4">Advanced Filtering</CardTitle>
              <CardDescription>
                Use our powerful filtering tools to find candidates that match your specific requirements.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <BarChart className="h-10 w-10 text-[#e1bd00]" />
              <CardTitle className="mt-4">Detailed Analytics</CardTitle>
              <CardDescription>
                Track your job performance with comprehensive analytics and reporting tools.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Building2 className="h-10 w-10 text-[#e1bd00]" />
              <CardTitle className="mt-4">Company Branding</CardTitle>
              <CardDescription>
                Showcase your company culture and values to attract the right candidates.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Clock className="h-10 w-10 text-[#e1bd00]" />
              <CardTitle className="mt-4">Time-Saving Tools</CardTitle>
              <CardDescription>
                Streamline your recruitment process with automated screening and communication tools.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Search className="h-10 w-10 text-[#e1bd00]" />
              <CardTitle className="mt-4">Resume Database</CardTitle>
              <CardDescription>
                Search our extensive database of resumes to find passive candidates for your openings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-gradient-to-br from-[#dae3ff] via-[#f0f4ff] to-[#e6f0ff] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-800">How It Works</h2>
            <p className="mt-4 text-gray-600 md:text-lg">
              Get started in minutes and find your next great hire
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for an employer account and complete your company profile.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">Post a Job</h3>
              <p className="text-gray-600">
                Create a detailed job listing with requirements, benefits, and application instructions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">Manage Applications</h3>
              <p className="text-gray-600">
                Review applications, communicate with candidates, and make hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">What Employers Say</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Hear from companies that have found success with Sarvah
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100"></div>
                <div>
                  <h3 className="font-bold">Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground">HR Director, TechCorp</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Sarvah has transformed our hiring process. We've reduced our time-to-hire by 40% and found
                exceptional candidates for hard-to-fill positions."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100"></div>
                <div>
                  <h3 className="font-bold">Michael Chen</h3>
                  <p className="text-sm text-muted-foreground">CEO, StartupX</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As a startup, finding the right talent is crucial. Sarvah's platform helped us build our core team
                with candidates who align with our mission and values."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100"></div>
                <div>
                  <h3 className="font-bold">Jessica Rodriguez</h3>
                  <p className="text-sm text-muted-foreground">Talent Acquisition, Enterprise Inc.</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The quality of candidates we've found through Sarvah is outstanding. The filtering tools save us
                countless hours in the screening process."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Plans */}
      <section className="w-full bg-gradient-to-br from-[#dae3ff] via-[#f0f4ff] to-[#e6f0ff] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-800">Recruitment Plans</h2>
            <p className="mt-4 text-gray-600 md:text-lg">Choose the plan that fits your hiring needs</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-800">Basic</CardTitle>
                <CardDescription className="text-gray-600">For small businesses and startups</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-800">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">3 job postings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">30 days visibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">Basic candidate filtering</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-blue-600 md:scale-105 bg-white/90 backdrop-blur-sm border-2">
              <CardHeader>
                <div className="mb-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-medium text-white w-fit">
                  Most Popular
                </div>
                <CardTitle className="text-gray-800">Professional</CardTitle>
                <CardDescription className="text-gray-600">For growing companies</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-800">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">10 job postings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">60 days visibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">Advanced candidate filtering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">Featured job listings</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-800">Enterprise</CardTitle>
                <CardDescription className="text-gray-600">For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-800">$249</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">Unlimited job postings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">90 days visibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">Premium candidate filtering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#e1bd00]" />
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Get Started</Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
              View all pricing details
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-12 text-white md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Find Your Next Great Hire?</h2>
              <p className="mx-auto max-w-[600px] text-slate-300 md:text-xl">
                Join thousands of companies that use Sarvah to build their teams.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/pricing">
                  Post a Job <ArrowRight className="ml-2 h-4 w-4" />
                </Link>  
              </Button>
               <Button asChild variant="outline" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white hover:from-blue-700 hover:to-purple-700">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
