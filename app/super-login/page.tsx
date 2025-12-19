'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/auth-context'
import { Checkbox } from "@/components/ui/checkbox"

export default function SuperLoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSuperLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            // Call the simple-login API endpoint (no OTP required)
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
            const response = await fetch(`${baseUrl}/api/auth/simple-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important: Include cookies
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Use the auth context login function - this handles:
                // - localStorage (token + user)
                // - Cookies (auth_token)
                // - Session API call
                if (data.token && data.user) {
                    await login(data.token, data.user, rememberMe)

                    console.log('✅ Super login successful!')
                    console.log('📦 Token stored in localStorage and cookies')
                    console.log('👤 User data:', data.user)

                    // Redirect to dashboard
                    router.push('/mycourses')
                    router.refresh()
                } else {
                    setError('Login succeeded but missing token or user data')
                }
            } else {
                setError(data.message || 'Login failed. Please check your credentials.')
            }
        } catch (error) {
            console.error('Super login error:', error)
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <LogIn className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        Super Login
                    </CardTitle>
                    <CardDescription className="text-base">
                        Direct access - No OTP required
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSuperLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            />
                            <Label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer">
                                Remember me for 30 days
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login Instantly
                                </>
                            )}
                        </Button>
                    </CardContent>
                </form>

                <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                    <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">What happens when you login:</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                            <li>✅ Token saved to <code className="bg-orange-100 px-1 rounded">localStorage</code></li>
                            <li>✅ User data saved to <code className="bg-orange-100 px-1 rounded">localStorage</code></li>
                            <li>✅ Auth cookie set (<code className="bg-orange-100 px-1 rounded">auth_token</code>)</li>
                            <li>✅ Session API called for cookie sync</li>
                        </ul>
                    </div>

                    <div className="text-sm text-center text-gray-600">
                        <p>For regular login with OTP verification,</p>
                        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                            use the standard login →
                        </Link>
                    </div>

                    <div className="text-xs text-center text-gray-500 pt-4 border-t">
                        <p>Super Login bypasses OTP verification</p>
                        <p className="text-orange-600 font-semibold mt-1">For development/testing only</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
