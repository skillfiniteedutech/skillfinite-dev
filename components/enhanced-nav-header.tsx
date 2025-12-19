"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Icons
import {
  BookOpen,
  Search,
  Heart,
  ShoppingCart,
  Moon,
  Sun,
  Home,
  GraduationCap,
  Users,
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface EnhancedNavHeaderProps {
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
  isDark?: boolean
  onToggleTheme?: () => void
  onExploreClick?: () => void
  onMyCoursesClick?: () => void
  onCommunityClick?: () => void
  onDashboardClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
  user?: UserProfile | null
}

export function EnhancedNavHeader({
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
  isDark = false,
  onToggleTheme,
  onExploreClick,
  onMyCoursesClick,
  onCommunityClick,
  onDashboardClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  user
}: EnhancedNavHeaderProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    {
      title: "Explore",
      icon: Search,
      onClick: onExploreClick,
      href: "/courses"
    },
    {
      title: "My Courses",
      icon: GraduationCap,
      onClick: onMyCoursesClick,
      href: "/mycourses"
    },
    {
      title: "Community",
      icon: Users,
      onClick: onCommunityClick,
      href: "/community"
    }
  ]

  const handleNavigation = (href: string, onClick?: () => void) => {
    if (onClick) {
      onClick()
    } else {
      router.push(href)
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('/dashboard', onDashboardClick)}
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Skillfinite Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {brandTitle}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  onClick={() => handleNavigation(item.href, item.onClick)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.title}</span>
                </Button>
              )
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
              <Input
                ref={searchRef}
                placeholder="Search for courses... (Press / to focus)"
                className="pl-10 bg-background/50 border-border/50 focus:border-blue-600 focus:ring-blue-600/20 transition-all duration-200 rounded-full"
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="relative hover:bg-muted/50 transition-colors"
            >
              {mounted && (
                <>
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationClick}
              className="relative hover:bg-muted/50 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-background">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onWishlistClick}
              className="relative hover:bg-muted/50 transition-colors hidden sm:flex"
            >
              <Heart className="h-4 w-4" />
              {favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-background">
                  {favoritesCount > 9 ? "9+" : favoritesCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative hover:bg-muted/50 transition-colors hidden sm:flex"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-blue-600 text-white border-2 border-background">
                  {cartCount > 9 ? "9+" : cartCount}
                </Badge>
              )}
            </Button>

            {/* User Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-600/20 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      {user.role && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user.role}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => router.push('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search for courses..."
                  className="pl-10 bg-background/50 border-border/50 focus:border-blue-600 focus:ring-blue-600/20 transition-all duration-200"
                  value={query}
                  onChange={(e) => onQueryChange?.(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => handleNavigation(item.href, item.onClick)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </Button>
                )
              })}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onWishlistClick}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist {favoritesCount > 0 && `(${favoritesCount})`}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCartClick}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
