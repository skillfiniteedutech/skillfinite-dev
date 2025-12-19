import { useEffect } from 'react'
import { useNotifications } from '@/components/notification-context'
import { notificationService } from '@/services/notification-service'

export function useNotificationIntegration() {
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Subscribe to notification service
    const unsubscribe = notificationService.subscribe((notification) => {
      addNotification(notification)
    })

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return unsubscribe
  }, [addNotification])

  return {
    notifyNewCourse: notificationService.notifyNewCourse.bind(notificationService),
    notifyCourseUpdate: notificationService.notifyCourseUpdate.bind(notificationService),
    notifyCourseEnrollment: notificationService.notifyCourseEnrollment.bind(notificationService),
    notifyCourseCompletion: notificationService.notifyCourseCompletion.bind(notificationService),
    notifyAchievement: notificationService.notifyAchievement.bind(notificationService),
    notifyCertificateEarned: notificationService.notifyCertificateEarned.bind(notificationService),
    notifyLearningStreak: notificationService.notifyLearningStreak.bind(notificationService),
    notifyWeeklyProgress: notificationService.notifyWeeklyProgress.bind(notificationService),
    notifySystemUpdate: notificationService.notifySystemUpdate.bind(notificationService),
    notifyMaintenance: notificationService.notifyMaintenance.bind(notificationService),
    notifyCourseReminder: notificationService.notifyCourseReminder.bind(notificationService),
    notifyAssignmentDeadline: notificationService.notifyAssignmentDeadline.bind(notificationService),
    notifyCustom: notificationService.notifyCustom.bind(notificationService),
    notifyBulkEvents: notificationService.notifyBulkEvents.bind(notificationService)
  }
}
