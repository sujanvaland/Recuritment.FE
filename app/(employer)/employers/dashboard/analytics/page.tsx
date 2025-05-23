"use client"

import { useState } from "react"
import { ArrowRight, ArrowUp, Calendar, Download, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart"

// Sample data for charts
const applicationData = [
  { name: "Jan", applications: 65 },
  { name: "Feb", applications: 80 },
  { name: "Mar", applications: 95 },
  { name: "Apr", applications: 120 },
  { name: "May", applications: 150 },
]

const hiringFunnelData = [
  { name: "Applications", value: 450 },
  { name: "Screened", value: 320 },
  { name: "Interviewed", value: 180 },
  { name: "Offers", value: 45 },
  { name: "Hired", value: 30 },
]

const jobPerformanceData = [
  { name: "Frontend Developer", applications: 120, interviews: 35, offers: 8 },
  { name: "UX Designer", applications: 85, interviews: 25, offers: 6 },
  { name: "Backend Developer", applications: 95, interviews: 30, offers: 7 },
  { name: "Product Manager", applications: 65, interviews: 20, offers: 4 },
  { name: "Marketing Specialist", applications: 55, interviews: 15, offers: 3 },
]

const sourceData = [
  { name: "Job Board", value: 45 },
  { name: "Company Website", value: 25 },
  { name: "Referrals", value: 15 },
  { name: "Social Media", value: 10 },
  { name: "Other", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your recruitment metrics and performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">450</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interviews Conducted</CardDescription>
            <CardTitle className="text-3xl">180</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              8% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Offers Extended</CardDescription>
            <CardTitle className="text-3xl">45</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Time to Hire (Avg.)</CardDescription>
            <CardTitle className="text-3xl">24 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-red-500">
              <ArrowUp className="mr-1 h-4 w-4" />2 days from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Monthly application volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={applicationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="applications" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
                <CardDescription>Conversion rates through hiring stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hiringFunnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
                <CardDescription>Applications, interviews, and offers by job</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="applications" fill="#8884d8" />
                      <Bar dataKey="interviews" fill="#82ca9d" />
                      <Bar dataKey="offers" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Sources</CardTitle>
                <CardDescription>Where candidates are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
              <CardDescription>Detailed application metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={applicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Performance Comparison</CardTitle>
              <CardDescription>Detailed metrics by job posting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="#8884d8" />
                    <Bar dataKey="interviews" fill="#82ca9d" />
                    <Bar dataKey="offers" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Sources</CardTitle>
              <CardDescription>Detailed breakdown of candidate sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest recruitment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New application received</p>
                  <p className="text-sm text-muted-foreground">Emily Johnson applied for Senior Frontend Developer</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Interview scheduled</p>
                  <p className="text-sm text-muted-foreground">Technical interview with Michael Chen for UX Designer</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Offer accepted</p>
                  <p className="text-sm text-muted-foreground">Robert Kim accepted the Backend Developer position</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New application received</p>
                  <p className="text-sm text-muted-foreground">Sarah Williams applied for DevOps Engineer</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruitment Insights</CardTitle>
            <CardDescription>Key metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Application to Interview Rate</div>
                  <div className="text-sm font-medium">40%</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[40%] rounded-full bg-primary"></div>
                </div>
                <div className="mt-1 text-xs text-green-500">
                  <ArrowUp className="mr-1 inline-block h-3 w-3" />
                  5% increase from last month
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Interview to Offer Rate</div>
                  <div className="text-sm font-medium">25%</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[25%] rounded-full bg-primary"></div>
                </div>
                <div className="mt-1 text-xs text-green-500">
                  <ArrowUp className="mr-1 inline-block h-3 w-3" />
                  3% increase from last month
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Offer Acceptance Rate</div>
                  <div className="text-sm font-medium">85%</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                </div>
                <div className="mt-1 text-xs text-green-500">
                  <ArrowUp className="mr-1 inline-block h-3 w-3" />
                  10% increase from last month
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Average Time to Fill</div>
                  <div className="text-sm font-medium">24 days</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[60%] rounded-full bg-primary"></div>
                </div>
                <div className="mt-1 text-xs text-red-500">
                  <ArrowUp className="mr-1 inline-block h-3 w-3" />2 days increase from last month
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View Detailed Insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
