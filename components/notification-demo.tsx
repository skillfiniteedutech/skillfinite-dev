"use client"

import { useEffect } from 'react'
import { useNotificationIntegration } from '@/hooks/use-notification-integration'

export function NotificationDemo() {
  const notifications = useNotificationIntegration()

  useEffect(() => {
    // Generate some demo notifications after a delay
    const timer = setTimeout(() => {
      // Demo notifications
      notifications.notifyNewCourse({
        id: 'demo-course-1',
        title: 'Advanced React Patterns',
        category: 'Web Development',
        level: 'Advanced',
        price: 99,
        free: false
      })

      notifications.notifyAchievement({
        id: 'demo-achievement-1',
        name: 'First Course Completed',
        description: 'You completed your first course!'
      })

      notifications.notifyLearningStreak(7)

      notifications.notifyCourseReminder({
        id: 'demo-course-2',
        title: 'JavaScript Fundamentals',
        category: 'Programming'
      }, 3)

      notifications.notifySystemUpdate('We\'ve added new features to improve your learning experience!')

    }, 5000) // Show notifications after 5 seconds

    return () => clearTimeout(timer)
  }, [notifications])

  return null // This component doesn't render anything
}
