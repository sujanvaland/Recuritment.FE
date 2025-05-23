"use client"

import { useState } from "react"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  User,
  Video,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample interview data
const interviews = [
  {
    id: 1,
    candidate: {
      name: "Emily Johnson",
      avatar: "/abstract-geometric-shapes.png",
      position: "Senior Frontend Developer",
    },
    date: "2023-05-15",
    time: "10:00 AM - 11:00 AM",
    type: "Technical Interview",
    interviewer: "John Smith",
    status: "scheduled",
    location: "Video Call",
    notes: "Focus on React, TypeScript, and system design questions",
  },
  {
    id: 2,
    candidate: {
      name: "Michael Chen",
      avatar: "/number-two-graphic.png",
      position: "UX/UI Designer",
    },
    date: "2023-05-18",
    time: "2:00 PM - 3:00 PM",
    type: "Portfolio Review",
    interviewer: "Sarah Johnson",
    status: "scheduled",
    location: "In-person",
    notes: "Review portfolio and discuss design process",
  },
  {
    id: 3,
    candidate: {
      name: "Sarah Williams",
      avatar: "/abstract-geometric-shapes.png",
      position: "DevOps Engineer",
    },
    date: "2023-05-20",
    time: "11:00 AM - 12:00 PM",
    type: "Technical Interview",
    interviewer: "David Lee",
    status: "scheduled",
    location: "Video Call",
    notes: "Focus on AWS, Docker, and CI/CD pipelines",
  },
  {
    id: 4,
    candidate: {
      name: "David Rodriguez",
      avatar: "/abstract-geometric-shapes.png",
      position: "Product Manager",
    },
    date: "2023-05-22",
    time: "3:00 PM - 4:00 PM",
    type: "Case Study",
    interviewer: "Jennifer Wilson",
    status: "scheduled",
    location: "Video Call",
    notes: "Present a product case study and discuss approach",
  },
  {
    id: 5,
    candidate: {
      name: "Jessica Lee",
      avatar: "/abstract-geometric-composition-5.png",
      position: "Marketing Specialist",
    },
    date: "2023-05-25",
    time: "1:00 PM - 2:00 PM",
    type: "Initial Screening",
    interviewer: "Robert Johnson",
    status: "scheduled",
    location: "Phone Call",
    notes: "Discuss experience with digital marketing and content strategy",
  },
]

// Days of the week
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Generate dates for the current week
const generateWeekDates = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day

  return Array(7)
    .fill()
    .map((_, index) => {
      const date = new Date(today)
      date.setDate(diff + index)
      return {
        date,
        day: daysOfWeek[date.getDay()],
        dateNum: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
      }
    })
}

export default function InterviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("day")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const weekDates = generateWeekDates()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search interviews..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">May 15 - May 21, 2023</div>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Tabs defaultValue="day" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4 ml-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>

            <TabsContent value="day" className="m-0">
              <div className="flex border-b">
                <div className="flex w-full justify-between px-4 py-2">
                  {weekDates.map((date, index) => (
                    <Button
                      key={index}
                      variant={date.isToday ? "default" : "ghost"}
                      className="flex flex-col items-center rounded-full px-4 py-2"
                      onClick={() => setSelectedDate(date.date)}
                    >
                      <div className="text-xs font-medium">{date.day}</div>
                      <div className="text-lg">{date.dateNum}</div>
                    </Button>
                  ))}
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-4 p-4">
                  {interviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="week" className="m-0">
              <div className="grid grid-cols-7 border-b">
                {weekDates.map((date, index) => (
                  <div key={index} className={`border-r p-2 text-center ${date.isToday ? "bg-primary/10" : ""}`}>
                    <div className="text-xs font-medium">{date.day}</div>
                    <div className="text-lg">{date.dateNum}</div>
                  </div>
                ))}
              </div>
              <div className="grid h-[calc(100vh-24rem)] grid-cols-7 overflow-auto">
                {weekDates.map((date, index) => (
                  <div key={index} className="border-r">
                    <div className="space-y-1 p-2">
                      {interviews
                        .filter((interview) => interview.date === "2023-05-15")
                        .map((interview) => (
                          <div
                            key={interview.id}
                            className="rounded-md bg-primary/10 p-2 text-xs"
                            style={{ marginTop: "40px" }}
                          >
                            <div className="font-medium">{interview.time}</div>
                            <div>{interview.candidate.name}</div>
                            <div className="text-muted-foreground">{interview.type}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="month" className="m-0">
              <div className="grid grid-cols-7 border-b p-2 text-center text-xs font-medium">
                {daysOfWeek.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid h-[calc(100vh-24rem)] grid-cols-7 overflow-auto">
                {Array(35)
                  .fill()
                  .map((_, index) => (
                    <div key={index} className={`border-b border-r p-2 ${index === 15 ? "bg-primary/10" : ""}`}>
                      <div className="text-xs">{(index % 31) + 1}</div>
                      {index === 15 && (
                        <div className="mt-1 rounded-sm bg-primary/20 p-1 text-xs">
                          <div>10:00 AM</div>
                          <div className="font-medium">Emily J.</div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function InterviewCard({ interview }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={interview.candidate.avatar || "/placeholder.svg"} alt={interview.candidate.name} />
              <AvatarFallback>
                {interview.candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{interview.candidate.name}</CardTitle>
              <CardDescription>{interview.candidate.position}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Reschedule</DropdownMenuItem>
              <DropdownMenuItem>Add Notes</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancel Interview</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Interview Details</div>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {interview.date}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {interview.time}
              </div>
              <div className="flex items-center text-sm">
                <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                {interview.location}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Additional Information</div>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                Interviewer: {interview.interviewer}
              </div>
              <div className="flex items-center text-sm">
                <Badge variant="outline">{interview.type}</Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="text-sm font-medium">Notes</div>
          <div className="rounded-md bg-muted p-3 text-sm">{interview.notes}</div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full flex-wrap justify-between gap-2">
          <Button variant="outline" size="sm">
            <Video className="mr-2 h-3 w-3" />
            Join Meeting
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
              <X className="mr-2 h-3 w-3" />
              Cancel
            </Button>
            <Button size="sm">
              <CalendarIcon className="mr-2 h-3 w-3" />
              Reschedule
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
