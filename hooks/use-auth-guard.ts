'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-context'

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
  requireGuest?: boolean
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { redirectTo = '/login', requireAuth = true, requireGuest = false } = options

  useEffect(() => {
    if (isLoading) return

    // If auth is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // If guest access is required and user is authenticated
    if (requireGuest && isAuthenticated) {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, isLoading, requireAuth, requireGuest, redirectTo, router])

  return {
    isAuthenticated,
    isLoading,
    isProtected: requireAuth,
    isGuestOnly: requireGuest,
  }
}

// Convenience hooks for common use cases
export function useRequireAuth(redirectTo?: string) {
  return useAuthGuard({ requireAuth: true, redirectTo })
}

export function useRequireGuest() {
  return useAuthGuard({ requireGuest: true })
}

export function useOptionalAuth() {
  return useAuthGuard({ requireAuth: false })
}
