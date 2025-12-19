/**
 * Course progress calculation utilities
 */

export interface Lesson {
  lessonId: string
  title: string
  type: 'video' | 'document' | 'quiz'
  resourceId: string
  order: number
}

export interface Module {
  moduleId: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export interface ProgressData {
  completedVideos: string[]
  completedDocuments: string[]
  completedQuizzes: string[]
}

/**
 * Calculate total lessons from curriculum
 */
export function calculateTotalLessons(curriculum: Module[]): number {
  return curriculum.reduce((total, module) => total + (module.lessons?.length || 0), 0)
}

/**
 * Calculate completed lessons count
 */
export function calculateCompletedLessons(progress: ProgressData): number {
  return progress.completedVideos.length + 
         progress.completedDocuments.length + 
         progress.completedQuizzes.length
}

/**
 * Calculate progress percentage
 */
export function calculateProgressPercentage(progress: ProgressData, curriculum: Module[]): number {
  const totalLessons = calculateTotalLessons(curriculum)
  const completedLessons = calculateCompletedLessons(progress)
  
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

/**
 * Check if a lesson is completed
 */
export function isLessonCompleted(
  lesson: Lesson, 
  progress: ProgressData
): boolean {
  switch (lesson.type) {
    case 'video':
      return progress.completedVideos.includes(lesson.resourceId)
    case 'document':
      return progress.completedDocuments.includes(lesson.resourceId)
    case 'quiz':
      return progress.completedQuizzes.includes(lesson.resourceId)
    default:
      return false
  }
}

/**
 * Find the next incomplete lesson
 */
export function findNextLesson(
  curriculum: Module[], 
  progress: ProgressData
): Lesson | null {
  for (const module of curriculum) {
    for (const lesson of module.lessons || []) {
      if (!isLessonCompleted(lesson, progress)) {
        return lesson
      }
    }
  }
  return null
}

/**
 * Get module progress percentage
 */
export function getModuleProgress(module: Module, progress: ProgressData): number {
  const totalLessons = module.lessons.length
  const completedLessons = module.lessons.filter(lesson => 
    isLessonCompleted(lesson, progress)
  ).length
  
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

/**
 * Check if course is completed
 */
export function isCourseCompleted(
  curriculum: Module[], 
  progress: ProgressData
): boolean {
  const totalLessons = calculateTotalLessons(curriculum)
  const completedLessons = calculateCompletedLessons(progress)
  return totalLessons > 0 && completedLessons >= totalLessons
}

/**
 * Get progress summary
 */
export function getProgressSummary(
  curriculum: Module[], 
  progress: ProgressData
) {
  const totalLessons = calculateTotalLessons(curriculum)
  const completedLessons = calculateCompletedLessons(progress)
  const progressPercentage = calculateProgressPercentage(progress, curriculum)
  const nextLesson = findNextLesson(curriculum, progress)
  const isCompleted = isCourseCompleted(curriculum, progress)

  return {
    totalLessons,
    completedLessons,
    progressPercentage,
    nextLesson,
    isCompleted,
    completedVideos: progress.completedVideos.length,
    completedDocuments: progress.completedDocuments.length,
    completedQuizzes: progress.completedQuizzes.length
  }
}
