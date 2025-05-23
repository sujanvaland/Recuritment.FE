"use client"

import { useState } from "react"
import { LogOut, Shield, User, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Profile Picture</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Upload New
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName || "Jane"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName || "Smith"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || "jane.smith@example.com"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Account Preferences</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="language">Language</Label>
                    <select id="language" className="rounded-md border p-2">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select id="timezone" className="rounded-md border p-2">
                      <option value="utc-8">Pacific Time (UTC-8)</option>
                      <option value="utc-5">Eastern Time (UTC-5)</option>
                      <option value="utc+0">GMT (UTC+0)</option>
                      <option value="utc+1">Central European Time (UTC+1)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-job-alerts">Job Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new job matches</p>
                    </div>
                    <Switch id="email-job-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-applications">Application Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when your application status changes
                      </p>
                    </div>
                    <Switch id="email-applications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">Receive emails when you get new messages</p>
                    </div>
                    <Switch id="email-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Marketing</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch id="email-marketing" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-job-alerts">Job Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications about new job matches</p>
                    </div>
                    <Switch id="push-job-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-applications">Application Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications when your application status changes
                      </p>
                    </div>
                    <Switch id="push-applications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications when you get new messages
                      </p>
                    </div>
                    <Switch id="push-messages" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Notification Frequency</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="frequency">Email Digest Frequency</Label>
                    <select id="frequency" className="rounded-md border p-2">
                      <option value="immediately">Immediately</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and visibility preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Profile Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility">Who can see your profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Control who can view your full profile information
                      </p>
                    </div>
                    <select id="profile-visibility" className="rounded-md border p-2">
                      <option value="public">Everyone</option>
                      <option value="employers">Employers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="resume-visibility">Resume Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can download your resume</p>
                    </div>
                    <select id="resume-visibility" className="rounded-md border p-2">
                      <option value="public">Everyone</option>
                      <option value="employers">Employers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="contact-info">Contact Information</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your contact information</p>
                    </div>
                    <select id="contact-info" className="rounded-md border p-2">
                      <option value="public">Everyone</option>
                      <option value="employers">Employers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data Usage</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-analytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to use your data for analytics and improvements
                      </p>
                    </div>
                    <Switch id="data-analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-personalization">Personalization</Label>
                      <p className="text-sm text-muted-foreground">Allow us to personalize your job recommendations</p>
                    </div>
                    <Switch id="data-personalization" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data Export & Deletion</h3>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Export My Data
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete My Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and login options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="space-y-3">
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
                  <Button>Update Password</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Login Sessions</h3>
                <div className="space-y-3">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • San Francisco, CA</p>
                        <p className="text-xs text-muted-foreground">Started April 23, 2023 at 10:23 AM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-sm">Active Now</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out of All Devices
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
