"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

interface RealtimeDataOptions {
  interval?: number
  maxRetries?: number
  retryDelay?: number
  onError?: (error: Error) => void
  onUpdate?: (data: any) => void
}

interface RealtimeDataState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  lastUpdated: Date | null
  isConnected: boolean
  retryCount: number
}

export function useRealtimeData<T>(
  fetchFunction: () => Promise<T>,
  options: RealtimeDataOptions = {}
) {
  const {
    interval = 30000, // 30 seconds
    maxRetries = 3,
    retryDelay = 5000,
    onError,
    onUpdate
  } = options

  const [state, setState] = useState<RealtimeDataState<T>>({
    data: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
    isConnected: true,
    retryCount: 0
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const data = await fetchFunction()
      
      if (!isMountedRef.current) return

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        isConnected: true,
        retryCount: 0
      }))

      onUpdate?.(data)
    } catch (error) {
      if (!isMountedRef.current) return

      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorObj,
        isConnected: false,
        retryCount: prev.retryCount + 1
      }))

      onError?.(errorObj)

      // Retry logic
      if (state.retryCount < maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchData()
          }
        }, retryDelay)
      }
    }
  }, [fetchFunction, maxRetries, retryDelay, onError, onUpdate, state.retryCount])

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        fetchData()
      }
    }, interval)
  }, [fetchData, interval])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reconnect = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0, error: null }))
    fetchData()
    startPolling()
  }, [fetchData, startPolling])

  const forceUpdate = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Initialize data fetching
  useEffect(() => {
    fetchData()
    startPolling()

    return () => {
      stopPolling()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [fetchData, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      stopPolling()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [stopPolling])

  return {
    ...state,
    reconnect,
    forceUpdate,
    startPolling,
    stopPolling
  }
}

// Specialized hook for dashboard stats
export function useDashboardStats(userId: string) {
  const fetchStats = useCallback(async () => {
    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      coursesEnrolled: Math.floor(Math.random() * 20) + 5,
      coursesCompleted: Math.floor(Math.random() * 15) + 3,
      totalLearningHours: Math.floor(Math.random() * 200) + 50,
      achievements: Math.floor(Math.random() * 10) + 2,
      weeklyProgress: Math.floor(Math.random() * 100),
      streakDays: Math.floor(Math.random() * 30) + 1,
      totalStudents: Math.floor(Math.random() * 10000) + 1000,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      lastActivity: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
      nextGoal: 'Complete React Advanced Course'
    }
  }, [userId])

  return useRealtimeData(fetchStats, {
    interval: 30000, // Update every 30 seconds
    maxRetries: 3,
    retryDelay: 5000
  })
}

// Hook for real-time notifications
export function useRealtimeNotifications(userId: string) {
  const fetchNotifications = useCallback(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const now = new Date()
    return [
      {
        id: '1',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "Code Master" badge for completing 5 courses',
        timestamp: new Date(now.getTime() - 2 * 60000),
        isRead: false,
        actionUrl: '/achievements',
        actionText: 'View Badges'
      },
      {
        id: '2',
        type: 'course',
        title: 'New Course Available',
        message: 'Check out the new "Advanced TypeScript" course',
        timestamp: new Date(now.getTime() - 10 * 60000),
        isRead: false,
        actionUrl: '/courses',
        actionText: 'Explore'
      }
    ]
  }, [userId])

  return useRealtimeData(fetchNotifications, {
    interval: 60000, // Update every minute
    maxRetries: 2,
    retryDelay: 3000
  })
}

// Hook for activity feed
export function useRealtimeActivity(userId: string) {
  const fetchActivity = useCallback(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const now = new Date()
    return [
      {
        id: '1',
        type: 'course_completed',
        title: 'Course Completed!',
        description: 'You completed "Advanced React Patterns"',
        timestamp: new Date(now.getTime() - 5 * 60000),
        course: {
          title: 'Advanced React Patterns',
          category: 'React'
        },
        isNew: true
      },
      {
        id: '2',
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        description: 'You earned the "Code Master" badge',
        timestamp: new Date(now.getTime() - 15 * 60000),
        achievement: {
          name: 'Code Master',
          icon: '🏆'
        },
        isNew: true
      }
    ]
  }, [userId])

  return useRealtimeData(fetchActivity, {
    interval: 45000, // Update every 45 seconds
    maxRetries: 2,
    retryDelay: 4000
  })
}
