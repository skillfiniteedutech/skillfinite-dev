"use client"

import * as React from "react"
import {
  BookOpen,
  Calendar,
  FileText,
  Home,
  Library,
  MessageSquare,
  Settings,
  Users,
  Bell,
  Users2,
  BarChart3,
  LogOut,
  ChevronDown,
  Search,
  Star,
  Award,
  TrendingUp,
  User,
  CreditCard,
  HelpCircle,
  Clock,
} from "@/lib/icons"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Main navigation items
const mainItems = [
  {
    title: "Explore",
    url: "/courses",
    icon: Search,
    badge: "3",
  },
  {
    title: "My courses",
    url: "/mycourses",
    icon: BookOpen,
    badge: null,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
    badge: null,
  },
]

// Communication items
const communicationItems = [
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: "12",
  },
  {
    title: "Community",
    url: "/community",
    icon: Users2,
    badge: null,
  },
]

// Management items
const managementItems = [
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    badge: null,
  },
  {
    title: "Announancement",
    url: "/Announancement",
    icon: Bell,
    badge: null,
  },
  {
    title: "Certificates",
    url: "/Certificates",
    icon: Award,
    badge: null,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // Get user data from auth context
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    initials: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
  } : null

  const isActive = (url: string) => {
    if (url === "/courses" && pathname === "/") return true
    return pathname === url
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img 
            src="/logo.png" 
            alt="Skillfinite Logo" 
            className="h-6 w-6 object-contain"
          />
          <span className="text-sm font-semibold text-foreground group-data-[collapsible=icon]:hidden">Skillfinite</span>
        </div>

      </SidebarHeader>

      <SidebarContent>
        {/* <div className="group-data-[collapsible=icon]:hidden px-2 ">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-gray-200 bg-gray-50 pl-7 pr-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300"
            />
          </div>
        </div> */}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} className="text-xs relative transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <a href={item.url} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </div>
                      {item.badge && (
                        <>
                          <Badge
                            className="h-4 px-1.5 text-xs bg-primary text-primary-foreground group-data-[collapsible=icon]:hidden shadow-sm hover:shadow-md transition-all"
                          >
                            {item.badge}
                          </Badge>
                          <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full group-data-[collapsible=icon]:block hidden animate-pulse"></div>
                        </>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
            Communication
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} className="text-xs relative">
                    <a href={item.url} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </div>
                      {item.badge && (
                        <>
                          <Badge
                            className="h-4 px-1.5 text-xs bg-destructive text-destructive-foreground group-data-[collapsible=icon]:hidden"
                          >
                            {item.badge}
                          </Badge>
                          <div className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full group-data-[collapsible=icon]:block hidden"></div>
                        </>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} className="text-xs">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500">Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-gray-600">Progress</span>
                </div>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3 text-yellow-500" />
                  <span className="text-gray-600">Certificates</span>
                </div>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-purple-500" />
                  <span className="text-gray-600">Rating</span>
                </div>
                <span className="font-medium">4.8</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-6 w-6 rounded-lg">
                    <AvatarImage src={userData?.avatar || "/placeholder-user.jpg"} alt={userData?.name || "User"} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs">
                      {userData?.initials || (userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{userData?.name || "User"}</span>
                    <span className="truncate text-xs text-muted-foreground">{userData?.email || "user@example.com"}</span>
                  </div>
                  <ChevronDown className="ml-auto size-3 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData?.avatar || "/placeholder-user.jpg"} alt={userData?.name || "User"} />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                        {userData?.initials || (userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData?.name || "User"}</span>
                      <span className="truncate text-xs text-muted-foreground">{userData?.email || "user@example.com"}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/billing" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/support" className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
