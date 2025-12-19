"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { GlobalHeader } from "./global-header"

interface LayoutProps {
  children: React.ReactNode
  brandTitle?: string
  query?: string
  onQueryChange?: (value: string) => void
  searchRef?: React.RefObject<HTMLInputElement | null>
  favoritesCount?: number
  onWishlistClick?: () => void
  cartCount?: number
  onCartClick?: () => void
  notificationCount?: number
  onNotificationClick?: () => void
  onExploreClick?: () => void
  onMyCoursesClick?: () => void
  onCommunityClick?: () => void
  onDashboardClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
  } | null
}

export function Layout({
  children,
  brandTitle = "Skillfinite",
  query = "",
  onQueryChange,
  searchRef,
  favoritesCount = 0,
  onWishlistClick,
  cartCount = 0,
  onCartClick,
  notificationCount = 0,
  onNotificationClick,
  onExploreClick,
  onMyCoursesClick,
  onCommunityClick,
  onDashboardClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  user
}: LayoutProps) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default handlers if not provided
  const defaultHandlers = {
    onExploreClick: onExploreClick || (() => router.push('/courses')),
    onMyCoursesClick: onMyCoursesClick || (() => router.push('/mycourses')),
    onCommunityClick: onCommunityClick || (() => router.push('/community')),
    onDashboardClick: onDashboardClick || (() => router.push('/dashboard')),
    onProfileClick: onProfileClick || (() => router.push('/profile')),
    onSettingsClick: onSettingsClick || (() => router.push('/settings')),
    onLogout: onLogout || (() => {
      localStorage.removeItem('token')
      router.push('/login')
    }),
    onWishlistClick: onWishlistClick || (() => router.push('/wishlist')),
    onCartClick: onCartClick || (() => router.push('/cart')),
    onNotificationClick: onNotificationClick || (() => router.push('/notifications')),
    onToggleTheme: () => mounted && setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <GlobalHeader
        brandTitle={brandTitle}
        query={query}
        onQueryChange={onQueryChange}
        searchRef={searchRef}
        favoritesCount={favoritesCount}
        onWishlistClick={defaultHandlers.onWishlistClick}
        cartCount={cartCount}
        onCartClick={defaultHandlers.onCartClick}
        isDark={mounted ? resolvedTheme === "dark" : false}
        onToggleTheme={defaultHandlers.onToggleTheme}
        onExploreClick={defaultHandlers.onExploreClick}
        onMyCoursesClick={defaultHandlers.onMyCoursesClick}
        onCommunityClick={defaultHandlers.onCommunityClick}
      />
      
      <main className="bg-background">
        {children}
      </main>
    </div>
  )
}

