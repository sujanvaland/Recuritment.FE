"use client"

import { useState, useEffect } from "react"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataService } from "@/services/axiosInstance"

// Days of the week
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Generate dates for the current week
function generateWeekDates(weekStart: Date) {
  return Array(7)
    .fill(null)
    .map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return {
        date,
        day: daysOfWeek[date.getDay()],
        dateNum: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
}

export default function InterviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("day")
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Remove typeFilter from filter states
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  // const [typeFilter, setTypeFilter] = useState("all") // Remove this line
  const [dateRangeFilter, setDateRangeFilter] = useState("all")
  const [interviewerFilter, setInterviewerFilter] = useState("all")

  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
  });
  const weekDates = generateWeekDates(weekStart);

  // Interview data from API
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await DataService.get("/interviews", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setInterviews(response.data);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };
    fetchInterviews();
  }, []);

  // Get unique values for filter dropdowns
  const uniqueStatuses = [...new Set(interviews.map(item => item.interviews.status).filter(Boolean))];
  const uniqueInterviewers = [...new Set(interviews.map(item => item.employerName).filter(Boolean))];

  // Map API interviews to UI format and apply filters
  const mappedInterviews = interviews
    .map((item) => {
      // Extract interview data from the nested structure
      const interview = item.interviews;
      
      // Parse date and time from scheduledTime
      const scheduled = new Date(interview.scheduledTime);
      const date = scheduled.toLocaleDateString();
      const time = scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        ...interview,
        candidate: {
          name: item.candidateName || `Candidate ${interview.candidateId}`,
          avatar: "/placeholder.svg",
          position: "",
        },
        date,
        time,
        interviewer: item.employerName || `Employer ${interview.employerId}`,
        type: interview.type && interview.type.trim() ? interview.type : "Interview",
        location: interview.location || "Virtual Meeting",
        notes: interview.notes || "No notes added",
      };
    })
    .filter((interview) => {
      // Filter by search query (candidate name)
      if (searchQuery.trim() && !interview.candidate.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (statusFilter !== "all" && interview.status !== statusFilter) {
        return false;
      }

      // Remove type filter logic
      // if (typeFilter !== "all" && interview.type !== typeFilter) {
      //   return false;
      // }

      // Filter by interviewer
      if (interviewerFilter !== "all" && interview.interviewer !== interviewerFilter) {
        return false;
      }

      // Filter by date range
      if (dateRangeFilter !== "all") {
        const interviewDate = new Date(interview.scheduledTime);
        const today = new Date();
  const daysDiff = Math.ceil((interviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateRangeFilter) {
          case "today":
            if (interviewDate.toDateString() !== today.toDateString()) return false;
            break;
          case "tomorrow":
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            if (interviewDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case "thisWeek":
            if (daysDiff < 0 || daysDiff > 7) return false;
            break;
          case "nextWeek":
            if (daysDiff < 7 || daysDiff > 14) return false;
            break;
          case "past":
            if (daysDiff >= 0) return false;
            break;
        }
      }

      return true;
    });

  // Add this function to the main InterviewsPage component
  const refreshInterviews = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await DataService.get("/interviews", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setInterviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    // setTypeFilter("all"); // Remove this line
    setDateRangeFilter("all");
    setInterviewerFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
        </div>
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button> */}
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search interviews by candidate name..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {/* Show active filter count - remove typeFilter */}
                {(statusFilter !== "all" || dateRangeFilter !== "all" || interviewerFilter !== "all") && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {[statusFilter, dateRangeFilter, interviewerFilter].filter(f => f !== "all").length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    {/* Remove hardcoded options and only use API data */}
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <select 
                    value={dateRangeFilter} 
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="thisWeek">This Week</option>
                    <option value="nextWeek">Next Week</option>
                    <option value="past">Past Interviews</option>
                  </select>
                </div>

                {/* Remove Interview Type Filter section completely */}

                {/* Interviewer Filter */}
                <div className="space-y-2">
                  <Label>Interviewer</Label>
                  <select 
                    value={interviewerFilter} 
                    onChange={(e) => setInterviewerFilter(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Interviewers</option>
                    {uniqueInterviewers.map(interviewer => (
                      <option key={interviewer} value={interviewer}>{interviewer}</option>
                    ))}
                  </select>
                </div>

                {/* Apply/Clear Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => setFilterOpen(false)}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    resetFilters();
                    setFilterOpen(false);
                  }}>
                    Clear All
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters Display - remove typeFilter */}
      {(statusFilter !== "all" || dateRangeFilter !== "all" || interviewerFilter !== "all") && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
            </Badge>
          )}
          {/* Remove Type filter badge */}
          {dateRangeFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Date: {dateRangeFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRangeFilter("all")} />
            </Badge>
          )}
          {interviewerFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Interviewer: {interviewerFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setInterviewerFilter("all")} />
            </Badge>
          )}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekStart(prev => {
                  const newStart = new Date(prev);
                  newStart.setDate(prev.getDate() - 7);
                  return newStart;
                })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">
                {weekDates[0].date.toLocaleDateString()} - {weekDates[6].date.toLocaleDateString()}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekStart(prev => {
                  const newStart = new Date(prev);
                  newStart.setDate(prev.getDate() + 7);
                  return newStart;
                })}
              >
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
                      variant={selectedDate.toDateString() === date.date.toDateString() ? "default" : "ghost"}
                      className="flex flex-col items-center rounded-full px-4 py-2"
                      onClick={() => setSelectedDate(date.date)}
                    >
                      <div className="text-xs font-medium">{date.day}</div>
                      <div className="text-lg">{date.dateNum}</div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 p-4">
                {/* Filter interviews by selected date */}
                {mappedInterviews
                  .filter((interview) => {
                    const interviewDate = new Date(interview.scheduledTime).toDateString();
                    return interviewDate === selectedDate.toDateString();
                  })
                  .map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} onRefresh={refreshInterviews} />
                  ))}
                {/* Show message if no interviews found */}
                {mappedInterviews.filter((interview) => {
                  const interviewDate = new Date(interview.scheduledTime).toDateString();
                  return interviewDate === selectedDate.toDateString();
                }).length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {searchQuery.trim() ? 
                      `No interviews found for "${searchQuery}" on this date.` : 
                      "No interviews scheduled for this date."
                    }
                  </div>
                )}
              </div>
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
                      {/* Filter interviews for each specific date and search query */}
                      {mappedInterviews
                        .filter((interview) => {
                          const interviewDate = new Date(interview.scheduledTime).toDateString();
                          return interviewDate === date.date.toDateString();
                        })
                        .map((interview) => (
                          <div
                            key={interview.id}
                            className="rounded-md bg-primary/10 p-2 text-xs cursor-pointer hover:bg-primary/20"
                            onClick={() => setSelectedDate(date.date)}
                          >
                            <div className="font-medium">{interview.time}</div>
                            <div>{interview.candidate.name}</div>
                            <div className="text-muted-foreground">{interview.type}</div>
                            {interview.meetingLink && (interview.meetingLink.startsWith('http') || interview.meetingLink.startsWith('https')) && (
                              <div className="mt-1">
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary inline-flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Video className="h-3 w-3" />
                                  Join
                                </a>
                              </div>
                            )}
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
                {Array.from({ length: 35 }).map((_, index) => {
                    const currentDate = new Date();
                    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const cellDate = new Date(monthStart);
                    cellDate.setDate(monthStart.getDate() + index - monthStart.getDay());
                    
                    const dayInterviews = mappedInterviews.filter((interview) => {
                      const interviewDate = new Date(interview.scheduledTime).toDateString();
                      return interviewDate === cellDate.toDateString();
                    });

                    return (
                      <div 
                        key={index} 
                        className={`border-b border-r p-2 cursor-pointer hover:bg-muted ${
                          cellDate.toDateString() === new Date().toDateString() ? "bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedDate(cellDate)}
                      >
                        <div className="text-xs">{cellDate.getDate()}</div>
                        {dayInterviews.map((interview, idx) => (
                          <div key={idx} className="mt-1 rounded-sm bg-primary/20 p-1 text-xs">
                            <div>{interview.time}</div>
                            <div className="font-medium">{interview.candidate.name}</div>
                            {interview.meetingLink && (interview.meetingLink.startsWith('http') || interview.meetingLink.startsWith('https')) && (
                              <div className="mt-1">
                                <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary inline-flex items-center gap-1">
                                  <Video className="h-3 w-3" />
                                  Join
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function InterviewCard({ interview, onRefresh }: { interview: any; onRefresh: () => void }) {
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [selectedInterviewForCancel, setSelectedInterviewForCancel] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  
  // Add reschedule modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedInterviewForReschedule, setSelectedInterviewForReschedule] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [rescheduleNotes, setRescheduleNotes] = useState<string>("");

  const handleCancelInterview = async () => {
    if (!selectedInterviewForCancel || !cancelReason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      // Use DataService instead of fetch
      const response = await DataService.post(
        `/interviews/CancelInterview?id=${selectedInterviewForCancel.id}&reason=${encodeURIComponent(cancelReason)}`,
        {}, // Empty body since parameters are in query string
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data?.message || "Interview cancelled successfully!");
        setCancelModalOpen(false);
        setCancelReason("");
        setSelectedInterviewForCancel(null);
        onRefresh(); // Call the refresh function
      } else {
        alert("Failed to cancel interview.");
      }
    } catch (error) {
      console.error("Error canceling interview:", error);
      alert("Error canceling interview.");
    }
  };

  // Update the handleRescheduleInterview function
  const handleRescheduleInterview = async () => {
    if (!selectedInterviewForReschedule || !rescheduleDate.trim() || !rescheduleTime.trim()) {
      alert("Please provide both date and time for rescheduling.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      // Combine date and time into ISO string
      const scheduledTime = new Date(
        `${rescheduleDate}T${rescheduleTime}:00.000Z`
      ).toISOString();

      const response = await DataService.post(
        `/interviews/UpdateInterview/${selectedInterviewForReschedule.id}`,
        {
          jobId: selectedInterviewForReschedule.jobId,
          candidateId: selectedInterviewForReschedule.candidateId.toString(),
          scheduledTime,
          duration: selectedInterviewForReschedule.duration || 0,
          type: selectedInterviewForReschedule.type || "",
          location: selectedInterviewForReschedule.location || "",
          notes: rescheduleNotes || selectedInterviewForReschedule.notes || "",
          meetingLink: meetingLink || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data?.message || "Interview updated successfully!");
        setRescheduleModalOpen(false);
        setRescheduleDate("");
        setRescheduleTime("");
        setMeetingLink("");
        setRescheduleNotes("");
        setSelectedInterviewForReschedule(null);
        onRefresh(); // Call the refresh function
      } else {
        alert("Failed to reschedule interview.");
      }
    } catch (error) {
      console.error("Error rescheduling interview:", error);
      alert("Error rescheduling interview.");
    }
  };

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
                  .map((n: string) => n[0])
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
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedInterviewForReschedule(interview);
                  setRescheduleModalOpen(true);
                }}
              >
                Reschedule
              </DropdownMenuItem>
              <DropdownMenuItem>Add Notes</DropdownMenuItem>
              {interview.status !== "Cancelled" && (
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => {
                    setSelectedInterviewForCancel(interview);
                    setCancelModalOpen(true);
                  }}
                >
                  Cancel Interview
                </DropdownMenuItem>
              )}
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
              {/* Add status label here */}
              <div className="flex items-center text-sm">
                <div className="mr-2 h-4 w-4" /> {/* Spacer to align with other rows */}
                Status: <Badge variant="secondary" className="ml-2">{interview.status || "Scheduled"}</Badge>
              </div>
              {/* <div className="flex items-center text-sm">
                <Badge variant="outline">{interview.type}</Badge>
              </div> */}
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const meetingUrl = interview.meetingLink || interview.location;
              
              if (meetingUrl && (meetingUrl.startsWith('http') || meetingUrl.startsWith('https'))) {
                window.open(meetingUrl, '_blank', 'noopener,noreferrer');
              } else {
                alert('No valid meeting link available for this interview');
              }
            }}
          >
            <Video className="mr-2 h-3 w-3" />
            Join Meeting
          </Button>
          <div className="flex gap-2">
            {/* Only show Cancel button if status is NOT closed */}
            {interview.status !== "Cancelled" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  setSelectedInterviewForCancel(interview);
                  setCancelModalOpen(true);
                }}
              >
                <X className="mr-2 h-3 w-3" />
                Cancel
              </Button>
            )}
            <Button 
              size="sm"
              onClick={() => {
                setSelectedInterviewForReschedule(interview);
                setRescheduleModalOpen(true);
              }}
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              Reschedule
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Cancel Interview Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this interview? Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason">Cancellation Reason</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please explain why you're canceling this interview..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Keep Interview
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelInterview}
              disabled={!cancelReason.trim()}
            >
              Cancel Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Interview Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              Update the interview details for {selectedInterviewForReschedule?.candidate?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reschedule-date">Date</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reschedule-time">Time</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-link">Meeting Link</Label>
              <Input
                id="meeting-link"
                type="url"
                placeholder="https://meet.google.com/abc-xyz or Zoom link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-notes">Notes (Optional)</Label>
              <Textarea
                id="reschedule-notes"
                placeholder="Any additional notes or changes..."
                value={rescheduleNotes}
                onChange={(e) => setRescheduleNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRescheduleInterview}
              disabled={!rescheduleDate.trim() || !rescheduleTime.trim()}
            >
              Reschedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
