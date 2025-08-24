import Link from "next/link"
import { ArrowRight, BarChart, Building2, CheckCircle, Clock, Filter, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-black py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-white text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Find the Perfect Candidates
              </h1>
              <p className="mx-auto text-white max-w-[700px] text-gray-500 md:text-xl">
                Post jobs, screen applicants, and build your team with our powerful recruitment platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-[#309689] text-white border-[#309689]  hover:bg-[#267a6d]">
                <Link href="/pricing">
                  Post a Job <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/employers/dashboard">Employer Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Sarvha?</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Our platform offers everything you need to streamline your recruitment process
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Users className="h-10 w-10 text-[#309689]" />
              <CardTitle className="mt-4">Access to Top Talent</CardTitle>
              <CardDescription>
                Connect with thousands of qualified candidates across various industries and skill sets.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Filter className="h-10 w-10   text-[#309689]" />
              <CardTitle className="mt-4">Advanced Filtering</CardTitle>
              <CardDescription>
                Use our powerful filtering tools to find candidates that match your specific requirements.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <BarChart className="h-10 w-10  text-[#309689]" />
              <CardTitle className="mt-4">Detailed Analytics</CardTitle>
              <CardDescription>
                Track your job performance with comprehensive analytics and reporting tools.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Building2 className="h-10 w-10   text-[#309689]" />
              <CardTitle className="mt-4">Company Branding</CardTitle>
              <CardDescription>
                Showcase your company culture and values to attract the right candidates.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Clock className="h-10 w-10   text-[#309689]" />
              <CardTitle className="mt-4">Time-Saving Tools</CardTitle>
              <CardDescription>
                Streamline your recruitment process with automated screening and communication tools.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Search className="h-10 w-10   text-[#309689]" />
              <CardTitle className="mt-4">Resume Database</CardTitle>
              <CardDescription>
                Search our extensive database of resumes to find passive candidates for your openings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#eef8f7] py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Get started in minutes and find your next great hire
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up for an employer account and complete your company profile.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">Post a Job</h3>
              <p className="text-muted-foreground">
                Create a detailed job listing with requirements, benefits, and application instructions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">Manage Applications</h3>
              <p className="text-muted-foreground">
                Review applications, communicate with candidates, and make hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">What Employers Say</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Hear from companies that have found success with Sarvha
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
                "Sarvha has transformed our hiring process. We've reduced our time-to-hire by 40% and found
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
                "As a startup, finding the right talent is crucial. Sarvha's platform helped us build our core team
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
                "The quality of candidates we've found through Sarvha is outstanding. The filtering tools save us
                countless hours in the screening process."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-[#eef8f7] py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Recruitment Plans</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">Choose the plan that fits your hiring needs</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For small businesses and startups</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>3 job postings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>30 days visibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic candidate filtering</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-primary md:scale-105">
              <CardHeader>
                <div className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                  Most Popular
                </div>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For growing companies</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>10 job postings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>60 days visibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced candidate filtering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Featured job listings</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full">Get Started</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$249</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited job postings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>90 days visibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Premium candidate filtering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full">Get Started</Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-primary hover:underline">
              View all pricing details
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-16 text-white md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Find Your Next Great Hire?</h2>
              <p className="mx-auto max-w-[600px] text-slate-300 md:text-xl">
                Join thousands of companies that use Sarvha to build their teams.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/pricing">
                  Post a Job <ArrowRight className="ml-2 h-4 w-4" />
                </Link>  
              </Button>
               <Button asChild variant="outline" size="lg" className="bg-[#309689] border-[#309689] text-white hover:bg-[#267a6d]">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
