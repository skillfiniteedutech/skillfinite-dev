"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface Notification {
  id: string
  type: 'course' | 'achievement' | 'message' | 'reminder' | 'system' | 'enrollment' | 'update'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
  userId?: string
  metadata?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
  getNotificationsByType: (type: Notification['type']) => Notification[]
  getUnreadNotifications: () => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const savedNotifications = localStorage.getItem(`notifications-${user.id}`)
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications)
          setNotifications(parsed)
        } catch (error) {
          console.error('Failed to parse saved notifications:', error)
        }
      }
    }
  }, [user?.id])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user?.id && notifications.length > 0) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(notifications))
    }
  }, [notifications, user?.id])

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      userId: user?.id
    }

    setNotifications(prev => [newNotification, ...prev])

    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type)
  }

  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
