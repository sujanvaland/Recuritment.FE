"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
  Download,
  Upload,
  FileText,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getUserProfile, updateUserProfile, uploadResume } from "@/lib/profile"
import { Switch } from "@/components/ui/switch"

// Types for our profile data
interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  location: string
  bio: string
  website: string
  skills: string[]
  resumeUrl: string | null
  resumeName: string | null
  resumeUpdated: string | null
  experience: {
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string | null
    description: string
    current: boolean
  }[]
  education: {
    id: string
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string | null
    description: string
    current: boolean
  }[]
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [editingExperience, setEditingExperience] = useState<string | null>(null)
  const [editingEducation, setEditingEducation] = useState<string | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const { toast } = useToast()

  // Fetch user profile
  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
     
      try {
        const userProfile = await getUserProfile(user == null ? "0" : user.id)
        // Only update state if the component is still mounted
        if (isMounted && userProfile) {
          setProfile(userProfile)
          setEditedProfile(userProfile)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load your profile. Please try again.",
            variant: "destructive",
          })
        }
      } finally {
        // Always set loading to false if the component is still mounted
        if (isMounted) setIsLoading(false)
      }
    }

    fetchProfile()

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
    }
  }, [user, toast])

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    if (!editedProfile || !user) return

    try {
      const updatedProfile = await updateUserProfile(user.id, editedProfile)
      setProfile(updatedProfile)
      setEditMode(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle resume upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setIsUploadingResume(true)

    try {
      // In a real app, you would upload the file to a storage service
      // For now, we'll create a URL for the file
      const fileUrl = URL.createObjectURL(file)

      // Update the profile with the new resume
      const updatedProfile = await uploadResume(user.id, file.name, fileUrl)
      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingResume(false)
    }
  }

  // Handle resume deletion
  const handleDeleteResume = async () => {
    if (!user) return

    try {
      // Update the profile to remove the resume
      const updatedProfile = await updateUserProfile(user.id, {
        resumeUrl: null,
        resumeName: null,
        resumeUpdated: null,
      })

      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)

      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Error",
        description: "Failed to delete your resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle adding new experience
  const handleAddExperience = () => {
    if (!editedProfile) return

    const newExperience = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: null,
      description: "",
      current: true,
    }

    setEditedProfile({
      ...editedProfile,
      experience: [newExperience, ...editedProfile.experience],
    })

    setEditingExperience(newExperience.id)
  }

  // Handle adding new education
  const handleAddEducation = () => {
    if (!editedProfile) return

    const newEducation = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: null,
      description: "",
      current: true,
    }

    setEditedProfile({
      ...editedProfile,
      education: [newEducation, ...editedProfile.education],
    })

    setEditingEducation(newEducation.id)
  }

  // Handle deleting experience
  const handleDeleteExperience = (id: string) => {
    if (!editedProfile) return

    setEditedProfile({
      ...editedProfile,
      experience: editedProfile.experience.filter((exp) => exp.id !== id),
    })
  }

  // Handle deleting education
  const handleDeleteEducation = (id: string) => {
    if (!editedProfile) return

    setEditedProfile({
      ...editedProfile,
      education: editedProfile.education.filter((edu) => edu.id !== id),
    })
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Format date for resume updated
  const formatResumeDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="animate-pulse h-8 w-48 rounded-md bg-slate-200 mb-2"></div>
            <div className="animate-pulse h-4 w-64 rounded-md bg-slate-200"></div>
          </div>
          <div className="animate-pulse h-10 w-32 rounded-md bg-slate-200"></div>
        </div>

        <div className="animate-pulse h-12 w-full rounded-md bg-slate-200 mb-6"></div>

        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 rounded-md bg-slate-200"></div>
            <div className="h-4 w-48 rounded-md bg-slate-200 mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-slate-200"></div>
              <div className="space-y-2">
                <div className="h-6 w-40 rounded-md bg-slate-200"></div>
                <div className="h-4 w-32 rounded-md bg-slate-200"></div>
              </div>
            </div>
            <div className="h-24 rounded-md bg-slate-200"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-6 rounded-md bg-slate-200"></div>
              <div className="h-6 rounded-md bg-slate-200"></div>
              <div className="h-6 rounded-md bg-slate-200"></div>
              <div className="h-6 rounded-md bg-slate-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <User className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Profile not found</h3>
        <p className="mt-2 text-sm text-muted-foreground">There was an error loading your profile</p>
        <Button className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your professional profile and resume</p>
        </div>
        {editMode ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false)
                setEditedProfile(profile)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditMode(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editMode ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedProfile?.firstName || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => (prev ? { ...prev, firstName: e.target.value } : null))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedProfile?.lastName || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => (prev ? { ...prev, lastName: e.target.value } : null))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile?.email || ""}
                      onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedProfile?.phone || ""}
                      onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={editedProfile?.title || ""}
                      onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedProfile?.location || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => (prev ? { ...prev, location: e.target.value } : null))
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editedProfile?.website || ""}
                      onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, website: e.target.value } : null))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Professional Summary</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={editedProfile?.bio || ""}
                      onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, bio: e.target.value } : null))}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-10 w-10 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-muted-foreground">{profile.title}</p>
                    </div>
                  </div>

                  <p className="text-sm">{profile.bio}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Highlight your technical and professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Textarea
                      id="skills"
                      value={editedProfile?.skills.join(", ") || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                skills: e.target.value
                                  .split(",")
                                  .map((skill) => skill.trim())
                                  .filter(Boolean),
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Your professional work history</CardDescription>
              </div>
              {editMode && (
                <Button size="sm" onClick={handleAddExperience}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {editMode ? (
                editedProfile?.experience.map((exp) => (
                  <div key={exp.id} className="rounded-md border p-4">
                    {editingExperience === exp.id ? (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                            <Input
                              id={`title-${exp.id}`}
                              value={exp.title}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    experience: prev.experience.map((item) =>
                                      item.id === exp.id ? { ...item, title: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`company-${exp.id}`}>Company</Label>
                            <Input
                              id={`company-${exp.id}`}
                              value={exp.company}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    experience: prev.experience.map((item) =>
                                      item.id === exp.id ? { ...item, company: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`location-${exp.id}`}>Location</Label>
                            <Input
                              id={`location-${exp.id}`}
                              value={exp.location}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    experience: prev.experience.map((item) =>
                                      item.id === exp.id ? { ...item, location: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`current-${exp.id}`}>Current Position</Label>
                              <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onChange={(e) =>
                                  setEditedProfile((prev) => {
                                    if (!prev) return null
                                    return {
                                      ...prev,
                                      experience: prev.experience.map((item) =>
                                        item.id === exp.id
                                          ? {
                                              ...item,
                                              current: e.target.checked,
                                              endDate: e.target.checked ? null : item.endDate,
                                            }
                                          : item,
                                      ),
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                            <Input
                              id={`startDate-${exp.id}`}
                              type="month"
                              value={exp.startDate}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    experience: prev.experience.map((item) =>
                                      item.id === exp.id ? { ...item, startDate: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                            <Input
                              id={`endDate-${exp.id}`}
                              type="month"
                              value={exp.endDate || ""}
                              disabled={exp.current}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    experience: prev.experience.map((item) =>
                                      item.id === exp.id ? { ...item, endDate: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${exp.id}`}>Description</Label>
                          <Textarea
                            id={`description-${exp.id}`}
                            rows={3}
                            value={exp.description}
                            onChange={(e) =>
                              setEditedProfile((prev) => {
                                if (!prev) return null
                                return {
                                  ...prev,
                                  experience: prev.experience.map((item) =>
                                    item.id === exp.id ? { ...item, description: e.target.value } : item,
                                  ),
                                }
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteExperience(exp.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                          <Button size="sm" onClick={() => setEditingExperience(null)}>
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{exp.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {exp.company} • {exp.location}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setEditingExperience(exp.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-6">
                  {profile.experience.map((exp) => (
                    <div key={exp.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium">{exp.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {exp.company} • {exp.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </div>
                      <p className="mt-2 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Your academic background</CardDescription>
              </div>
              {editMode && (
                <Button size="sm" onClick={handleAddEducation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {editMode ? (
                editedProfile?.education.map((edu) => (
                  <div key={edu.id} className="rounded-md border p-4">
                    {editingEducation === edu.id ? (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                            <Input
                              id={`degree-${edu.id}`}
                              value={edu.degree}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    education: prev.education.map((item) =>
                                      item.id === edu.id ? { ...item, degree: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                            <Input
                              id={`institution-${edu.id}`}
                              value={edu.institution}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    education: prev.education.map((item) =>
                                      item.id === edu.id ? { ...item, institution: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`location-${edu.id}`}>Location</Label>
                            <Input
                              id={`location-${edu.id}`}
                              value={edu.location}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    education: prev.education.map((item) =>
                                      item.id === edu.id ? { ...item, location: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`current-${edu.id}`}>Current Student</Label>
                              <input
                                type="checkbox"
                                id={`current-${edu.id}`}
                                checked={edu.current}
                                onChange={(e) =>
                                  setEditedProfile((prev) => {
                                    if (!prev) return null
                                    return {
                                      ...prev,
                                      education: prev.education.map((item) =>
                                        item.id === edu.id
                                          ? {
                                              ...item,
                                              current: e.target.checked,
                                              endDate: e.target.checked ? null : item.endDate,
                                            }
                                          : item,
                                      ),
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                            <Input
                              id={`startDate-${edu.id}`}
                              type="month"
                              value={edu.startDate}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    education: prev.education.map((item) =>
                                      item.id === edu.id ? { ...item, startDate: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                            <Input
                              id={`endDate-${edu.id}`}
                              type="month"
                              value={edu.endDate || ""}
                              disabled={edu.current}
                              onChange={(e) =>
                                setEditedProfile((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    education: prev.education.map((item) =>
                                      item.id === edu.id ? { ...item, endDate: e.target.value } : item,
                                    ),
                                  }
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${edu.id}`}>Description</Label>
                          <Textarea
                            id={`description-${edu.id}`}
                            rows={3}
                            value={edu.description}
                            onChange={(e) =>
                              setEditedProfile((prev) => {
                                if (!prev) return null
                                return {
                                  ...prev,
                                  education: prev.education.map((item) =>
                                    item.id === edu.id ? { ...item, description: e.target.value } : item,
                                  ),
                                }
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteEducation(edu.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                          <Button size="sm" onClick={() => setEditingEducation(null)}>
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{edu.degree}</h4>
                          <div className="text-sm text-muted-foreground">
                            {edu.institution} • {edu.location}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setEditingEducation(edu.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-6">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <div className="text-sm text-muted-foreground">
                        {edu.institution} • {edu.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </div>
                      <p className="mt-2 text-sm">{edu.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload and manage your resume</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.resumeUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-slate-100 p-2">
                        <FileText className="h-8 w-8 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium">{profile.resumeName || "My Resume.pdf"}</p>
                        <p className="text-sm text-muted-foreground">
                          Updated {formatResumeDate(profile.resumeUpdated)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(profile.resumeUrl, "_blank")}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      {editMode && (
                        <Button variant="destructive" size="sm" onClick={handleDeleteResume}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Upload className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium">No resume uploaded</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Drag and drop or click to upload your resume (PDF, DOCX)
                  </p>
                  <div className="mt-4">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id="resume-upload"
                      className="hidden"
                      onChange={handleResumeUpload}
                      disabled={isUploadingResume}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById("resume-upload")?.click()}
                      disabled={isUploadingResume}
                    >
                      {isUploadingResume ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Choose File"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settingsttings</CardTitle>
              <CardDescription>Manage your profile visibility and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow employers to find your profile in search results
                  </p>
                </div>
                <div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Job Alerts</h4>
                  <p className="text-sm text-muted-foreground">Receive email notifications for new job matches</p>
                </div>
                <div>
                  <Switch id="job-alerts" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Application Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when your application status changes
                  </p>
                </div>
                <div>
                  <Switch id="application-updates" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="mt-2">Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-destructive/20 p-4">
                  <h4 className="font-medium text-destructive">Delete Account</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-4">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
