"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, KeyRound } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Back Button */}
            <Link href="/login" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to login</span>
            </Link>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">Skillfinite</span>
            </div>

            {/* Success Message */}
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-gray-600">We've sent password reset instructions to</p>
              <p className="font-medium text-gray-900">{email}</p>

              <div className="space-y-4">
                <Button asChild className="w-full h-12 bg-black hover:bg-gray-800 text-white">
                  <Link href="/login">Back to Login</Link>
                </Button>

                <p className="text-sm text-gray-600">
                  Didn't receive the email?{" "}
                  <button onClick={() => setIsSubmitted(false)} className="text-black font-medium hover:underline">
                    Try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Dark Section */}
        <div className="flex-1 bg-black text-white p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 border border-gray-600 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-gray-800 rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">Skillfinite</span>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Reset Link Sent</h2>
              <p className="text-gray-300 leading-relaxed">
                Check your email inbox and click the reset link to create a new password for your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <Link href="/login" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </Link>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">Skillfinite</span>
          </div>

          {/* Forgot Password Form */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">No worries, we'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white">
                Send Reset Instructions
              </Button>
            </form>

            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Remember your password? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dark Section */}
      <div className="flex-1 bg-black text-white p-8 flex flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border border-gray-600 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gray-800 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">Skillfinite</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-gray-300 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password and get back to learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
