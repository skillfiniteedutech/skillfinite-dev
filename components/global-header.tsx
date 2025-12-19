"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, ShoppingCart, Moon, Sun, BookOpen, Search } from "lucide-react"
import Image from "next/image"

export interface GlobalHeaderProps {
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
}

export function GlobalHeader({
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
}: GlobalHeaderProps) {
  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
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

          {/* Navigation and Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
              onClick={onExploreClick}
            >
              Explore
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
              onClick={onMyCoursesClick}
            >
              My Courses
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
              onClick={onCommunityClick}
            >
              Community
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-colors relative"
              onClick={onWishlistClick}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleTheme}
              className="hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950 transition-all duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
