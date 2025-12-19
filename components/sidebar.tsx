"use client"
import {
  BarChart3,
  BookOpen,
  Calendar,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Bell,
  Crown,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sidebarItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: BookOpen, label: "My courses", href: "/courses" },
    { icon: Calendar, label: "Schedule", href: "/schedule" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LogOut, label: "Log out", href: "/logout" },
  ]

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "48px" : "176px")
  }, [isCollapsed])

  return (
    <div
      className={cn(
        "bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col transition-all duration-300 z-50",
        isCollapsed ? "w-12" : "w-44",
      )}
    >
      {/* Header with toggle */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5">
            <img 
              src="/logo.png" 
              alt="Skillfinite Logo" 
              className="w-6 h-6 object-contain"
            />
            <span className="font-semibold text-sm">Skillfinite</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 p-0 hover:bg-gray-100"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || (item.label === "My courses" && pathname === "/")
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors relative group",
                    isActive ? "bg-purple-50 text-purple-600" : "text-gray-600 hover:bg-gray-50",
                    isCollapsed && "justify-center",
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {!isCollapsed && item.label}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Premium Section */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 relative overflow-hidden">
            <div className="absolute top-1.5 right-1.5">
              <Crown className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-0.5 text-xs">Go premium</h3>
            <p className="text-[10px] text-gray-600 mb-2">Unlock our special feature by subscribe our pack</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] h-6">Subscribe</Button>
          </div>
        </div>
      )}
    </div>
  )
}
