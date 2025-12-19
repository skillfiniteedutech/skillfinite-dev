"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { useTheme } from "next-themes"
import UdemyNavbar from "@/components/UdemyNavbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Camera,
  Mail,
  Phone,
  Settings,
  Moon,
  Sun,
  Monitor,
  HelpCircle,
  MessageCircle,
  FileText,
  Download,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  // Theme preferences
  const [themePreference, setThemePreference] = useState(theme || "system")

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    courseUpdates: true,
    achievementAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyDigest: true,
    reminderEmails: true
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    dataExport: false
  })

  // Support data
  const [supportData, setSupportData] = useState({
    subject: "",
    message: "",
    priority: "medium"
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      const token = localStorage.getItem('token')

      const response = await fetch(`${baseUrl}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await refreshUser()
        toast({
          title: "Profile Updated! ✅",
          description: "Your profile information has been updated successfully."
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update profile. Please try again."
        })
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setThemePreference(newTheme)
    setTheme(newTheme)
    toast({
      title: "Theme Updated! 🎨",
      description: `Switched to ${newTheme} theme.`
    })
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)
    try {
      // In real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Notification Settings Saved! 🔔",
        description: "Your notification preferences have been updated."
      })
    } catch (error) {
      console.error("Failed to save notification settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecuritySave = async () => {
    setIsLoading(true)
    try {
      // In real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Security Settings Updated! 🔒",
        description: "Your security preferences have been saved."
      })
    } catch (error) {
      console.error("Failed to save security settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupportSubmit = async () => {
    if (!supportData.subject || !supportData.message) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in both subject and message fields."
      })
      return
    }

    setIsLoading(true)
    try {
      // In real app, send to support system
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Support Request Sent! 📧",
        description: "We'll get back to you within 24 hours."
      })
      setSupportData({ subject: "", message: "", priority: "medium" })
    } catch (error) {
      console.error("Failed to send support request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <UdemyNavbar />

      <main className="bg-transparent">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage your account settings, preferences, and more
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* General Settings */}
              {activeTab === 'general' && (
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <User className="w-5 h-5" />
                      General Settings
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-700 shadow-lg">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Profile Picture
                        </h3>
                        <Button variant="outline" size="sm" className="mb-2">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            className="pl-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter your phone number"
                            className="pl-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Palette className="w-5 h-5" />
                      Appearance & Theme
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Customize the look and feel of your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300 font-medium mb-4 block">
                          Choose Your Theme
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => handleThemeChange('light')}
                            className={`p-4 rounded-lg border-2 transition-all ${themePreference === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Sun className="w-5 h-5 text-yellow-500" />
                              <span className="font-medium text-gray-900 dark:text-white">Light</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Clean and bright interface
                            </p>
                          </button>

                          <button
                            onClick={() => handleThemeChange('dark')}
                            className={`p-4 rounded-lg border-2 transition-all ${themePreference === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Moon className="w-5 h-5 text-blue-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Dark</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Easy on the eyes
                            </p>
                          </button>

                          <button
                            onClick={() => handleThemeChange('system')}
                            className={`p-4 rounded-lg border-2 transition-all ${themePreference === 'system'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Monitor className="w-5 h-5 text-gray-500" />
                              <span className="font-medium text-gray-900 dark:text-white">System</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Follows your device
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Choose how you want to be notified about updates and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications in your browser' },
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Get notified via email' },
                        { key: 'courseUpdates', label: 'Course Updates', description: 'New lessons and course announcements' },
                        { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'When you earn badges and certificates' },
                        { key: 'systemUpdates', label: 'System Updates', description: 'Platform maintenance and updates' },
                        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and offers' },
                        { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your learning progress' },
                        { key: 'reminderEmails', label: 'Reminder Emails', description: 'Course completion reminders' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
                          <div>
                            <Label className="text-gray-900 dark:text-white font-medium">
                              {setting.label}
                            </Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {setting.description}
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onCheckedChange={(checked) =>
                              setNotificationSettings(prev => ({ ...prev, [setting.key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleNotificationSave}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Notification Settings
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Shield className="w-5 h-5" />
                      Security & Privacy
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
                        <div>
                          <Label className="text-gray-900 dark:text-white font-medium">
                            Two-Factor Authentication
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
                        <div>
                          <Label className="text-gray-900 dark:text-white font-medium">
                            Login Alerts
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onCheckedChange={(checked) =>
                            setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))
                          }
                        />
                      </div>

                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
                        <Label className="text-gray-900 dark:text-white font-medium mb-2 block">
                          Session Timeout
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Automatically log out after {securitySettings.sessionTimeout} minutes of inactivity
                        </p>
                        <div className="flex gap-2">
                          {[15, 30, 60, 120].map((time) => (
                            <Button
                              key={time}
                              variant={securitySettings.sessionTimeout === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSecuritySettings(prev => ({ ...prev, sessionTimeout: time }))}
                            >
                              {time}m
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>

                    <Button
                      onClick={handleSecuritySave}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Security Settings
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Support Settings */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  {/* Contact Support */}
                  <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <MessageCircle className="w-5 h-5" />
                        Contact Support
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Get help with your account or report issues
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300 font-medium">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          value={supportData.subject}
                          onChange={(e) => setSupportData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="What can we help you with?"
                          className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300 font-medium">
                          Priority
                        </Label>
                        <select
                          id="priority"
                          value={supportData.priority}
                          onChange={(e) => setSupportData(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">
                          Message
                        </Label>
                        <textarea
                          id="message"
                          value={supportData.message}
                          onChange={(e) => setSupportData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Please describe your issue or question in detail..."
                          rows={6}
                          className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                        />
                      </div>

                      <Button
                        onClick={handleSupportSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Support Request
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Help Resources */}
                  <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <HelpCircle className="w-5 h-5" />
                        Help Resources
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Find answers to common questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Help Center
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Live Chat
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
