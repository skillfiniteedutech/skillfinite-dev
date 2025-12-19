"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import UdemyNavbar from '@/components/UdemyNavbar'
import Footer from '@/components/Footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Camera,
  Save,
  X,
  Edit,
  Loader2,
  Shield,
  Award,
  BookOpen,
  Clock
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  occupation?: string
  company?: string
  website?: string
  dateJoined?: string
  role?: string
  coursesEnrolled?: number
  coursesCompleted?: number
  totalLearningHours?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "temp-id",
    name: "Loading...",
    email: "loading@example.com",
    phone: "",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "",
    location: "",
    occupation: "",
    company: "",
    website: "",
    dateJoined: new Date().toISOString(),
    role: "Student",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalLearningHours: 0
  })
  const [originalData, setOriginalData] = useState<UserProfile>(profileData)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (authUser) {
      loadProfile()
    }
  }, [authUser])

  const loadProfile = async () => {
    try {
      // Get token
      const token = localStorage.getItem('token')
      if (!token) {
        initializeDefaultProfile()
        return
      }

      // Fetch from backend
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      const response = await fetch(`${baseUrl}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          const profile = {
            ...data.data,
            avatar: data.data.avatar || authUser?.avatar || "/placeholder.svg?height=120&width=120"
          }
          setProfileData(profile)
          setOriginalData(profile)
          // Also save to localStorage as backup
          localStorage.setItem('skillfinite-profile', JSON.stringify(profile))
          return
        }
      }

      // Fallback to localStorage or default
      const savedProfile = localStorage.getItem('skillfinite-profile')
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          setProfileData(parsed)
          setOriginalData(parsed)
        } catch (error) {
          console.error('Error loading profile:', error)
          initializeDefaultProfile()
        }
      } else {
        initializeDefaultProfile()
      }
    } catch (error) {
      console.error('Error fetching profile from backend:', error)
      // Try localStorage as fallback
      const savedProfile = localStorage.getItem('skillfinite-profile')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        setProfileData(parsed)
        setOriginalData(parsed)
      } else {
        initializeDefaultProfile()
      }
    }
  }

  const initializeDefaultProfile = () => {
    const defaultProfile: UserProfile = {
      id: authUser?.id || "user123",
      name: authUser?.name || "John Doe",
      email: authUser?.email || "john.doe@example.com",
      phone: "+91 9876543210",
      avatar: authUser?.avatar || "/placeholder.svg?height=120&width=120",
      bio: "Passionate learner exploring new technologies and skills.",
      location: "Mumbai, India",
      occupation: "Software Developer",
      company: "Tech Corp",
      website: "https://johndoe.com",
      dateJoined: new Date().toISOString(),
      role: authUser?.role || "Student",
      coursesEnrolled: authUser?.coursesEnrolled || 5,
      coursesCompleted: authUser?.coursesCompleted || 2,
      totalLearningHours: authUser?.totalLearningHours || 48
    }

    setProfileData(defaultProfile)
    setOriginalData(defaultProfile)
    localStorage.setItem('skillfinite-profile', JSON.stringify(defaultProfile))
  }

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Validate required fields
      if (!profileData.name || !profileData.email) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Name and email are required fields."
        })
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileData.email)) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter a valid email address."
        })
        return
      }

      // Get token
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in again."
        })
        router.push('/login')
        return
      }

      // Save to backend
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      const response = await fetch(`${baseUrl}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          occupation: profileData.occupation,
          company: profileData.company,
          website: profileData.website
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update local state with response data
        const updatedProfile = {
          ...profileData,
          ...data.data
        }
        setProfileData(updatedProfile)
        setOriginalData(updatedProfile)

        // Save to localStorage as backup
        localStorage.setItem('skillfinite-profile', JSON.stringify(updatedProfile))

        // Refresh global auth context - THIS UPDATES EVERYWHERE!
        await refreshUser()

        setIsEditing(false)

        toast({
          title: "Profile Updated! 🎉",
          description: "Your profile has been updated everywhere in the app."
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update profile. Please try again."
        })
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Avatar must be less than 5MB"
      })
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload an image file"
      })
      return
    }

    try {
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to backend
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Avatar Preview Updated",
          description: "Don't forget to save your changes!"
        })
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch(`${baseUrl}/api/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update with server URL
        const serverAvatarUrl = `${baseUrl}${data.data.avatar}`
        handleInputChange('avatar', serverAvatarUrl)

        // Refresh global auth context - updates avatar everywhere!
        await refreshUser()

        toast({
          title: "Avatar Uploaded! ✅",
          description: "Your profile picture has been updated everywhere in the app."
        })
      } else {
        toast({
          title: "Avatar Preview Updated",
          description: "Changes will be saved when you click 'Save Changes'"
        })
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: "Avatar Preview Updated",
        description: "Don't forget to save your changes!"
      })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <UdemyNavbar />

      <main className="pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  My Profile
                </h1>
                <p className="text-muted-foreground">
                  Manage your personal information and preferences
                </p>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isSaving ? (
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
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar and Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-800 shadow-xl">
                        <AvatarImage src={profileData.avatar} alt={profileData.name} />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                          {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {isEditing && (
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-center">{profileData.name}</h2>
                    <p className="text-sm text-muted-foreground text-center">{profileData.email}</p>

                    <Badge className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600">
                      {profileData.role}
                    </Badge>

                    {profileData.dateJoined && (
                      <div className="mt-4 flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Member since {new Date(profileData.dateJoined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enrolled</p>
                        <p className="text-lg font-bold text-blue-600">{profileData.coursesEnrolled}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-lg font-bold text-green-600">{profileData.coursesCompleted}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Learning Hours</p>
                        <p className="text-lg font-bold text-purple-600">{profileData.totalLearningHours}h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Basic Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name || ""}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your full name"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email || ""}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          placeholder="your.email@example.com"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profileData.phone || ""}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          placeholder="+91 9876543210"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location || ""}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          placeholder="City, Country"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Professional Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="occupation" className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Occupation
                        </Label>
                        <Input
                          id="occupation"
                          value={profileData.occupation || ""}
                          onChange={(e) => handleInputChange('occupation', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Your profession"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Company
                        </Label>
                        <Input
                          id="company"
                          value={profileData.company || ""}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Company name"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={profileData.website || ""}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://yourwebsite.com"
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Bio */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      About You
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio || ""}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                      <p className="text-xs text-muted-foreground">
                        {(profileData.bio || "").length} / 500 characters
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        * Required fields
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/profile/billing')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Billing History</h3>
                        <p className="text-sm text-muted-foreground">View invoices & payments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/settings')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Settings</h3>
                        <p className="text-sm text-muted-foreground">Privacy & security</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div >
      </main>
      <Footer />
    </div>
  )
}

