'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthStatus() {
  const [token, setToken] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage
        const localToken = localStorage.getItem('token')
        const localUser = localStorage.getItem('user')

        setToken(localToken)
        if (localUser) {
          try {
            setUser(JSON.parse(localUser))
          } catch (e) {
            console.warn('Failed to parse user from localStorage:', e)
          }
        }

        // Check session API - DISABLED to prevent infinite loops
        // The session API is failing and causing repeated 401 errors
        // Commenting out to improve performance and prevent loops
        /*
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
          const response = await fetch(`${baseUrl}/api/auth/session`, {
            method: 'GET',
            credentials: 'include',
          })

          if (response.ok) {
            const data = await response.json()
            setSessionToken(data.token)
          }
        } catch (error) {
          console.warn('Failed to get session:', error)
        }
        */
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)

    // Also clear session cookies
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
    fetch(`${baseUrl}/api/auth/session`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch(console.warn)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading auth status...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Local Storage Token:</div>
          <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
            {token ? `${token.substring(0, 20)}...` : 'Not found'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Session API Token:</div>
          <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
            {sessionToken ? `${sessionToken.substring(0, 20)}...` : 'Not found'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">User Info:</div>
          <div className="text-xs bg-gray-100 p-2 rounded">
            {user ? (
              <pre>{JSON.stringify(user, null, 2)}</pre>
            ) : (
              'Not found'
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/login'}
            className="flex-1"
          >
            Go to Login
          </Button>
          <Button
            variant="destructive"
            onClick={clearAuth}
            className="flex-1"
          >
            Clear Auth
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
