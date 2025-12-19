import { Notification } from '@/components/notification-context'

export class NotificationService {
  private static instance: NotificationService
  private listeners: Array<(notification: Notification) => void> = []

  private constructor() { }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Subscribe to notifications
  subscribe(listener: (notification: Notification) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Emit notification to all listeners
  private emit(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const fullNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    }

    this.listeners.forEach(listener => listener(fullNotification))
  }

  // Course-related notifications
  notifyNewCourse(course: any) {
    this.emit({
      type: 'course',
      title: 'New Course Available! 🎉',
      message: `${course.title} is now available for enrollment. Start learning today!`,
      priority: 'medium',
      actionUrl: `/courses/${course.id}`
    })
  }

  notifyCourseUpdate(course: any, updateType: string) {
    this.emit({
      type: 'update',
      title: 'Course Updated',
      message: `${course.title} has been updated with new ${updateType}.`,
      priority: 'low',
      actionUrl: `/courses/${course.id}`
    })
  }

  notifyCourseEnrollment(course: any) {
    this.emit({
      type: 'enrollment',
      title: 'Successfully Enrolled! ✅',
      message: `You've been enrolled in ${course.title}. Start your learning journey!`,
      priority: 'high',
      actionUrl: `/mycourses`
    })
  }

  notifyCourseCompletion(course: any) {
    this.emit({
      type: 'achievement',
      title: 'Course Completed! 🏆',
      message: `Congratulations! You've completed ${course.title}. Great job!`,
      priority: 'high',
      actionUrl: `/mycourses`
    })
  }

  // Achievement notifications
  notifyAchievement(achievement: any) {
    this.emit({
      type: 'achievement',
      title: 'Achievement Unlocked! 🎖️',
      message: `You've earned the "${achievement.name}" achievement!`,
      priority: 'high',
      actionUrl: '/achievements'
    })
  }

  notifyCertificateEarned(course: any) {
    this.emit({
      type: 'achievement',
      title: 'Certificate Earned! 📜',
      message: `You've earned a certificate for completing ${course.title}!`,
      priority: 'high',
      actionUrl: '/certificates'
    })
  }

  // Learning progress notifications
  notifyLearningStreak(days: number) {
    this.emit({
      type: 'achievement',
      title: 'Learning Streak! 🔥',
      message: `Amazing! You've maintained a ${days}-day learning streak. Keep it up!`,
      priority: 'medium',
      actionUrl: '/dashboard'
    })
  }

  notifyWeeklyProgress(completedCourses: number, totalHours: number) {
    this.emit({
      type: 'system',
      title: 'Weekly Progress Report',
      message: `This week you completed ${completedCourses} courses and spent ${totalHours} hours learning!`,
      priority: 'low',
      actionUrl: '/dashboard'
    })
  }

  // System notifications
  notifySystemUpdate(updateInfo: string) {
    this.emit({
      type: 'system',
      title: 'System Update',
      message: updateInfo,
      priority: 'low',
      actionUrl: '/updates'
    })
  }

  notifyMaintenance(maintenanceInfo: string) {
    this.emit({
      type: 'system',
      title: 'Scheduled Maintenance',
      message: maintenanceInfo,
      priority: 'medium',
      actionUrl: '/status'
    })
  }

  // Reminder notifications
  notifyCourseReminder(course: any, daysSinceLastAccess: number) {
    this.emit({
      type: 'reminder',
      title: 'Continue Your Learning',
      message: `You haven't accessed ${course.title} in ${daysSinceLastAccess} days. Continue your progress!`,
      priority: 'medium',
      actionUrl: `/courses/${course.id}`
    })
  }

  notifyAssignmentDeadline(assignment: any, hoursLeft: number) {
    this.emit({
      type: 'reminder',
      title: 'Assignment Deadline Approaching',
      message: `${assignment.title} is due in ${hoursLeft} hours. Don't miss it!`,
      priority: 'high',
      actionUrl: `/assignments/${assignment.id}`
    })
  }

  // Custom notifications
  notifyCustom(title: string, message: string, type: Notification['type'] = 'system', priority: Notification['priority'] = 'medium', actionUrl?: string) {
    this.emit({
      type,
      title,
      message,
      priority,
      actionUrl
    })
  }

  // Bulk notifications for multiple events
  notifyBulkEvents(events: Array<{
    type: Notification['type']
    title: string
    message: string
    priority: Notification['priority']
    actionUrl?: string
  }>) {
    events.forEach(event => {
      this.emit(event)
    })
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()
