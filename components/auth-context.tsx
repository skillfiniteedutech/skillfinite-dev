'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie, deleteCookie } from '@/lib/cookies'

interface User {
  id: string
  email: string
  name: string
  role?: string
  avatar?: string
  phone?: string
  bio?: string
  location?: string
  occupation?: string
  company?: string
  website?: string
  coursesEnrolled?: number
  coursesCompleted?: number
  totalLearningHours?: number
  achievements?: string[]
  dateJoined?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, user: User, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  refreshUser: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async (): Promise<boolean> => {
    try {
      // First check localStorage
      const localToken = localStorage.getItem('token')
      const localUser = localStorage.getItem('user')

      if (localToken && localUser) {
        try {
          const parsedUser = JSON.parse(localUser)
          setToken(localToken)
          setUser(parsedUser)
          return true
        } catch (e) {
          console.warn('Failed to parse user from localStorage:', e)
        }
      }

      // Then check session API
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      const response = await fetch(`${baseUrl}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.token) {
          setToken(data.token)
          // Try to get user info from localStorage or set a basic user
          if (localUser) {
            try {
              setUser(JSON.parse(localUser))
            } catch {
              // Set basic user info if we can't parse localStorage
              setUser({
                id: 'unknown',
                email: 'user@example.com',
                name: 'User'
              })
            }
          }
          return true
        }
      }

      return false
    } catch (error) {
      console.warn('Auth check failed:', error)
      return false
    }
  }

  const login = async (token: string, user: User, rememberMe: boolean = false) => {
    try {
      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Set cookie for middleware authentication
      const cookieDays = rememberMe ? 30 : 7
      setCookie('auth_token', token, cookieDays)

      // Set session cookies
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      await fetch(`${baseUrl}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rememberMe }),
      })

      setToken(token)
      setUser(user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('skillfinite-profile')

      // Clear auth cookie
      deleteCookie('auth_token')

      // Clear session cookies
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      await fetch(`${baseUrl}/api/auth/session`, {
        method: 'DELETE',
        credentials: 'include',
      })

      setToken(null)
      setUser(null)

      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const currentToken = token || localStorage.getItem('token')
      if (!currentToken) {
        console.log('No token available for user refresh')
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'

      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${baseUrl}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        credentials: 'include',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          const updatedUser: User = {
            id: data.data.id,
            email: data.data.email,
            name: data.data.name,
            role: data.data.role,
            avatar: data.data.avatar,
            phone: data.data.phone,
            bio: data.data.bio,
            location: data.data.location,
            occupation: data.data.occupation,
            company: data.data.company,
            website: data.data.website,
            coursesEnrolled: data.data.coursesEnrolled,
            coursesCompleted: data.data.coursesCompleted,
            totalLearningHours: data.data.totalLearningHours,
            dateJoined: data.data.dateJoined
          }

          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          localStorage.setItem('skillfinite-profile', JSON.stringify(data.data))
        }
      } else {
        console.warn('Failed to refresh user data:', response.status, response.statusText)
        // If the response is 401, the token might be invalid
        if (response.status === 401) {
          console.log('Token appears to be invalid, clearing auth state')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timeout while refreshing user data')
      } else {
        console.error('Failed to refresh user data:', error)
      }

      // If it's a network error, don't clear the auth state
      // The user might still be valid, just the network is down
      if (error instanceof Error && error.name !== 'TypeError' || !(error instanceof Error) || !error.message.includes('Failed to fetch')) {
        console.log('Network error, keeping current auth state')
      }
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    checkAuth,
    refreshUser,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}