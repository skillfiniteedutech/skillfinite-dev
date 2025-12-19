'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear auth data from localStorage
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }

    // Clear cookies by calling the session API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
    fetch(`${baseUrl}/api/auth/session`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch(error => {
      console.warn('Failed to clear session cookies:', error)
    })

    // Redirect to login page
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  )
}
