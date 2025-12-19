"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// Routes that should show the sidebar (authenticated pages)
const SIDEBAR_ROUTES = [
  "/dashboard",
  "/courses",
  "/course",
  "/checkout",
  "/mycourses",
  "/schedule",
  "/messages",
  "/notifications",
  "/community",
  "/reports",
  "/teams",
  "/library",
  "/settings",
  "/profile",
]

// Routes that should NOT show the sidebar (public pages)
const PUBLIC_ROUTES = ["/", "/landing", "/login", "/signup", "/forgot-password", "/reset-password", "/about", "/contact"]

interface ConditionalSidebarLayoutProps {
  children: React.ReactNode
}

export function ConditionalSidebarLayout({ children }: ConditionalSidebarLayoutProps) {
  const pathname = usePathname()

  // Check if current route should show sidebar
  const shouldShowSidebar =
    SIDEBAR_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/")) &&
    !PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (shouldShowSidebar) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full bg-background flex">
          <AppSidebar />
          <div className="flex-1 min-w-0 w-full overflow-auto">
            {children}
          </div>
        </div>
      </SidebarProvider>
    )
  }

  // For public pages, render without sidebar
  return <div className="min-h-screen bg-background">{children}</div>
}
