// Mock user profile data for demonstration purposes
// In a real application, this would fetch data from a database

interface UserProfile {
  id: string
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

// Mock profiles database
const profiles: Record<string, UserProfile> = {
  "1": {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "employer@example.com",
    phone: "+1 (555) 123-4567",
    title: "HR Manager",
    location: "San Francisco, CA",
    bio: "Experienced HR professional with a passion for recruiting top talent.",
    website: "https://johndoe.com",
    skills: ["Recruiting", "HR Management", "Talent Acquisition"],
    resumeUrl: null,
    resumeName: null,
    resumeUpdated: null,
    experience: [],
    education: [],
  },
  "2": {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jobseeker@example.com",
    phone: "+1 (555) 987-6543",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    bio: "Experienced frontend developer with a passion for creating beautiful, responsive web applications. Specialized in React, TypeScript, and modern JavaScript frameworks.",
    website: "https://janesmith.dev",
    skills: ["React", "TypeScript", "Next.js", "CSS", "Tailwind CSS", "JavaScript", "Node.js", "Git"],
    resumeUrl: "/placeholder-resume.pdf",
    resumeName: "Jane_Smith_Resume.pdf",
    resumeUpdated: "2023-04-15T14:30:00",
    experience: [
      {
        id: "exp1",
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        startDate: "2021-03",
        endDate: null,
        description:
          "Lead frontend development for the company's main product. Implemented new features, improved performance, and mentored junior developers.",
        current: true,
      },
      {
        id: "exp2",
        title: "Frontend Developer",
        company: "WebSolutions",
        location: "New York, NY",
        startDate: "2018-06",
        endDate: "2021-02",
        description:
          "Developed and maintained client websites using React and TypeScript. Collaborated with designers to implement responsive designs.",
        current: false,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "Master of Computer Science",
        institution: "Stanford University",
        location: "Stanford, CA",
        startDate: "2014-09",
        endDate: "2016-05",
        description: "Focused on web technologies and user interface design.",
        current: false,
      },
    ],
  },
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return the profile if it exists
  return profiles[userId] || null
}

export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Update the profile
  if (!profiles[userId]) {
    throw new Error("User profile not found")
  }

  profiles[userId] = {
    ...profiles[userId],
    ...profileData,
  }

  return profiles[userId]
}

export async function uploadResume(userId: string, fileName: string, fileUrl: string): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Update the profile with the new resume
  if (!profiles[userId]) {
    throw new Error("User profile not found")
  }

  profiles[userId] = {
    ...profiles[userId],
    resumeUrl: fileUrl,
    resumeName: fileName,
    resumeUpdated: new Date().toISOString(),
  }

  return profiles[userId]
}
