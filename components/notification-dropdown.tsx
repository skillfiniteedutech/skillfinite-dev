"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Check,
  X,
  Trash2,
  BookOpen,
  Award,
  MessageCircle,
  Calendar,
  AlertCircle,
  Info
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useNotifications } from "@/components/notification-context"

export function NotificationDropdown() {
  const { user } = useAuth()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />
      case 'message':
        return <MessageCircle className="w-4 h-4 text-green-500" />
      case 'reminder':
        return <Calendar className="w-4 h-4 text-orange-500" />
      case 'system':
        return <Info className="w-4 h-4 text-gray-500" />
      case 'enrollment':
        return <BookOpen className="w-4 h-4 text-green-500" />
      case 'update':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <DropdownMenuLabel className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getRelativeTime(notification.timestamp)}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                            >
                              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <Separator className="mx-4" />
                )}
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Navigate to all notifications */ }}
                className="w-full text-sm"
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
