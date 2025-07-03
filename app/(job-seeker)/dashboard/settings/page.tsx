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
import { DataService } from "@/services/axiosInstance";
import { useToast } from "@/hooks/use-toast"

 interface UserSettings {
  id: number; 
  userId: string;
  notifications: {
    id: number;    
    userId: string;
    emailNotifications: boolean;
    applicationUpdates: boolean;
    jobAlerts: boolean;
    messageNotifications: boolean;
    interviewReminders: boolean;
    marketingEmails: boolean;
  };

  privacy: {
    id: number;    
    userId: string;
    profileVisible: boolean;
    showContactInfo: boolean;
    allowMessaging: boolean;
    shareJobActivity: boolean;
    shareApplicationHistory: boolean;
  };
 
}


export default function SettingsPage() {
  const { user, logout } = useAuth()
    const { toast } = useToast()

  let token = localStorage.getItem("token") || "";
   let userdata = user;


  const [isSaving, setIsSaving] = useState(false)
  const [userSettings, setUserSettings] = useState<UserSettings>({
  id:0, 
  userId: userdata?.id.toString() || "",
  notifications: {
    id: 0,   
    userId:userdata?.id.toString() || "",
    emailNotifications: false,
    applicationUpdates: false,
    jobAlerts: false,
    messageNotifications: false,
    interviewReminders: false,
    marketingEmails: false,
  },
  privacy: {
    id: 0,  
   userId:userdata?.id.toString() || "",
    profileVisible: false,
    showContactInfo: false,
    allowMessaging: false,
    shareJobActivity: false,
    shareApplicationHistory: false,
  },
});

  

  const handleSaveSettings = async () => {
    console.log("Saving settings...", userSettings)
     setIsSaving(true)

      try {
      const response = await DataService.post("/settings/UpdateSetting", userSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
      setIsSaving(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        // Refetch profile from API after update
       
      }
    } catch (error) {
      console.error("Error saving profile:", error);
       setIsSaving(false)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }


    // // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))
   
  }


  const handleNotificationChange = (field: keyof UserSettings["notifications"]) => (value: boolean) => {
  setUserSettings(prev => ({
    ...prev,
    notifications: {
      ...prev.notifications,
      [field]: value,
    },
  }));
};

const handlePrivacyChange = (field: keyof UserSettings["privacy"]) => (value: boolean) => {
  setUserSettings(prev => ({
    ...prev,
    privacy: {
      ...prev.privacy,
      [field]: value,
    },
  }));
};



  return ( 
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            {/* <TabsTrigger value="general">General</TabsTrigger> */}
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

       

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* <h3 className="font-medium">Email Notifications</h3> */}
                <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-job-alerts">Email Notification</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new job matches</p>
                    </div>
                   <Switch
                        id="email-notification"
                        checked={userSettings.notifications.emailNotifications}
                        onCheckedChange={handleNotificationChange("emailNotifications")}
                      />

                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-job-alerts">Job Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new job matches</p>
                    </div>
                    <Switch
                        id="email-job-alerts"
                        checked={userSettings.notifications.jobAlerts}
                        onCheckedChange={handleNotificationChange("jobAlerts")}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-applications">Application Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when your application status changes
                      </p>
                    </div>
                    <Switch
                        id="email-applications"
                        checked={userSettings.notifications.applicationUpdates}
                        onCheckedChange={handleNotificationChange("applicationUpdates")}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">Receive emails when you get new messages</p>
                    </div>
                    <Switch
                      id="email-messages"
                      checked={userSettings.notifications.messageNotifications}
                      onCheckedChange={handleNotificationChange("messageNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Marketing</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch
                      id="email-marketing"
                      checked={userSettings.notifications.marketingEmails}
                      onCheckedChange={handleNotificationChange("marketingEmails")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Interview Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch
                        id="interview-reminders"
                        checked={userSettings.notifications.interviewReminders}
                        onCheckedChange={handleNotificationChange("interviewReminders")}
                      />
                  </div>
                </div>
              </div>

              <Separator />

              {/* <div className="space-y-4">
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
              </div> */}

              {/* <Separator /> */}

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
                {/* <h3 className="font-medium">Profile Visibility</h3> */}
                <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch
                        id="profile-visibility"
                        checked={userSettings.privacy.profileVisible}
                        onCheckedChange={handlePrivacyChange("profileVisible")}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Show ContactInfo</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch
                        id="show-contactinfo"
                        checked={userSettings.privacy.showContactInfo}
                        onCheckedChange={handlePrivacyChange("showContactInfo")}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Share Job Activity</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                        <Switch
                        id="sharejob-activity"
                        checked={userSettings.privacy.shareJobActivity}
                        onCheckedChange={handlePrivacyChange("shareJobActivity")}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Share Application History</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch
                      id="shareapplication-history"
                      checked={userSettings.privacy.shareApplicationHistory}
                      onCheckedChange={handlePrivacyChange("shareApplicationHistory")}
                    />
                  </div>
                </div>
              </div>

              {/* <Separator />

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
              </div> */}

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
