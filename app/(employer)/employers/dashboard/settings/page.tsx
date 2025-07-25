"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  Building,
  CreditCard,
  Globe,
  Lock,
  Mail,
  Save,
  Shield,
  User,
  Users,
  Plus,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { DataService } from "@/services/axiosInstance";
import fileService from "@/services/fileService"

export default function SettingsPage() {
  const { user } = useAuth()
  const [companyName, setCompanyName] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [companyIndustry, setCompanyIndustry] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyCity, setCompanyCity] = useState("")
  const [companyState, setCompanyState] = useState("")
  const [companyZip, setCompanyZip] = useState("")
  const [companyLogo, setCompanyLogo] = useState("")
  const [companyBanner, setCompanyBanner] = useState("")
  const [careerPageHeadline, setCareerPageHeadline] = useState("")
  const [careerPageDescription, setCareerPageDescription] = useState("")
  const [companyId, setCompanyId] = useState<number | null>(null)

  // Add tab visibility state
  const [tabVisibility, setTabVisibility] = useState({
    company: true,
    account: true,
    team: false, // Set to false to hide Team tab
    billing: true,
    notifications: true,
  });

  // Fetch company details on mount
  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("token")
      const storedCompanyId = localStorage.getItem("companyId")
      if (!storedCompanyId) return

      try {
        const response = await DataService.get(`/companies/${storedCompanyId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (response.status === 200 && response.data) {
          const data = response.data
          setCompanyId(data.id)
          setCompanyName(data.name || "")
          setCompanyWebsite(data.website || "")
          setCompanySize(data.companySize || "")
          setCompanyIndustry(data.industry || "")
          setCompanyDescription(data.description || "")
          setCompanyAddress(data.address || "")
          setCompanyCity(data.city || "")
          setCompanyState(data.state || "")
          setCompanyZip(data.zipCode || "")
          setCompanyLogo(data.companyLogo || "")
          setCompanyBanner(data.companyBanner || "")
          setCareerPageHeadline(data.careerPageHeadline || "")
          setCareerPageDescription(data.careerPageDescription || "")
        }
      } catch (error) {
        // Optionally handle error
      }
    }
    fetchCompany()
  }, [])

  const updateCompany = async () => {
    const payload = {
      id: companyId ?? 0,
      createdBy: user?.id ?? 0,
      modifiedBy: user?.id ?? 0,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      isDeleted: false,
      userId: user?.id ?? 0,
      name: companyName,
      website: companyWebsite,
      companySize,
      industry: companyIndustry,
      description: companyDescription,
      address: companyAddress,
      city: companyCity,
      state: companyState,
      zipCode: companyZip,
      companyLogo,
      companyBanner,
      careerPageHeadline,
      careerPageDescription,
    }
  
    const token = localStorage.getItem("token")
debugger;
    try {
      const response = await DataService.post(
        "/companies",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )

      if (response.status !== 200 && response.status !== 201) {
        alert("Failed to update company")
        return
      }

      const data = response.data
      setCompanyId(data.id)
      alert("Company updated successfully!")
    } catch (error) {
      alert("Failed to update company")
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await fileService.uploadfile(file, "companylogo");

      if (response && response.length > 0) {
        const logoUrl = response;
        setCompanyLogo(logoUrl);
        alert("Logo uploaded successfully!");
      } else {
        alert("Failed to upload logo.");
      }
    } catch (error) {
      alert("Error uploading logo.");
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await fileService.uploadfile(file, "companybanner");
      if (response && response.length > 0) {
        const bannerUrl = response;
        setCompanyBanner(bannerUrl);
        alert("Banner uploaded successfully!");
      } else {
        alert("Failed to upload banner.");
      }
    } catch (error) {
      alert("Error uploading banner.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and company settings</p>
      </div>

      <Tabs defaultValue="company" className="space-y-8">
        <TabsList className="w-full sm:w-auto">
          {tabVisibility.company && (
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline-block">Company</span>
            </TabsTrigger>
          )}
          {tabVisibility.account && (
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline-block">Account</span>
            </TabsTrigger>
          )}
          {/* Team tab is hidden if tabVisibility.team is false */}
          {tabVisibility.team && (
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline-block">Team</span>
            </TabsTrigger>
          )}
          {tabVisibility.billing && (
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline-block">Billing</span>
            </TabsTrigger>
          )}
          {tabVisibility.notifications && (
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline-block">Notifications</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Optionally, hide Team tab content as well */}
        {tabVisibility.company && (
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Manage your company information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="space-y-2">
                      <Label htmlFor="company-logo">Company Logo</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={companyLogo || "/placeholder.svg"} />
                          <AvatarFallback className="text-2xl">TC</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById("company-logo-upload")?.click()}
                          >
                            Change Logo
                          </Button>
                          <Input
                            id="company-logo-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleLogoUpload}
                            style={{ display: "none" }}
                          />
                          <p className="mt-2 text-xs text-muted-foreground">Recommended: 400x400px, PNG or JPG</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-banner">Company Banner</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-40 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden">
                          {companyBanner ? (
                            <img src={companyBanner} alt="Company Banner" className="h-full w-full object-cover" />
                          ) : (
                            <Building className="h-8 w-8 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById("company-banner-upload")?.click()}
                          >
                            Change Banner
                          </Button>
                          <Input
                            id="company-banner-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleBannerUpload}
                            style={{ display: "none" }}
                          />
                          <p className="mt-2 text-xs text-muted-foreground">Recommended: 1200x400px, PNG or JPG</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-website">Company Website</Label>
                      <div className="flex">
                        <div className="flex items-center rounded-l-md border border-r-0 bg-slate-100 px-3 text-sm text-muted-foreground">
                          <Globe className="mr-2 h-4 w-4" />
                        </div>
                        <Input
                          id="company-website"
                          className="rounded-l-none"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-size">Company Size</Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger id="company-size">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="50-200">50-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-industry">Industry</Label>
                      <Select value={companyIndustry} onValueChange={setCompanyIndustry}>
                        <SelectTrigger id="company-industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-description">Company Description</Label>
                    <Textarea
                      id="company-description"
                      rows={5}
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This description will be displayed on your company profile and job postings.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Company Location</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company-address">Address</Label>
                        <Input
                          id="company-address"
                          placeholder="123 Main St"
                          value={companyAddress}
                          onChange={e => setCompanyAddress(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-city">City</Label>
                        <Input
                          id="company-city"
                          placeholder="San Francisco"
                          value={companyCity}
                          onChange={e => setCompanyCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-state">State/Province</Label>
                        <Input
                          id="company-state"
                          placeholder="CA"
                          value={companyState}
                          onChange={e => setCompanyState(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-zip">Zip/Postal Code</Label>
                        <Input
                          id="company-zip"
                          placeholder="94103"
                          value={companyZip}
                          onChange={e => setCompanyZip(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="company-country">Country</Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="company-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={updateCompany}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Page</CardTitle>
                <CardDescription>Customize your company's career page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="career-headline">Career Page Headline</Label>
                  <Input
                    id="career-headline"
                    placeholder="Join our team and make an impact"
                    defaultValue="Join our team and make an impact"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career-description">Career Page Description</Label>
                  <Textarea
                    id="career-description"
                    rows={3}
                    defaultValue="At TechCorp, we're building the future of technology. Join our team of passionate innovators and problem-solvers."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-benefits">Show Benefits Section</Label>
                    <Switch id="show-benefits" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Display company benefits on your career page</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-culture">Show Company Culture</Label>
                    <Switch id="show-culture" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Display company culture and values on your career page</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Preview</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
        {tabVisibility.account && (
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your personal account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="space-y-2">
                    <Label htmlFor="profile-picture">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button size="sm" variant="outline">
                          Change Picture
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">Recommended: 400x400px, PNG or JPG</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue={user?.firstName || "John"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue={user?.lastName || "Doe"} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex">
                      <div className="flex items-center rounded-l-md border border-r-0 bg-slate-100 px-3 text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        className="rounded-l-none"
                        defaultValue={user?.email || "john.doe@techcorp.com"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" defaultValue="Hiring Manager" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <Switch id="two-factor" />
                  </div>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
        {tabVisibility.team && (
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Current Team Members (5)</div>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Team Member
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-muted-foreground">john.doe@techcorp.com</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Admin</Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Jane Smith</div>
                          <div className="text-sm text-muted-foreground">jane.smith@techcorp.com</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Recruiter</Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>RJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Robert Johnson</div>
                          <div className="text-sm text-muted-foreground">robert.johnson@techcorp.com</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Hiring Manager</Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Configure team roles and access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">Admin</div>
                        <div className="text-sm text-muted-foreground">Full access to all features</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">Recruiter</div>
                        <div className="text-sm text-muted-foreground">Can manage jobs and candidates</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">Hiring Manager</div>
                        <div className="text-sm text-muted-foreground">Can review candidates and conduct interviews</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {tabVisibility.billing && (
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Manage your subscription and billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium">Professional Plan</div>
                      <div className="text-sm text-muted-foreground">$99/month, billed monthly</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Job Postings</div>
                      <div className="text-sm font-medium">10 / month</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Active Jobs</div>
                      <div className="text-sm font-medium">Unlimited</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Candidate Database</div>
                      <div className="text-sm font-medium">Unlimited</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Team Members</div>
                      <div className="text-sm font-medium">5</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline" className="text-red-500 hover:text-red-600">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-md bg-slate-100 p-2">
                          <CreditCard className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Billing Information</Label>
                  <div className="rounded-md border p-4">
                    <div className="space-y-1">
                      <div className="font-medium">TechCorp Inc.</div>
                      <div className="text-sm">123 Main St, Suite 100</div>
                      <div className="text-sm">San Francisco, CA 94103</div>
                      <div className="text-sm">United States</div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Invoice #INV-1234</div>
                      <div className="text-sm text-muted-foreground">April 1, 2023</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">$99.00</div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Invoice #INV-1233</div>
                      <div className="text-sm text-muted-foreground">March 1, 2023</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">$99.00</div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Invoice #INV-1232</div>
                      <div className="text-sm text-muted-foreground">February 1, 2023</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">$99.00</div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {tabVisibility.notifications && (
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-applications">New Applications</Label>
                      <Switch id="new-applications" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when candidates apply to your jobs
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interview-reminders">Interview Reminders</Label>
                      <Switch id="interview-reminders" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">Receive reminders before scheduled interviews</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="job-expiry">Job Expiry Notifications</Label>
                      <Switch id="job-expiry" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when your job postings are about to expire
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="candidate-messages">Candidate Messages</Label>
                      <Switch id="candidate-messages" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when candidates send you messages
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="team-activity">Team Activity</Label>
                      <Switch id="team-activity" />
                    </div>
                    <p className="text-xs text-muted-foreground">Receive notifications about your team's activities</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <Switch id="marketing-emails" />
                    </div>
                    <p className="text-xs text-muted-foreground">Receive product updates, tips, and special offers</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Frequency</h3>

                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Email Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="notification-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow us to collect usage data to improve our services</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="third-party">Third-Party Sharing</Label>
                    <Switch id="third-party" />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow sharing your data with trusted third parties</p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Your privacy is important to us. Review our{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
