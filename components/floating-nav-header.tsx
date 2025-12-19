"use client"

import React from "react"
import { FloatingDock } from "@/components/ui/floating-dock"
import {
  BookOpen,
  Search,
  Heart,
  ShoppingCart,
  Moon,
  Sun,
  Home,
  GraduationCap,
  Users
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export interface FloatingNavHeaderProps {
  brandTitle?: string
  query?: string
  onQueryChange?: (value: string) => void
  searchRef?: React.RefObject<HTMLInputElement | null>
  favoritesCount?: number
  onWishlistClick?: () => void
  cartCount?: number
  onCartClick?: () => void
  isDark?: boolean
  onToggleTheme?: () => void
  onExploreClick?: () => void
  onMyCoursesClick?: () => void
  onCommunityClick?: () => void
  onDashboardClick?: () => void
}

export function FloatingNavHeader({
  brandTitle = "Skillfinite",
  query = "",
  onQueryChange,
  searchRef,
  favoritesCount = 0,
  onWishlistClick,
  cartCount = 0,
  onCartClick,
  isDark = false,
  onToggleTheme,
  onExploreClick,
  onMyCoursesClick,
  onCommunityClick,
  onDashboardClick,
}: FloatingNavHeaderProps) {

  const navItems = [
    {
      title: "Explore",
      icon: <Search className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: onExploreClick,
    },
    {
      title: "My Courses",
      icon: <GraduationCap className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: onMyCoursesClick,
    },
    {
      title: "Community",
      icon: <Users className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: onCommunityClick,
    },
    {
      title: "Skillfinite",
      icon: (
        <Image
          src="/logo.png"
          alt="Skillfinite Logo"
          width={24}
          height={24}
          className="h-full w-full"
        />
      ),
      onClick: onDashboardClick,
    },
    {
      title: `Wishlist ${favoritesCount > 0 ? `(${favoritesCount})` : ''}`,
      icon: (
        <div className="relative">
          <Heart className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
      ),
      onClick: onWishlistClick,
    },
    {
      title: `Cart ${cartCount > 0 ? `(${cartCount})` : ''}`,
      icon: (
        <div className="relative">
          <ShoppingCart className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ),
      onClick: onCartClick,
    },
    {
      title: isDark ? "Light Mode" : "Dark Mode",
      icon: isDark ?
        <Sun className="h-full w-full text-neutral-500 dark:text-neutral-300" /> :
        <Moon className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: onToggleTheme,
    },
  ]

  return (
    <div className="w-full">
      {/* Brand and Search Bar */}
      <div className="flex items-center justify-between px-4 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onDashboardClick}
        >
          <Image
            src="/logo.png"
            alt="Skillfinite Logo"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {brandTitle}
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
            <Input
              ref={searchRef}
              placeholder="Search for courses... (Press / to focus)"
              className="pl-10 bg-background/50 border-border/50 focus:border-blue-600 focus:ring-blue-600/20 transition-all duration-200"
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock
          items={navItems}
          desktopClassName="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-gray-200/50 dark:border-neutral-800/50 shadow-xl"
          mobileClassName="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-gray-200/50 dark:border-neutral-800/50 shadow-xl"
        />
      </div>
    </div>
  )
}
