"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { useAuth } from "@/components/auth-context"
import { User, Settings, LogOut, CreditCard, Bell } from "lucide-react"

export function UserDropdown() {
  const { user, logout, isAuthenticated, refreshUser } = useAuth()
  const router = useRouter()
  
  // Refresh user data on mount to ensure latest info
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser().catch(error => {
        console.warn('Failed to refresh user data on mount:', error)
        // Don't throw the error, just log it
        // The user can still use the app with cached data
      })
    }
  }, [isAuthenticated])

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const handleBillingClick = () => {
    router.push("/profile/billing")
  }

  const handleLogout = () => {
    logout()
  }

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="ghost"
        onClick={() => router.push("/login")}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
      </Button>
    )
  }

  return (
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
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBillingClick} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
