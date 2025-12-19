"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, Github, Facebook, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-context"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const { login } = useAuth()

  // Google Sign-In initialization
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleSignIn,
        })

        const googleButton = document.getElementById("google-signup-btn")
        if (googleButton) {
          window.google.accounts.id.renderButton(googleButton, {
            theme: "outline",
            size: "large",
            text: "signup_with",
            width: "100%",
          })
        }
      }
    }

    // Load Google Identity Services script
    if (!window.google) {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.head.appendChild(script)
    } else {
      initializeGoogleSignIn()
    }
  }, [])

  const handleGoogleSignIn = async (response: any) => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/google/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          credential: response.credential,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Google sign-up failed")
      }

      const data = await res.json()

      if (data.token && data.user) {
        // Use the auth context to login
        await login(data.token, data.user, false)

        // Redirect to dashboard
        window.location.href = "/mycourses"
      } else {
        throw new Error("Authentication failed: No token received")
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign up with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "student",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setSuccessMessage("Account created successfully! Please check your email to verify your account.")

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      })
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-base">Skillfinite</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
              Home
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
              Sign In
            </Link>
          </nav>
        </div>
      </header> */}

      <div className="flex">
        {/* Left Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-lg">Skill<span className="text-orange-500">finite</span></span>
            </div>

            {/* Sign Up Form */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

              {/* Success Message */}
              {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* General Error */}
              {(errors.general || error) && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{errors.general || error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign Up Button */}
              <div className="space-y-4">
                <div id="google-signup-btn" className="w-full" />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.firstName ? "border-red-500" : ""}`}
                        placeholder="John"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.lastName ? "border-red-500" : ""}`}
                      placeholder="Doe"
                      disabled={isLoading}
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="john.doe@gmail.com"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.password ? "border-red-500" : ""}`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-orange-600 font-medium hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-orange-600 font-medium hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
                </div>

                <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-orange-600 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Orange Section */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-orange-900 to-orange-800 text-white p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 border border-orange-300/30 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-orange-500/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400/20 rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-lg">Skill<span className="text-orange-400">finite</span></span>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
              <p className="text-orange-100 leading-relaxed mb-6">
                Start your learning journey with thousands of other students and professionals who are advancing their
                careers through our platform.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">Access to 1000+ courses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">Expert instructors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
