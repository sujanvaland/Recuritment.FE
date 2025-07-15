"use client"

import { useState, useEffect } from "react"
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

  const [passwords, setPasswords] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [passwordError, setPasswordError] = useState<string | null>(null);
const [isPasswordSaving, setIsPasswordSaving] = useState(false);

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setPasswords({ ...passwords, [e.target.id]: e.target.value });
  setPasswordError(null);
};

const validatePassword = () => {
  if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
    setPasswordError("All fields are required.");
    return false;
  }
  if (passwords.newPassword.length < 6) {
    setPasswordError("New password must be at least 6 characters.");
    return false;
  }
  if (passwords.newPassword !== passwords.confirmPassword) {
    setPasswordError("New password and confirm password do not match.");
    return false;
  }
  return true;
};

 const handleUpdatePassword = async () => {
  if (!validatePassword()) return;
  setIsPasswordSaving(true);
  try {
    const response = await DataService.post(
      "/settings/UpdatePassword",
      passwords,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  } catch (error: any) {
    setPasswordError(error?.response?.data?.message || "Failed to update password.");
  } finally {
    setIsPasswordSaving(false);
  }
};


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

 const fetchSettings = async () => {
      try {
        const response = await DataService.get("/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200 && response.data) {

          console.log("Fetched settings:", response.data);
          const data = response.data;
          setUserSettings(prev => ({
            ...prev,
            id: data.id,
            userId: data.userId,
            notifications: {
              ...prev.notifications,
              ...data.notifications,
            },
            privacy: {
              ...prev.privacy,
              ...data.privacy,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };


useEffect(() => { 
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

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
       fetchSettings();
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
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          <Button onClick={handleUpdatePassword} disabled={isPasswordSaving}>
            {isPasswordSaving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
      {/* ...rest of security tab... */}
    </CardContent>
  </Card>
</TabsContent>
      </Tabs>
    </>
  )
}
