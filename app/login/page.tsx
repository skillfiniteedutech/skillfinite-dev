"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Github, Facebook, ArrowLeft, Star, Users, Shield, Zap } from "lucide-react"
import { useAuth } from "@/components/auth-context"

interface LoginResponse {
  message?: string
  requiresOTP?: boolean
  email?: string
  userId?: string
  success?: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
    role?: string
    avatar?: string
  }
  role?: string
  loginTime?: string
  expiresAt?: string
}

interface OTPVerifyResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      name: string
      avatar: string
      role: string
      emailVerified?: boolean
      createdAt?: string
      lastLogin?: string
    }
    token: string
    refreshToken?: string
    expiresIn?: number
  }
  user?: {
    id: string
    email: string
    name: string
    avatar?: string
    role?: string
    emailVerified?: boolean
    createdAt?: string
    lastLogin?: string
  }
  id?: string
  email?: string
  name?: string
  avatar?: string
  role?: string
  emailVerified?: boolean
  createdAt?: string
  lastLogin?: string
  token?: string
  refreshToken?: string
  expiresIn?: number
  expiresAt?: string
  loginTime?: string
}

declare global {
  interface Window {
    google: any
    handleGoogleSignIn?: (response: any) => void
  }
}

// Wrapper component that uses useSearchParams
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("user@gmail.com")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [userId, setUserId] = useState("")
  const [otpEmail, setOtpEmail] = useState("")
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Removed manual session cookie setter; backend sets cookies via CORS when credentials: 'include' is used

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        })
        window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
        })
      }
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = initializeGoogleAuth
    document.head.appendChild(script)

    window.handleGoogleSignIn = handleGoogleSignIn

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
      delete window.handleGoogleSignIn
    }
  }, [])

  const handleGoogleSignIn = async (response: any) => {
    setIsGoogleLoading(true)
    setError("")
    try {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/google/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credential: response.credential,
          rememberMe,
        }),
      })

      const data: any = await backendResponse.json()

      if (!backendResponse.ok) {
        throw new Error(data.message || "Google sign-in failed")
      }

      if (data.token && data.user) {
        await login(data.token, data.user, rememberMe)
        const redirectTo = searchParams.get("redirect") || "/mycourses"
        router.push(redirectTo)
        router.refresh()
      } else if (data.requiresOTP) {
        setShowOTPForm(true)
        setUserId(data.userId)
        setOtpEmail(data.email)
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError(err instanceof Error ? err.message : "Google sign-in failed")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      })

      const raw: LoginResponse = await response.json()

      if (!response.ok) {
        throw new Error(raw.message || "Login failed")
      }

      if (raw.requiresOTP) {
        setShowOTPForm(true)
        if (raw.userId) setUserId(raw.userId)
        if (raw.email) setOtpEmail(raw.email)
        setError("")
        return
      }

      if (raw.success && raw.token) {
        if (raw.user) {
          await login(raw.token, raw.user, rememberMe)
          const redirectTo = searchParams.get("redirect") || "/mycourses"
          router.push(redirectTo)
          router.refresh()
          return
        }
      }

      const anyRaw: any = raw as any
      if (anyRaw.token && anyRaw.user) {
        await login(anyRaw.token, anyRaw.user, rememberMe)
        const redirectTo = searchParams.get("redirect") || "/mycourses"
        router.push(redirectTo)
        router.refresh()
        return
      }

      throw new Error("Login failed: no token in response")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("")
      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)
      const lastIndex = Math.min(index + digits.length - 1, 5)
      otpInputRefs.current[lastIndex]?.focus()
      return
    }

    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifyingOTP(true)
    setError("")
    setInfo("")

    if (!userId || !otpEmail) {
      setIsVerifyingOTP(false)
      setError("Your verification session has expired. Please sign in again.")
      return
    }

    try {
      const payload = {
        userId,
        email: otpEmail,
        otp: otp.join("").trim(),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const responseData = (await response.json()) as OTPVerifyResponse

      if (!response.ok || responseData.success === false) {
        const msg = (responseData && (responseData as any).message) || "OTP verification failed"
        throw new Error(msg)
      }

      let token: string | undefined
      let user: any
      let refreshToken: string | undefined
      let expiresIn: number | undefined
      let expiresAt: string | undefined

      if (responseData.data) {
        token = responseData.data.token
        user = responseData.data.user
        refreshToken = responseData.data.refreshToken
        expiresIn = responseData.data.expiresIn
      } else {
        token = (responseData as any).token
        user = (responseData as any).user
        refreshToken = (responseData as any).refreshToken
        expiresIn = (responseData as any).expiresIn
        expiresAt = (responseData as any).expiresAt
      }

      if (!expiresIn && expiresAt) {
        expiresIn = Math.max(1, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      }

      if (token && user) {
        await login(token, user, rememberMe)
        const redirectTo = searchParams.get("redirect") || "/mycourses"
        router.push(redirectTo)
        router.refresh()
      } else {
        throw new Error("Authentication failed: No token received")
      }
    } catch (err) {
      console.error("OTP verification error:", err)
      const msg = err instanceof Error ? err.message : "OTP verification failed"
      setError(msg)

      if (/already been used/i.test(msg)) {
        setOtp(["", "", "", "", "", ""])
        setInfo(`That code was already used. We sent a new OTP to ${otpEmail}. Please enter the new code.`)
        await handleResendOTP(true)
      }
    } finally {
      setIsVerifyingOTP(false)
    }
  }

  const handleBackToLogin = () => {
    setShowOTPForm(false)
    setOtp(["", "", "", "", "", ""])
    setError("")
    setInfo("")
    setUserId("")
    setOtpEmail("")
  }

  const handleResendOTP = async (silent = false) => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          email: otpEmail,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }
      if (!silent) {
        alert("OTP resent successfully!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="lg:hidden border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg">Skill<span className="text-orange-500">finite</span></span>
          </div>
          <nav className="flex items-center space-x-3">
            <Link href="/" className="text-gray-600 hover:text-orange-600 font-medium text-sm">
              Home
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-orange-600 font-medium text-sm">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex min-h-screen lg:min-h-screen">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-white">
          <div className="w-full max-w-sm space-y-6">
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base">K</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Skill<span className="text-orange-500">finite</span></span>
            </div>

            {!showOTPForm ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                  <p className="text-gray-600 text-base">Sign in to your account to continue</p>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                )}

                <div className="space-y-4">
                  <div
                    id="google-signin-button"
                    className={`w-full ${isGoogleLoading ? "opacity-50 pointer-events-none" : ""}`}
                  ></div>
                  {isGoogleLoading && (
                    <div className="text-center text-sm text-gray-600">Signing in with Google...</div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500 font-medium">Or continue with email</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl text-base focus:border-orange-500 focus:ring-orange-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-gray-200 rounded-xl text-base focus:border-orange-500 focus:ring-orange-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600 font-medium">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-gray-600">
                    {"Don't have an account? "}
                    <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
                      Sign up for free
                    </Link>
                  </p>
                </div>

                <div className="flex justify-center space-x-3 pt-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border-gray-200 hover:border-gray-300 bg-transparent"
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border-gray-200 hover:border-gray-300 bg-transparent"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToLogin}
                    className="p-0 h-auto text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Button>
                </div>

                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
                  <p className="text-gray-600 text-base">{"We've sent a 6-digit verification code to"}</p>
                  <p className="font-semibold text-gray-900 text-base">{otpEmail}</p>
                </div>

                {info && (
                  <div className="p-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">{info}</div>
                )}

                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                )}

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 block text-center">
                      Enter Verification Code
                    </Label>
                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el
                          }}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-mono font-semibold border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 transition-colors"
                          maxLength={1}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isVerifyingOTP || otp.some((digit) => !digit) || !userId || !otpEmail}
                  >
                    {isVerifyingOTP ? "Verifying..." : "Verify Code"}
                  </Button>

                  <div className="text-center">
                    <p className="text-gray-600">
                      {"Didn't receive the code? "}
                      <button
                        type="button"
                        onClick={() => handleResendOTP()}
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? "Resending..." : "Resend code"}
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-orange-900 to-orange-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-16 right-16 w-60 h-60 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-24 left-12 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white/25 rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center p-12 max-w-md">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl">Skill<span className="text-orange-400">finite</span></span>
            </div>

            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                {showOTPForm ? "Security First" : "Build Your Future"}
              </h2>
              <p className="text-orange-100 text-lg leading-relaxed mb-6">
                {showOTPForm
                  ? "We protect your account with advanced security measures. Your verification code ensures only you can access your account."
                  : "Join thousands of developers building amazing applications with our comprehensive platform. Start your journey today."}
              </p>

              {!showOTPForm && (
                <div className="flex items-center space-x-4 text-orange-200 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">17,000+ Users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.9 Rating</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {showOTPForm ? (
                        <Shield className="w-5 h-5 text-orange-300" />
                      ) : (
                        <Zap className="w-5 h-5 text-orange-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base mb-1">
                        {showOTPForm ? "Advanced Security" : "Lightning Fast Setup"}
                      </h3>
                      <p className="text-orange-100 text-sm leading-relaxed">
                        {showOTPForm
                          ? "Multi-factor authentication and encrypted data protection keep your account secure."
                          : "Get started in minutes with our intuitive onboarding process and pre-built templates."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!showOTPForm && (
                <div className="flex items-center space-x-3 pt-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-slate-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-slate-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-2 border-slate-900"></div>
                    <div className="w-8 h-8 bg-slate-700 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">+12k</span>
                    </div>
                  </div>
                  <p className="text-orange-200 text-sm font-medium">Trusted by learners worldwide</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}