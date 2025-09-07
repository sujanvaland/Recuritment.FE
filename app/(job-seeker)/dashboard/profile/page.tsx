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
import { DataService, base_url } from "@/services/axiosInstance";
import fileService from "@/services/fileService"

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
  userid: number;
  id: number | string
  experience: {
    id: number
    title: string
    company: string
    location: string
    startDate: string
    endDate: string | null
    description: string
    current: boolean
  }[]
  education: {
    id: number
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string | null
    description: string
    current: boolean
  }[]
}


interface EditableUserProfile {
  id: number
  userid: number
  phone: string
  title: string
  location: string
  bio: string
  website: string
  skills: string[]
  resumeUrl: string | null
  resumeName: string | null
  experience: UserProfile["experience"]
  education: UserProfile["education"]
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [editProfileData, setEditProfileData] = useState<EditableUserProfile | null>(null)
  const [editprofileDataone, setEditProfileDataone] = useState<EditableUserProfile | null>(null)

  // Local state for skills input
  const [skillsInput, setSkillsInput] = useState("");

  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [editingEducation, setEditingEducation] = useState<number | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)

  const { toast } = useToast()

  let token = localStorage.getItem("token") || "";

  let userdata = user;
  console.log('userdata', userdata)

  // Sync skillsInput with editedProfile when entering edit mode
  useEffect(() => {
    if (editMode && editedProfile) {
      setSkillsInput(editedProfile.skills.join(", "));
    }
  }, [editMode, editedProfile]);

  // Move fetchProfile outside useEffect so it can be called elsewhere
  const fetchProfile = async () => {
    let isMounted = true;
    try {
      const userid = user?.id;
      const token = localStorage.getItem("token");
      const response = await DataService.get(`/profile/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response?.data) {
        let userProfile = response?.data;
        if (isMounted) {
          setProfile(userProfile);
          setEditedProfile(userProfile);
          setIsLoading(false);
        }
      } else {
        const localUserRaw = localStorage.getItem("user");
        if (localUserRaw) {
          const localUser = JSON.parse(localUserRaw);
          const fallbackProfile = {
            firstName: localUser.firstName || "",
            lastName: localUser.lastName || "",
            email: localUser.email || "",
            phone: localUser.phone || "",
            title: localUser.title || "",
            location: localUser.location || "",
            bio: localUser.bio || "",
            website: localUser.website || "",
            skills: localUser.skills || [],
            resumeUrl: localUser.resumeUrl || null,
            resumeName: localUser.resumeName || null,
            resumeUpdated: localUser.resumeUpdated || null,
            userid: localUser.id || 0,
            id: 0,// localUser.id || 0,
            experience: localUser.experience || [],
            education: localUser.education || [],
          };
          if (isMounted) {
            setProfile(fallbackProfile);
            setEditedProfile(fallbackProfile);
          }
        }
        if (isMounted) setIsLoading(false);
      }
    } catch (error) {
      const localUserRaw = localStorage.getItem("user");
      if (localUserRaw) {
        const localUser = JSON.parse(localUserRaw);
        const fallbackProfile = {
          firstName: localUser.firstName || "",
          lastName: localUser.lastName || "",
          email: localUser.email || "",
          phone: localUser.phone || "",
          title: localUser.title || "",
          location: localUser.location || "",
          bio: localUser.bio || "",
          website: localUser.website || "",
          skills: localUser.skills || [],
          resumeUrl: localUser.resumeUrl || null,
          resumeName: localUser.resumeName || null,
          resumeUpdated: localUser.resumeUpdated || null,
          userid: localUser.id || 0,
          id: localUser.id || 0,
          experience: localUser.experience || [],
          education: localUser.education || [],
        };
        if (isMounted) {
          setProfile(fallbackProfile);
          setEditedProfile(fallbackProfile);
        }
      }
      if (isMounted) setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  };

  // useEffect to call fetchProfile on mount
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    if (!editedProfile || !user) return;

    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!rawUser || !token) {
      toast({
        title: "Error",
        description: "User session expired. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const userdata = JSON.parse(rawUser); // ✅ Safe now

    console.log('fsdfsd', userdata);

    // Update skills from skillsInput before saving
    editedProfile.skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const editProfileDataone = prepareProfileForApi(editedProfile, userdata);
    console.log('editProfileDataone', editProfileDataone);

    try {
      const response = await DataService.post("/profile/UpdateProfile", editProfileDataone, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setEditMode(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        // Refetch profile from API after update
        fetchProfile();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add file validation helper
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      })
      return false
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return false
    }

    if (file.size === 0) {
      toast({
        title: "Empty file",
        description: "Please upload a valid file that is not empty.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Handle resume upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      })
      e.target.value = ""
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      e.target.value = ""
      return
    }

    if (file.size === 0) {
      toast({
        title: "Empty file",
        description: "Please upload a valid file that is not empty.",
        variant: "destructive",
      })
      e.target.value = ""
      return
    }

    setIsUploadingResume(true)

    try {
      const token = localStorage.getItem("token");

      // Use your fileService to upload
      //const response = await fileService.uploadfile(file, "resume");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", 'resume');  


      const result = await fetch(base_url+"/api/File/UploadFile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT set Content-Type for FormData; browser will set it automatically
          },
          body: formData,
        }
      );


      const response = await result.json();

      if (response && response) {
        // Update the profile with the new resume information
        if (!editedProfile) {
          console.error("editedProfile is null")
          return
        }

        const updatedProfile = {
          ...editedProfile,
          resumeUrl: response[0].actualUrl, // Make sure this is set
          resumeName: file.name,
          resumeUpdated: new Date().toISOString(),
        }

        console.log('Updated profile:', updatedProfile) // Debug log

        // Update local state first
        setProfile(updatedProfile)
        setEditedProfile(updatedProfile)

        // Update profile on server with new resume info
        const userdata = JSON.parse(localStorage.getItem("user") || "{}")
        const profileData = prepareProfileForApi(updatedProfile, userdata)

        const updateResponse = await DataService.post("/profile/UpdateProfile", profileData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (updateResponse.status === 200) {
          toast({
            title: "Resume uploaded",
            description: "Your resume has been uploaded and is now available for viewing.",
          })
        } else {
          throw new Error("Failed to update profile with resume information")
        }
      } else {
        throw new Error("Upload failed - no file data returned")
      }
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingResume(false)
      // Reset file input
      if (e.target) {
        e.target.value = ""
      }
    }
  }

  // Handle resume deletion
  const handleDeleteResume = async () => {
    if (!user || !editedProfile) return

    try {
      const token = localStorage.getItem("token")
      const userdata = JSON.parse(localStorage.getItem("user") || "{}")

      // Update the profile to remove the resume
      const updatedProfile = {
        ...editedProfile,
        resumeUrl: null,
        resumeName: null,
        resumeUpdated: null,
      }

      // Update profile on server
      const profileData = prepareProfileForApi(updatedProfile, userdata)

      const response = await DataService.post("/profile/UpdateProfile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        // Update local state
        setProfile(updatedProfile)
        setEditedProfile(updatedProfile)

        toast({
          title: "Resume deleted",
          description: "Your resume has been deleted successfully. You can upload a new one anytime.",
        })
      } else {
        throw new Error("Failed to delete resume from profile")
      }
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
    if (!editedProfile) return;

    const maxId = editedProfile.experience.length
      ? Math.max(...editedProfile.experience.map(exp => typeof exp.id === 'number' ? exp.id : 0))
      : -1;

    const newExperience = {
      id: maxId + 1,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: null,
      description: "",
      current: true,
    };

    setEditedProfile({
      ...editedProfile,
      experience: [newExperience, ...editedProfile.experience],
    });

    setEditingExperience(newExperience.id);
  };

  // Handle adding new education
  const handleAddEducation = () => {
    if (!editedProfile) return;

    const maxId = editedProfile.education.length
      ? Math.max(...editedProfile.education.map(edu => typeof edu.id === 'number' ? edu.id : 0))
      : -1;

    const newEducation = {
      id: maxId + 1,
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: null,
      description: "",
      current: true,
    };

    setEditedProfile({
      ...editedProfile,
      education: [newEducation, ...editedProfile.education],
    });

    setEditingEducation(newEducation.id);
  };

  // Handle deleting experience
  const handleDeleteExperience = (id: number) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      experience: editedProfile.experience.filter((exp) => exp.id !== id),
    });
  };

  // Handle deleting education
  const handleDeleteEducation = (id: number) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      education: editedProfile.education.filter((edu) => edu.id !== id),
    });
  };

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

  // Add this function before handleSaveProfile
  function prepareProfileForApi(profile: UserProfile, user: { id: number }): any {
    return {
      id: profile.id, // Always 0 for update
      userId: user.id, // Use userId, not userid
      phone: profile.phone,
      title: profile.title,
      location: profile.location,
      bio: profile.bio,
      website: profile.website,
      skills: profile.skills,
      resumeUrl: profile.resumeUrl,
      resumeName: profile.resumeName,
      resumeUpdated: profile.resumeUpdated,
      experience: profile.experience.map((exp: any) => ({
        id: exp.id, // Use the actual id
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        current: exp.current,
      })),
      education: profile.education.map((edu: any) => ({
        id: edu.id, // Use the actual id
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description,
        current: edu.current,
      })),
    };
  }

  console.log('profile', profile);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

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
        <Button className="mt-4 bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white" variant="ghost">Retry</Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
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
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white" variant="ghost">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditMode(true)} className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white" variant="ghost">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 bg-white shadow-lg border-0">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Profile</TabsTrigger>
          <TabsTrigger value="resume" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Resume</TabsTrigger>
          {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Basic Information */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Basic Information</CardTitle>
              <CardDescription>Your personal and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editMode ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userdata?.firstName || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => (prev ? { ...prev, firstName: e.target.value } : null))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userdata?.lastName || ""}
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
                      value={userdata?.email || ""}
                      onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedProfile?.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Accept only digits, spaces, dashes, parentheses, plus
                        if (/^[\d\s\-()+]*$/.test(value)) {
                          setEditedProfile((prev) => (prev ? { ...prev, phone: value } : null));
                        }
                      }}
                      maxLength={10}
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
                        {userdata?.firstName} {userdata?.lastName}
                      </h3>
                      <p className="text-muted-foreground">{profile?.title}</p>
                    </div>
                  </div>

                  <p className="text-sm">{profile.bio}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userdata?.email}</span>
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
                      {profile.website ? (
                        <a
                          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No website</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Skills</CardTitle>
              <CardDescription>Highlight your technical and professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Textarea
                      id="skills"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
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
                <CardTitle className="text-base md:text-lg font-bold text-gray-800">Work Experience</CardTitle>
                <CardDescription>Your professional work history</CardDescription>
              </div>
              {editMode && (
                <Button size="sm" onClick={handleAddExperience} className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white" variant="ghost">
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
                <CardTitle className="text-base md:text-lg font-bold text-gray-800">Education</CardTitle>
                <CardDescription>Your academic background</CardDescription>
              </div>
              {editMode && (
                <Button size="sm" onClick={handleAddEducation} className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white" variant="ghost">
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
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Resume</CardTitle>
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
                        <p className="text-xs text-muted-foreground">
                          PDF Document • Ready to view
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* Download Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (profile.resumeUrl) {
                            // Create download link
                            const link = document.createElement('a')
                            link.href = profile.resumeUrl
                            link.target = '_blank'
                            link.download = profile.resumeName || 'resume.pdf'
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)

                            toast({
                              title: "Downloading",
                              description: "Your resume download should start shortly",
                            })
                          } else {
                            toast({
                              title: "No resume",
                              description: "Resume URL not available",
                              variant: "destructive",
                            })
                          }
                        }}
                        disabled={!profile.resumeUrl}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>

                      {/* Enhanced View Button */}
                      <Button
                        size="sm"
                        onClick={() => {
                          if (profile.resumeUrl) {
                            // Method 1: Direct window.open (most reliable)
                            const newWindow = window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer,width=1200,height=800')

                            // Check if popup was blocked
                            if (!newWindow) {
                              // Fallback: Create a temporary link element
                              const link = document.createElement('a')
                              link.href = profile.resumeUrl
                              link.target = '_blank'
                              link.rel = 'noopener noreferrer'
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)

                              toast({
                                title: "Opening resume",
                                description: "If the resume didn't open, please check your popup blocker settings",
                              })
                            } else {
                              toast({
                                title: "Opening resume",
                                description: "Your resume is opening in a new tab",
                              })
                            }
                          } else {
                            toast({
                              title: "No resume",
                              description: "Resume URL not available. Please try uploading your resume again.",
                              variant: "destructive",
                            })
                          }
                        }}
                        disabled={!profile.resumeUrl}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete your resume? This action cannot be undone.")) {
                            handleDeleteResume()
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Success message after upload */}
                  <div className="rounded-md bg-green-50 p-3 border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                          <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z" />
                        </svg>
                      </div>
                      <p className="text-sm text-green-800 font-medium">
                        Resume successfully uploaded and ready for viewing
                      </p>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Click "View Resume" button above to open your document in a new tab
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-[220px] flex-col items-center justify-center rounded-md p-8 text-center border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-gray-800">No resume uploaded</h3>
                  <p className="mt-1 text-xs text-gray-600">
                    Upload your resume in PDF, DOC, or DOCX format (Max 10MB)
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    <span className="font-medium">Supported formats:</span> PDF (.pdf), Microsoft Word (.doc, .docx)
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
                      variant="ghost"
                      className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white"
                      onClick={() => document.getElementById("resume-upload")?.click()}
                      disabled={isUploadingResume}
                    >
                      {isUploadingResume ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Profile Settings</CardTitle>
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
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Account Settings</CardTitle>
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
              <CardTitle className="text-base md:text-lg font-bold text-gray-800">Danger Zone</CardTitle>
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
        </TabsContent> */}
      </Tabs>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Delete Resume</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete your resume? You'll need to upload a new one if you want employers to see your resume.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteResume()
                  setShowDeleteConfirmation(false)
                }}
              >
                Delete Resume
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
